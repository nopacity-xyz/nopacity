import { mine } from '@nomicfoundation/hardhat-network-helpers'
import { expect } from 'chai'
import { BigNumber } from 'ethers'
import { ethers } from 'hardhat'

import { deployCloneFactory } from '../scripts/deployFactory'
import { deployTestPaymentToken } from '../scripts/deployTestPaymentToken'

const daoName = 'ETHSD'
const daoDescription = 'ETHSD'
const votingDelay = 1
const votingPeriod = 50400 // 1 sweek
const tokenName = 'ETHSD Dao Token'
const tokenSymbol = 'ETHSD'
const timelockDelay = 300 // 1 hour
const quorumFraction = 1

async function deployFixtures() {
  const provider = ethers.provider

  const [owner, voter, payee] = await ethers.getSigners()

  const paymentFixtures = await deployTestPaymentToken()
  const cloneFactoryFixtures = await deployCloneFactory()

  const ourCloneFactory = cloneFactoryFixtures.ourCloneFactory

  const nonce = await provider.getTransactionCount(ourCloneFactory.address)
  const getNextAddressFromFactory = async (offset: number) => {
    return ethers.utils.getContractAddress({
      from: ourCloneFactory.address,
      nonce: offset + 1
    })
  }

  const determinedGovernorAddress = await getNextAddressFromFactory(nonce)
  const determinedTokenAddress = await getNextAddressFromFactory(nonce + 1)

  await ourCloneFactory.createDAO(
    daoName,
    daoDescription,
    determinedGovernorAddress,
    determinedTokenAddress,
    paymentFixtures.paymentToken.address,
    votingDelay,
    votingPeriod,
    quorumFraction,
    tokenName,
    tokenSymbol,
    { gasLimit: 3000000 }
  )

  const govStruct = await ourCloneFactory.getSpecificDAO(0)
  const dao = cloneFactoryFixtures.OurGovernor.attach(govStruct.governor)
  const voteToken = cloneFactoryFixtures.OurVoteToken.attach(govStruct.erc721)
  const timelock = cloneFactoryFixtures.OurTimelock.attach(govStruct.timelock)

  return {
    ...cloneFactoryFixtures,
    ...paymentFixtures,

    dao,
    timelock,
    voteToken,

    owner,
    payee,
    voter
  }
}

describe('Newest DAO contract test', function () {
  let fixtures: Awaited<ReturnType<typeof deployFixtures>>

  const proposalAmount = ethers.utils.parseEther('10')

  let target: string
  let calldata: string
  let description: string
  let descriptionHash: string
  let proposalId: BigNumber

  this.beforeAll(async () => {
    fixtures = await deployFixtures()
  })

  it('should allow voter to join', async () => {
    const { dao, paymentToken, voter, voteToken } = fixtures

    // Allow the dao to take payment:
    await paymentToken
      .connect(voter)
      .approve(dao.address, ethers.utils.parseEther('100'))

    // Join the dao:
    await dao.connect(voter).join({ gasLimit: 30000000 })

    // Assertions:
    const votersTokenBalance = await voteToken.balanceOf(voter.address)
    expect(votersTokenBalance.toString()).equal('1')
  })
  it('should allow proposal', async function () {
    const { dao, owner, payee, paymentToken } = fixtures

    const ABI = ['function transfer(address to, uint amount)']
    const iface = new ethers.utils.Interface(ABI)
    calldata = iface.encodeFunctionData('transfer', [
      payee.address,
      proposalAmount
    ])

    target = paymentToken.address
    description = 'This is to pay one of the voters to fill a pothole'
    descriptionHash = ethers.utils.id(description)

    // Owner can make proposal
    await dao.connect(owner).propose([target], [0], [calldata], description)

    // Get the proposal ID
    const eventFilter = dao.filters.ProposalCreated()
    const eventDatas = await dao.queryFilter(eventFilter)
    const [eventData] = eventDatas
    proposalId = eventData.args.proposalId
  })
  it('should allow voting on proposal', async () => {
    const { dao, owner, voter } = fixtures

    // mine a block for the proposal to pass the voting delay
    await mine(votingDelay)

    const voteTx = await dao.connect(voter).castVote(proposalId, 1)
    const ownerVoteTx = await dao.connect(owner).castVote(proposalId, 1)
    await voteTx.wait()
    await ownerVoteTx.wait()
  })
  it('should execute a proposal', async () => {
    const { dao, voter, paymentToken } = fixtures

    await mine(votingPeriod)

    const beforeBalance = await paymentToken.balanceOf(voter.address)

    await dao.connect(voter).queue([target], [0], [calldata], descriptionHash)

    // Wait until timelock delay has passed before executing
    await mine(timelockDelay)

    await dao.connect(voter).execute([target], [0], [calldata], descriptionHash)

    const afterBalance = await paymentToken.balanceOf(voter.address)

    expect(afterBalance.eq(beforeBalance.add(proposalAmount)))
  })
})
