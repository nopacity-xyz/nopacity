import type { NextApiRequest, NextApiResponse } from "next";
const { ethers } = require("hardhat");

type Data = {
	output: string;
};

async function contractMaker(
	daoName: string,
	timeLockQuantity: number,
	timeLockPeriod: number,
	votingPeriod: number,
	quorumFraction: number,
	premintAmount: number,
	tokenName: string,
	tokenSymbol: string
) {
	const [owner] = await ethers.getSigners();

	const transactionCount = await owner.getTransactionCount();

	// gets the address of the token before it is deployed
	const futureAddress = ethers.utils.getContractAddress({
		from: owner.address,
		nonce: transactionCount + 1,
	});

	const MyGovernor = await ethers.getContractFactory("GovernorContract");
	const governor = await MyGovernor.deploy(daoName, futureAddress, timeLock, votingPeriod, quorumFraction);

	const MyToken = await ethers.getContractFactory("TokenContract");
	const token = await MyToken.deploy(governor.address, premintAmount, tokenName, tokenSymbol);

	console.log(`Governor deployed to ${governor.address}`, `Token deployed to ${token.address}`);
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
	const { tokenName, tokenSymbol, tokenAmount } = req.body;

	// const tokenName = "HelloToken555";
	// const tokenSymbol = "HW";
	// const tokenAmount = 112;
	res.status(200);
}
