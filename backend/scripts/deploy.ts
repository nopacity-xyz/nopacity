import hre, { ethers } from 'hardhat'

const { parseEther } = ethers.utils

async function main() {
  const daoName = 'ETHSD'
  const votingDelay = 1
  const votingPeriod = 50400 // 1 week
  const tokenName = 'OurToken'
  const tokenSymbol = 'OUT'
  const timelockDelay = 300 // 1 hour
  const qourumFraction = 1

  const [owner, ...voters] = await ethers.getSigners()

  //
  // Helpers
  //

  const getNextContractAddress = async (extraOffset: number = 0) => {
    return ethers.utils.getContractAddress({
      from: owner.address,
      nonce: (await owner.getTransactionCount()) + 1 + extraOffset
    })
  }

  //
  // Test ERC20 Token
  //

  const PaymentToken = await ethers.getContractFactory('TestPaymentToken')
  const paymentToken = await PaymentToken.connect(owner).deploy()
  await paymentToken.deployed()

  for (let i = 0; i < 5; ++i) {
    await paymentToken
      .connect(owner)
      .transfer(voters[i].address, parseEther('1000'))
  }

  //
  // Deploy Timelock
  //

  const governorContractAddress = await getNextContractAddress()
  const TimeLockContract = await ethers.getContractFactory(
    'MyTimelockController'
  )
  const timeLockContract = await TimeLockContract.deploy(
    timelockDelay,
    [governorContractAddress],
    ['0x0000000000000000000000000000000000000000'],
    owner.address,
    parseEther('100'),
    { gasLimit: 30000000 }
  )
  await timeLockContract.deployed()

  //
  // Deploy Governor
  //

  const tokenContractAddress = await getNextContractAddress()
  const GovernorContract = await ethers.getContractFactory('GroupGovernor')
  const governorContract = await GovernorContract.deploy(
    daoName,
    tokenContractAddress,
    timeLockContract.address,
    paymentToken.address,
    votingDelay,
    votingPeriod,
    qourumFraction,
    { gasLimit: 30000000 }
  )
  await governorContract.deployed()

  //
  // Deploy Token
  //

  const TokenContract = await ethers.getContractFactory('TokenContract')
  const tokenContract = await TokenContract.deploy(
    governorContract.address,
    tokenName,
    tokenSymbol,
    { gasLimit: 30000000 }
  )
  await tokenContract.deployed()

  // Let the owner mint his own NFT
  await tokenContract.safeMint(owner.address)
  await tokenContract.safeMint(voters[0].address)
  // Transfer the ownership of the token to the governor contract
  await tokenContract.transferOwnership(governorContract.address)

  console.log('Owner:', owner.address)
  console.log('Voter:', voters[0].address)
  console.log('Token Contract: ' + tokenContract.address)
  console.log('Time Lock: ' + timeLockContract.address)
  console.log('Governor Contract: ' + governorContract.address)

  await hre.tenderly.persistArtifacts(
    {
      name: 'TestPaymentToken',
      address: paymentToken.address
    },
    { name: 'TokenContract', address: tokenContract.address },
    { name: 'MyTimelockController', address: timeLockContract.address },
    { name: 'GroupGovernor', address: governorContract.address }
  )
}

main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
