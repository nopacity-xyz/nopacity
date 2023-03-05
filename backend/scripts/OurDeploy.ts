import { ethers } from 'hardhat'

async function main() {
  // governor skeleton
  const OurGovernor = await ethers.getContractFactory('OurGovernor')
  const ourgovernor = await OurGovernor.deploy()
  await ourgovernor.deployed()
  console.log(`Governor deployed to ${ourgovernor.address}`)

  // timelock skeleton
  const OurTime = await ethers.getContractFactory('OurTimeLock')
  const ourtime = await OurTime.deploy()
  await ourtime.deployed()
  console.log(`Governor deployed to ${ourtime.address}`)

  /// 721 skeleton
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

  //Our Factory
  const factoryInstance = await OurCloneFactory.attach(cloneFactory.address)

  

  const getNextAddressFromFactory = async (number: any) => {
    return ethers.utils.getContractAddress({
      from: factoryInstance.address,
      nonce: number + 1
    })
  }
}
