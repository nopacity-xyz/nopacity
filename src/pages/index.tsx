import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
	const [DAOData, setDAOData] = useState({
		token: {
			tokenName: "",
			tokenSymbol: "",
			premintAmount: 0,
		},
		governor: {
			daoName: "",
			votingQuantity: 0,
			votingPeriod: 0,
			quorumAmount: 0,
		},
	});

	const handleSubmit = (e: Event) => {
		e.preventDefault();

		const data = DAOData;

		console.log(JSON.stringify(data));

		fetch("/api/deploy", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});
	};

	return (
		<>
			<Head>
				<title>Nopacity</title>
				<meta name="description" content="Create a DAO in 2 clicks." />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main className={styles.main}>
				<div className={styles.description}>
					<p>
						Get started by editing&nbsp;
						<code className={styles.code}>src/pages/index.tsx</code>
					</p>
					<div>
						<label>Token Settings</label>
						<br></br>
						<label>Token Name</label>
						<br></br>
						<input
							className="tokenName"
							onChange={(e) =>
								setDAOData((prevState) => ({
									...prevState,
									token: {
										// copy all other key-value pairs of food object
										...prevState.token,
										tokenName: e.target.value,
									},
								}))
							}></input>
						<br></br>
						<label>Token Symbol</label>
						<br></br>
						<input
							className="tokenSymbol"
							onChange={(e) =>
								setDAOData((prevState) => ({
									...prevState,
									token: {
										// copy all other key-value pairs of food object
										...prevState.token,
										tokenSymbol: e.target.value,
									},
								}))
							}></input>
						<br></br>
						<label>Premint Amount</label>
						<br></br>
						<input
							className="tokenAmount"
							onChange={(e) =>
								setDAOData((prevState) => ({
									...prevState,
									token: {
										// copy all other key-value pairs of food object
										...prevState.token,
										premintAmount: parseInt(e.target.value),
									},
								}))
							}></input>
						<br></br>
						<br></br>
						<br></br>
						<label>Governor Settings</label>
						<br></br>
						<label>DAO Name</label>
						<br></br>
						<input
							className="DAOName"
							onChange={(e) =>
								setDAOData((prevState) => ({
									...prevState,
									governor: {
										// copy all other key-value pairs of food object
										...prevState.governor,
										daoName: e.target.value,
									},
								}))
							}></input>
						<br></br>
						<label>Voting Quantity</label>
						<br></br>
						<input
							className="votingQuantity"
							onChange={(e) =>
								setDAOData((prevState) => ({
									...prevState,
									governor: {
										// copy all other key-value pairs of food object
										...prevState.governor,
										votingQuantity: parseInt(e.target.value),
									},
								}))
							}></input>
						<br></br>
						<label>Voting Period</label>
						<br></br>
						<select
							className="votingPeriod"
							onChange={(e) =>
								setDAOData((prevState) => ({
									...prevState,
									governor: {
										// copy all other key-value pairs of food object
										...prevState.governor,
										votingPeriod: parseInt(e.target.value),
									},
								}))
							}>
							<option value="seconds">seconds</option>
							<option value="minutes">minutes</option>
							<option value="hours">hours</option>
							<option value="days">days</option>
							<option value="weeks">weeks</option>
						</select>
						<br></br>
						<label>Quorum Amount</label>
						<br></br>
						<input
							className="Quarum Amount"
							onChange={(e) =>
								setDAOData((prevState) => ({
									...prevState,
									governor: {
										// copy all other key-value pairs of food object
										...prevState.governor,
										quorumAmount: parseInt(e.target.value),
									},
								}))
							}></input>
						<br></br>
						<br></br>
						<button onClick={handleSubmit}>SUBMIT</button>
					</div>
				</div>
			</main>
		</>
	);
}
