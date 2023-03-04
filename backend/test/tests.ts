import { loadFixture, mine } from '@nomicfoundation/hardhat-network-helpers'
import { assert, expect } from 'chai'
import { ethers } from 'hardhat'

const { parseEther } = ethers.utils

const daoName = 'ETHSD'
const votingDelay = 1
const votingPeriod = 50400 // 1 week
const tokenName = 'OurToken'
const tokenSymbol = 'OUT'
const timelockDelay = 300 // 1 hour
const qourumFraction = 1

async function deployFixture() {
  const [owner, ...voters] = await ethers.getSigners()

  //
  // Helpers
  //

  const getNextContractAddress = async (extraOffset: number = 0) => {
    return ethers.utils.getContractAddress({
      from: owner.address,
      nonce: (await owner.getTransactionCount()) + 1 + extraOffset
    })
  }

  //
  // Test ERC20 Token
  //

  const PaymentToken = await ethers.getContractFactory('TestPaymentToken')
  const paymentToken = await PaymentToken.connect(owner).deploy()
  await paymentToken.deployed()

  for (let i = 0; i < 5; ++i) {
    await paymentToken
      .connect(owner)
      .transfer(voters[i].address, parseEther('1000'))
  }

  //
  // Deploy Group Factory
  //

  const GroupFactory = await ethers.getContractFactory('GroupFactory')
  const groupFactory = await GroupFactory.deploy()
  await groupFactory.deployed()

  //
  // Deploy Timelock
  //

  const governorContractAddress = await getNextContractAddress()
  const TimeLockContract = await ethers.getContractFactory(
    'MyTimelockController'
  )
  const timeLockContract = await TimeLockContract.deploy(
    timelockDelay,
    [governorContractAddress],
    ['0x0000000000000000000000000000000000000000', governorContractAddress],
    owner.address,
    parseEther('100'),
    { gasLimit: 30000000 }
  )
  await timeLockContract.deployed()

  //
  // Deploy Governor
  //

  const voteTokenContractAddress = await getNextContractAddress()
  const tx = await groupFactory.createGroup(
    daoName,
    voteTokenContractAddress,
    timeLockContract.address,
    paymentToken.address,
    votingDelay,
    votingPeriod,
    qourumFraction,
    { gasLimit: 30000000 }
  )
  const receipt = await tx.wait(0)

  console.log(receipt.events)

  const governorContract = await ethers.getContractAt(
    'GroupGovernor',
    governorContractAddress
  )

  //
  // Deploy Vote Token
  //

  const VoteTokenContract = await ethers.getContractFactory('TokenContract')
  const voteTokenContract = await VoteTokenContract.deploy(
    governorContract.address,
    tokenName,
    tokenSymbol,
    { gasLimit: 30000000 }
  )
  await voteTokenContract.deployed()

  // Let the owner mint his own NFT
  await voteTokenContract.safeMint(owner.address)
  await voteTokenContract.safeMint(voters[0].address)
  // Transfer the ownership of the token to the governor contract
  await voteTokenContract.transferOwnership(governorContract.address)

  // Debugging Logs:
  // console.log('Payment Token:', paymentToken.address)
  // console.log('Owner:', owner.address)
  // console.log('Voter:', voters[0].address)
  // console.log('Token Contract: ' + tokenContract.address)
  // console.log('Time Lock: ' + timeLockContract.address)
  // console.log('Governor Contract: ' + governorContract.address)

  return {
    paymentToken,
    timeLockContract,
    governorContract,
    voteTokenContract,
    owner,
    voters
  }
}

