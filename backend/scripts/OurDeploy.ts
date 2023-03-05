import { ethers } from 'hardhat'

async function main() {
  // governor skeleton
  // const OurGovernor = await ethers.getContractFactory('OurGovernor')
  // const ourgovernor = await OurGovernor.deploy()
  // await ourgovernor.deployed()
  // console.log(`Governor deployed to ${ourgovernor.address}`)

  // timelock skeleton
  // const OurTime = await ethers.getContractFactory('OurTimeLock')
  // const ourtime = await OurTime.deploy()
  // await ourtime.deployed()
  // console.log(`Governor deployed to ${ourtime.address}`)

  // /// 721 skeleton
  // const Our721 = await ethers.getContractFactory('OurERC721')
  // const our721 = await Our721.deploy()
  // await our721.deployed()
  // console.log(`Governor deployed to ${our721.address}`)

  const OurCloneFactory = await ethers.getContractFactory('OurCloneFactory')
  const cloneFactory = await OurCloneFactory.deploy(
    '0xab0028a25d526f35b46e6c6ff3f017b1367f0ace', // ourgovernor.address
    '0x6da6fd71999a6d0865829d9b6a028d2a11c6c596', // ourtime.address
    '0xc5f8895eb5e4508b14fa35cf17a34ebf6bca7173' // our721.address
  )
  await cloneFactory.deployed()

  console.log(cloneFactory.address)

  // Our Factory
  // const factoryInstance = await OurCloneFactory.attach(cloneFactory.address)

  // const getNextAddressFromFactory = async (number: any) => {
  //   return ethers.utils.getContractAddress({
  //     from: factoryInstance.address,
  //     nonce: number + 1
  //   })
  // }
}

main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
