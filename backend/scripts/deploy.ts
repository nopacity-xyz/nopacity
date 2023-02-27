import { ethers } from 'hardhat'

async function main() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [owner, otherAccount] = await ethers.getSigners()

  const transactionCount: number = await owner.getTransactionCount()

  // gets the address of the token before it is deployed
  const futureAddress = ethers.utils.getContractAddress({
    from: owner.address,
    nonce: transactionCount + 1
  })

  const MyGovernor = await ethers.getContractFactory('MyGovernor')
  const governor = await MyGovernor.deploy(futureAddress)

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