describe('Testing of the governor and Token Contract ', function () {
  it('should have a TEST ERC20 token deployed', async () => {
    const { paymentToken } = await loadFixture(deployFixture)

    const supply = await paymentToken.totalSupply()
    assert(supply.gt('1'))
  })

  it('should provide the owner with an ERC721 token after they deploy', async () => {
    const { voteTokenContract, owner } = await loadFixture(deployFixture)

    // Owner should have a vote token :
    const votersTokenBalance = await voteTokenContract
      .connect(owner)
      .balanceOf(owner.address)
    expect(votersTokenBalance.toString()).equal('1')

    // Should automatically delegate vote to self token:
    const ownerDelegate = await voteTokenContract.delegates(owner.address)
    expect(ownerDelegate).equal(owner.address)
  })

  it('voter can join DAO', async () => {
    const { governorContract, paymentToken, voteTokenContract, voters } =
      await loadFixture(deployFixture)
    const [voter] = voters

    // Voter must pay before joining
    await paymentToken
      .connect(voter)
      .approve(governorContract.address, parseEther('100'))
    // Vote joins
    await governorContract.connect(voter).join()

    // Voter should have a vote token
    const votersTokenBalance = await voteTokenContract.balanceOf(voter.address)
    expect(votersTokenBalance.toString()).equal('1')

    // Should automatically delegate vote to self token:
    const voterDelegate = await voteTokenContract.delegates(voter.address)
    expect(voterDelegate).equal(voter.address)
  })

  it('voter must pay the minimum to join DAO', async () => {
    const {
      governorContract,
      voters: [voter]
    } = await loadFixture(deployFixture)

    // await usdcTokenContract.approve(governorContract.address, '100')
    await expect(governorContract.connect(voter).join()).to.revertedWith(
      'Must pay the minimum'
    )
  })
})

describe('Proposal and vote workflow', function () {
  const proposalAmount = ethers.utils.parseEther('10')

  let fixtures: Awaited<ReturnType<typeof deployFixture>>
  let descriptionHash: string
  let proposalId: string
  let target: string
  let calldata: string
  let description: string

  this.beforeAll(async () => {
    fixtures = await loadFixture(deployFixture)
  })

  it('voter can join DAO', async () => {
    const { governorContract, paymentToken, voteTokenContract, voters } =
      fixtures
    const [voter] = voters

    // Voter must pay before joining
    await paymentToken
      .connect(voter)
      .approve(governorContract.address, parseEther('100'))
    // Vote joins
    await governorContract.connect(voter).join()

    // Voter should have a vote token
    const votersTokenBalance = await voteTokenContract.balanceOf(voter.address)
    expect(votersTokenBalance.toString()).equal('1')

    // Should automatically delegate vote to self token:
    const voterDelegate = await voteTokenContract.delegates(voter.address)
    expect(voterDelegate).equal(voter.address)
  })
  it('owner can create proposal', async () => {
    const { governorContract, owner, paymentToken, voters } = fixtures
    const [voter] = voters
    // Prepare proposal payload:
    target = paymentToken.address
    calldata = paymentToken.interface.encodeFunctionData('transfer', [
      voter.address,
      proposalAmount
    ])
    description = 'This is to pay one of the voters to fill a pothole'
    descriptionHash = ethers.utils.id(description)

    // Make proposal:
    const tx = await governorContract
      .connect(owner)
      .propose([target], [0], [calldata], description)
    const receipt = await tx.wait()
    const event = (receipt.events ?? [])[0]

    // Typescript type assertions:
    if (event == null) throw new Error('Expected event')
    if (event.eventSignature == null)
      throw new Error('Expected event signature')
    if (event.data == null) throw new Error('Expected event data')
    if (event.decode == null) throw new Error('Expected event decode')

    // Get proposalId
    const eventData = event.decode(event.data, event.topics)
    proposalId = eventData.proposalId
  })
  it('Should allow the delegates to vote on proposal', async () => {
    const { governorContract, owner, voters } = fixtures
    const [voter] = voters

    // mine a block for the proposal to pass the voting delay
    await mine(votingDelay)

    const voteTx = await governorContract.connect(voter).castVote(proposalId, 1)
    const ownerVoteTx = await governorContract
      .connect(owner)
      .castVote(proposalId, 1)
    await voteTx.wait()
    await ownerVoteTx.wait()
  })

  it('Should execute a proposal', async () => {
    const { governorContract, voters, paymentToken } = fixtures
    const [voter] = voters
    await mine(votingPeriod)

    const beforeBalance = await paymentToken.balanceOf(voter.address)

    await governorContract
      .connect(voter)
      .queue([target], [0], [calldata], descriptionHash)

    // Wait until timelock delay has passed before executing
    await mine(timelockDelay)

    await governorContract
      .connect(voter)
      .execute([target], [0], [calldata], descriptionHash)

    const afterBalance = await paymentToken.balanceOf(voter.address)

    expect(afterBalance.eq(beforeBalance.add(proposalAmount)))
  })
})
