// import { loadFixture, mine } from '@nomicfoundation/hardhat-network-helpers'
// import { assert, expect } from 'chai'
import { expect } from 'chai'
import { ethers } from 'hardhat'

import { deployCloneFactory } from '../scripts/deployFactory'
import { deployTestPaymentToken } from '../scripts/deployTestPaymentToken'

async function deployFixtures() {
  const provider = ethers.provider

  const [owner, voter] = await ethers.getSigners()

  // console.log('THE OWNER!!!', owner.address)
  // const owner = new ethers.Wallet(
  //   '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
  //   provider
  // )

  // const voter = new ethers.Wallet(
  //   '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d',
  //   provider
  // )

  const paymentFixtures = await deployTestPaymentToken()
  const cloneFactoryFixtures = await deployCloneFactory()

  const ourCloneFactory = cloneFactoryFixtures.ourCloneFactory

  const nonce = await provider.getTransactionCount(ourCloneFactory.address)
  // console.log(nonce)
  const getNextAddressFromFactory = async (number: any) => {
    return ethers.utils.getContractAddress({
      from: ourCloneFactory.address,
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      nonce: number + 1
    })
  }

  const determinedGovernorAddress = await getNextAddressFromFactory(nonce)
  const determinedTokenAddress = await getNextAddressFromFactory(nonce + 1)

  // console.log('predetermined gov', determinedGovernorAddress)
  // console.log('predetermined token', determinedTokenAddress)

  const daoName = 'ETHSD'
  const daoDescription = 'ETHSD'
  const votingDelay = 1
  const votingPeriod = 50400 // 1 sweek
  // const tokenName = 'OurToken'
  // const tokenSymbol = 'OUT'
  // const timelockDelay = 300 // 1 hour
  const quorumFraction = 1

  await ourCloneFactory.createDAO(
    daoName,
    daoDescription,
    determinedGovernorAddress,
    determinedTokenAddress,
    paymentFixtures.paymentToken.address,
    votingDelay,
    votingPeriod,
    quorumFraction,
    'ETHSD Dao Token',
    'ETHSD',
    { gasLimit: 3000000 }
  )

  const govStruct = await ourCloneFactory.getSpecificDAO(0)
  const dao = cloneFactoryFixtures.OurGovernor.attach(govStruct.governor)
  const voteToken = cloneFactoryFixtures.OurVoteToken.attach(govStruct.erc721)
  const timelock = cloneFactoryFixtures.OurTimelock.attach(govStruct.timelock)

  // console.log('governor struct', govStruct)

  // const gov = new ethers.Contract(
  //   govStruct.governor,
  //   cloneFactoryFixtures.OurGovernor.interface,
  //   voter
  // )
  // console.log(gov)

  // console.log(await factoryInstance.getArrayLength())
  return {
    ...cloneFactoryFixtures,
    ...paymentFixtures,

    dao,
    timelock,
    voteToken,

    owner,
    voter
  }
}

describe('Newest DAO contract test', function () {
  it('should allow voter to join', async () => {
    const { dao, voter, voteToken } = await deployFixtures()

    await dao.connect(voter).join({ gasLimit: 30000000 })

    const votersTokenBalance = await voteToken.balanceOf(voter.address)

    expect(votersTokenBalance.toString()).equal('1')
  })
  it.skip('should work for now...', async function () {
    const { ourCloneFactory, OurGovernor, paymentToken } =
      await deployFixtures()

    // const [owner, ...voters] = await ethers.getSigners()

    // Debug console logs:
    // console.log(`Governor deployed to ${ourgovernor.address}`)
    // console.log(`TimeLock deployed to ${ourtime.address}`)
    // console.log(`ERC721 deployed to ${our721.address}`)

    // await OurCloneFactory.deploy(
    //   ourGovernor.address,
    //   ourTimelock.address,
    //   ourVoteToken.address
    // )
    // await cloneFactory.deployed()

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async function dummy() {
      // const nonce = (await factoryInstance.getArrayLength()).toNumber()
      const nonce = await ethers.provider.getTransactionCount(
        ourCloneFactory.address
      )
      const getNextAddressFromFactory = async (number: any) => {
        return ethers.utils.getContractAddress({
          from: ourCloneFactory.address,
          // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
          nonce: number + 1
        })
      }

      // const getFirstAddressFromFactory = async () => {
      //   return ethers.utils.getContractAddress({
      //     from: factoryInstance.address,
      //     // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      //     nonce: 0
      //   })
      // }

      // GET IT WORKING FOR ONE!!

      // pre-determine governor
      // pre-determine timelock
      // pre-determine token

      // console.log(
      //   'HELLO,compare determined address from address within smartcontract?'
      // )

      // console.log('First pre-determined address (timelock)')
      // const determinedTimeLockAddress = await getNextAddressFromFactory(nonce)
      // console.log('predetermined time ' + determinedTimeLockAddress)

      // console.log('Second pre-determined address (governor)')
      const determinedGovernorAddress = await getNextAddressFromFactory(nonce)
      console.log('predetermined gov ' + determinedGovernorAddress)
      // actual
      // console.log(await factoryInstance.getGovernorCloneFromArray(0))

      // console.log('Third pre-determined address (token)')
      const determinedTokenAddress = await getNextAddressFromFactory(nonce + 1)
      console.log('predetermined token ' + determinedTokenAddress)
      // actual

      const daoName = 'ETHSD'
      const daoDescription = 'ETHSD'
      const votingDelay = 1
      const votingPeriod = 50400 // 1 week
      // const tokenName = 'OurToken'
      // const tokenSymbol = 'OUT'
      // const timelockDelay = 300 // 1 hour
      const quorumFraction = 1

      const DAOtx = await ourCloneFactory.createDAO(
        daoName,
        daoDescription,
        determinedGovernorAddress,
        determinedTokenAddress,
        paymentToken.address,
        votingDelay,
        votingPeriod,
        quorumFraction,
        'USDC',
        'USDC',
        { gasLimit: 3000000 }
      )

      // console.log('time from DAO ' + (await factoryInstance.getTimeLockCloneFromArray(0)))

      // console.log(
      //   'governor from DAO' + (await factoryInstance.getGovernorCloneFromArray(0))
      // )

      // console.log('token from DAO ' + (await factoryInstance.getTokenCloneFromArray(0)))

      const governorCloneAddress =
        await ourCloneFactory.getGovernorCloneFromArray(0)

      const governorCloneInstance = OurGovernor.attach(governorCloneAddress)

      const ABI = ['function transfer(address to, uint amount)']
      const iface = new ethers.utils.Interface(ABI)
      const calldata = iface.encodeFunctionData('transfer', [
        '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
        ethers.utils.parseEther('1.0')
      ])

      await governorCloneInstance.join()
      const target = '0x07865c6e87b9f70255377e024ace6630c1eaa37f'
      const description = 'This is to pay one of the voters to fill a pothole'

      console.log('Dao Created')
      console.log(DAOtx)

      const tx = await governorCloneInstance.propose(
        [target],
        [0],
        [calldata],
        description
      )

      const txReceipt = await tx.wait()
      console.log('PROPOSAL')
      console.log(txReceipt)
    }
  })
})
