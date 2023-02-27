import type { NextApiRequest, NextApiResponse } from 'next'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { ethers } = require('hardhat')

interface Data {
  output: string
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function contractMaker(
  daoName: string,
  votingQuantity: number,
  votingPeriod: string,
  quorumFraction: number,
  premintAmount: number,
  tokenName: string,
  tokenSymbol: string
) {
  const [owner] = await ethers.getSigners()

  const transactionCount: number = await owner.getTransactionCount()

  // gets the address of the token before it is deployed
  const futureAddress = ethers.utils.getContractAddress({
    from: owner.address,
    nonce: transactionCount + 1
  })

  const MyGovernor = await ethers.getContractFactory('GovernorContract')
  const governor = await MyGovernor.deploy(
    daoName,
    futureAddress,
    votingPeriod,
    quorumFraction
  )

  const MyToken = await ethers.getContractFactory('TokenContract')
  const token = await MyToken.deploy(
    governor.address,
    premintAmount,
    tokenName,
    tokenSymbol
  )

  console.log(
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    `Governor deployed to ${governor.address}`,
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    `Token deployed to ${token.address}`
  )
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { tokenName, tokenSymbol, tokenAmount } = req.body

  res.status(200)
}
