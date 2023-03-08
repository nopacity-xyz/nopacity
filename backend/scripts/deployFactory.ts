import { ethers } from 'hardhat'

export async function deployCloneFactory() {
  // governor skeleton
  const OurGovernor = await ethers.getContractFactory('OurGovernor')
  const ourGovernor = await OurGovernor.deploy()
  await ourGovernor.deployed()

  // timelock skeleton
  const OurTime = await ethers.getContractFactory('OurTimeLock')
  const ourTimelock = await OurTime.deploy()
  await ourTimelock.deployed()

  /// erc721 skeleton
  const Our721 = await ethers.getContractFactory('OurERC721')
  const outVoteToken = await Our721.deploy()
  await outVoteToken.deployed()

  // Factory contract
  const OurCloneFactory = await ethers.getContractFactory('OurCloneFactory')
  const cloneFactory = await OurCloneFactory.deploy(
    ourGovernor.address,
    ourTimelock.address,
    outVoteToken.address
  )
  await cloneFactory.deployed()

  return {
    cloneFactoryAddress: cloneFactory.address,
    governorAddress: ourGovernor.address,
    timelockAddress: ourTimelock.address,
    voteTokenAddress: outVoteToken.address
  }
}

if (require.main?.filename === __filename) {
  deployCloneFactory()
    .then(fixtures => {
      console.log(`Clone factory contract:`, fixtures.cloneFactoryAddress)
      console.log(`Governor contract:`, fixtures.governorAddress)
      console.log(`Timelock token contract:`, fixtures.timelockAddress)
      console.log(`Vote token contract:`, fixtures.voteTokenAddress)
    })

    .catch(error => {
      console.error(error)
      process.exitCode = 1
    })
}
