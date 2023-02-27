import { ethers } from 'hardhat'

async function main() {
  const [owner] = await ethers.getSigners()

  const transactionCount = await owner.getTransactionCount()

  // gets the address of the token before it is deployed
  const futureTokenAddress = ethers.utils.getContractAddress({
    from: owner.address,
    nonce: transactionCount + 1
  })
  const futureTimelockAddress = ethers.utils.getContractAddress({
    from: owner.address,
    nonce: transactionCount + 2
  })

  // Voting period is in blocks
  const votingPeriod = 1000
  // Fraction is in percentages (10 means 10%, etc)
  const quorumFraction = 50

  const MyGovernor = await ethers.getContractFactory('GovernorContractTimeLock')
  const governor = await MyGovernor.deploy(
    'Lil Dao Wow',
    futureTokenAddress,
    futureTimelockAddress,
    votingPeriod,
    quorumFraction
  )

  const MyToken = await ethers.getContractFactory('MyToken')
  const token = await MyToken.deploy(governor.address, 'thisISATOKEN', 'LOL')

  console.log(
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    `Governor deployed to ${governor.address}`,
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    `Token deployed to ${token.address}`
  )
}

main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
