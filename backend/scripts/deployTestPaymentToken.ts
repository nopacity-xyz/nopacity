import { ethers } from 'hardhat'

export async function deployTestPaymentToken() {
  const [owner, voter] = await ethers.getSigners()

  const PaymentToken = await ethers.getContractFactory('TestPaymentToken')
  const paymentToken = await PaymentToken.connect(owner).deploy()
  await paymentToken.deployed()

  for (let i = 0; i < 5; ++i) {
    await paymentToken
      .connect(owner)
      .transfer(voter.address, ethers.utils.parseEther('1000'))
  }

  return {
    paymentToken
  }
}

if (require.main?.filename === __filename) {
  deployTestPaymentToken()
    .then(fixtures => {
      console.log(`Payment token contract:`, fixtures.paymentToken.address)
    })
    .catch(error => {
      console.error(error)
      process.exitCode = 1
    })
}
