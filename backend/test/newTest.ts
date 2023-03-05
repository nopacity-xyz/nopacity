import { loadFixture, mine } from '@nomicfoundation/hardhat-network-helpers'
import { assert, expect } from 'chai'
import { ethers } from 'hardhat'
const { expect } = require('chai')

describe('Newest DAO contract test', function () {
  it('should work for now...', async function () {
    const [owner, ...voters] = await ethers.getSigners()

    // governor skeleton
    const OurGovernor = await ethers.getContractFactory('OurGovernor')
    const ourgovernor = await OurGovernor.deploy()
    await ourgovernor.deployed()
    // console.log(`Governor deployed to ${ourgovernor.address}`)

    // timelock skeleton
    const OurTime = await ethers.getContractFactory('OurTimeLock')
    const ourtime = await OurTime.deploy()
    await ourtime.deployed()
    // console.log(`TimeLock deployed to ${ourtime.address}`)

    /// 721 skeleton
    const Our721 = await ethers.getContractFactory('OurERC721')
    const our721 = await Our721.deploy()
    await our721.deployed()
    // console.log(`ERC721 deployed to ${our721.address}`)

    const OurCloneFactory = await ethers.getContractFactory('OurCloneFactory')
    const cloneFactory = await OurCloneFactory.deploy(
      ourgovernor.address,
      ourtime.address,
      our721.address
    )
    await cloneFactory.deployed()

    const factoryInstance = await OurCloneFactory.attach(cloneFactory.address)

    const getNextAddressFromFactory = async (number: any) => {
      return ethers.utils.getContractAddress({
        from: factoryInstance.address,
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        nonce: number + 1
      })
    }

    const getFirstAddressFromFactory = async () => {
      return ethers.utils.getContractAddress({
        from: factoryInstance.address,
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        nonce: 0
      })
    }

    // GET IT WORKING FOR ONE!!

    // pre-determine governor
    // pre-determine timelock
    // pre-determine token

    console.log('HELLO THEREEEEE??????')

    console.log('First pre-determined address (timelock)')
    const determinedTimeLockAddress = await getNextAddressFromFactory(0)
    console.log('predetermined time ' + determinedTimeLockAddress)
    // actual
    // console.log(await factoryInstance.getTimeLockCloneFromArray(0))

    console.log('Second pre-determined address (governor)')
    const determinedGovernorAddress = await getNextAddressFromFactory(1)
    console.log('predetermined gov ' + determinedGovernorAddress)
    // actual
    // console.log(await factoryInstance.getGovernorCloneFromArray(0))

    console.log('Third pre-determined address (token)')
    const determinedTokenAddress = await getNextAddressFromFactory(2)
    console.log('predetermined token ' + determinedTokenAddress)
    // actual

    const daoName = 'ETHSD'
    const votingDelay = 1
    const votingPeriod = 50400 // 1 week
    const tokenName = 'OurToken'
    const tokenSymbol = 'OUT'
    const timelockDelay = 300 // 1 hour
    const quorumFraction = 1

    await factoryInstance.createDAO(
      determinedGovernorAddress,
      daoName,
      determinedTokenAddress,
      determinedTimeLockAddress,
      '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
      votingDelay,
      votingPeriod,
      quorumFraction,
      'USDC',
      'USDC'
    )

    console.log('time ' + (await factoryInstance.getTimeLockCloneFromArray(0)))

    console.log(
      'governor ' + (await factoryInstance.getGovernorCloneFromArray(0))
    )

    console.log('token ' + (await factoryInstance.getTokenCloneFromArray(0)))

    const governorCloneAddress =
      await factoryInstance.getGovernorCloneFromArray(0)

    const governorCloneInstance = OurGovernor.attach(governorCloneAddress)

    const ABI = ['function transfer(address to, uint amount)']
    const iface = new ethers.utils.Interface(ABI)
    const calldata = iface.encodeFunctionData('transfer', [
      '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
      ethers.utils.parseEther('1.0')
    ])

    governorCloneInstance.join()
    const target = '0x07865c6e87b9f70255377e024ace6630c1eaa37f'
    const description = 'This is to pay one of the voters to fill a pothole'

    const tx = await governorCloneInstance.propose(
      [target],
      [0],
      [calldata],
      description
    )

    const txReceipt = await tx.wait()

    console.log(txReceipt)
  })
})
