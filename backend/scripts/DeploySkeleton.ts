import { ethers } from 'hardhat'

export async function deployCloneFactory() {
  // governor skeleton
  const OurGovernor = await ethers.getContractFactory('OurGovernor')
  const ourgovernor = await OurGovernor.deploy()
  await ourgovernor.deployed()
  console.log(`Governor deployed to ${ourgovernor.address}`)

  // timelock skeleton
  const OurTime = await ethers.getContractFactory('OurTimeLock')
  const ourtime = await OurTime.deploy()
  await ourtime.deployed()
  console.log(`Time deployed to ${ourtime.address}`)

  /// 721 skeleton
  const Our721 = await ethers.getContractFactory('OurERC721')
  const our721 = await Our721.deploy()
  await our721.deployed()
  console.log(`721 deployed to ${our721.address}`)

  const OurCloneFactory = await ethers.getContractFactory('OurCloneFactory')
  const cloneFactory = await OurCloneFactory.deploy(
    ourgovernor.address, // ourgovernor.address
    ourtime.address, // ourtime.address
    our721.address // our721.address
  )
  await cloneFactory.deployed()

  return cloneFactory.address
}

if (require.main?.filename === __filename) {
  deployCloneFactory()
    .then(address => {
      console.log(address)
    })

    .catch(error => {
      console.error(error)
      process.exitCode = 1
    })
}
