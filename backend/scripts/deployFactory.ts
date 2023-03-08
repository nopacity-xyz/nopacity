import { ethers } from 'hardhat'

export async function deployCloneFactory() {
  // governor skeleton
  const OurGovernor = await ethers.getContractFactory('OurGovernor')
  const ourGovernor = await OurGovernor.deploy()
  await ourGovernor.deployed()

  // timelock skeleton
  const OurTimelock = await ethers.getContractFactory('OurTimeLock')
  const ourTimelock = await OurTimelock.deploy()
  await ourTimelock.deployed()

  /// erc721 skeleton
  const OurVoteToken = await ethers.getContractFactory('OurERC721')
  const ourVoteToken = await OurVoteToken.deploy()
  await ourVoteToken.deployed()

  // Factory contract
  const OurCloneFactory = await ethers.getContractFactory('OurCloneFactory')
  const ourCloneFactory = await OurCloneFactory.deploy(
    ourGovernor.address,
    ourTimelock.address,
    ourVoteToken.address
  )
  await ourCloneFactory.deployed()

  return {
    OurGovernor,
    OurTimelock,
    OurVoteToken,
    OurCloneFactory,

    ourCloneFactory,
    ourGovernor,
    ourTimelock,
    ourVoteToken
  }
}

if (require.main?.filename === __filename) {
  deployCloneFactory()
    .then(fixtures => {
      console.log(`Clone factory contract:`, fixtures.ourCloneFactory.address)
      console.log(`Governor contract:`, fixtures.ourGovernor.address)
      console.log(`Timelock token contract:`, fixtures.ourTimelock.address)
      console.log(`Vote token contract:`, fixtures.ourVoteToken.address)
    })

    .catch(error => {
      console.error(error)
      process.exitCode = 1
    })
}
