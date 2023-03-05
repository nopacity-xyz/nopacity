import { ethers } from 'hardhat'

async function main() {
  const [owner] = await ethers.getSigners()
  const daoName = 'ETHSD'
  const votingDelay = 1
  const votingPeriod = 50400 // 1 week
  const tokenName = 'OurToken'
  const tokenSymbol = 'OUT'
  const timelockDelay = 300 // 1 hour
  const qourumFraction = 1

  // governor
  const OurGovernor = await ethers.getContractFactory('OurGovernor')
  const ourgovernor = await OurGovernor.deploy()
  await ourgovernor.deployed()

  console.log(`Governor deployed to ${ourgovernor.address}`)

  // timelock
  const OurTime = await ethers.getContractFactory('OurTimeLock')
  const ourtime = await OurTime.deploy()
  await ourtime.deployed()

  console.log(`Governor deployed to ${ourtime.address}`)

  /// 721
  const Our721 = await ethers.getContractFactory('OurERC721')
  const our721 = await Our721.deploy()
  await our721.deployed()

  console.log(`Governor deployed to ${our721.address}`)

  const OurCloneFactory = await ethers.getContractFactory('OurCloneFactory')
  const cloneFactory = await OurCloneFactory.deploy(
    ourgovernor.address,
    ourtime.address,
    our721.address
  )
  await cloneFactory.deployed()

  console.log(cloneFactory.address)

  const factoryInstance = await OurCloneFactory.attach(cloneFactory.address)

  const deployedGovernor = await factoryInstance.createNewGovernor(
    daoName,
    governor.address,
    governor.address,
    governor.address,
    votingDelay,
    votingPeriod,
    qourumFraction
  )

  // console.log(await factoryInstance.getCloneFromArray())

  console.log(deployedGovernor)
  console.log('HERE ')
  console.log((await factoryInstance.getArrayLength()).toNumber())

  // cloneFactory.createNewGovernor(
  //   daoName,
  //   governor.address,
  //   governor.address,
  //   governor.address,
  //   votingDelay,
  //   votingPeriod,
  //   qourumFraction
  // )
}

main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
