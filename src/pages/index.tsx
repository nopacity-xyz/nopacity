import { Inter } from 'next/font/google'
import Head from 'next/head'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Image from 'next/image'
import { useState } from 'react'

import styles from '@/styles/Home.module.css'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const inter = Inter({ subsets: ['latin'] })

export default function Home() {
	const [DAOData, setDAOData] = useState({
		token: {
			tokenName: '',
			tokenSymbol: '',
			premintAmount: 0
		},
		governor: {
			daoName: '',
			votingQuantity: 0,
			votingPeriod: 0,
			quorumAmount: 0
		}
	})

	const handleSubmit = async (e: Event) => {
		e.preventDefault()

		const data = DAOData

		console.log(JSON.stringify(data))

		await fetch('/api/deploy', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		})
	}

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
						<br />
						<label>Token Name</label>
						<br />
						<input
							className="tokenName"
							onChange={e =>
								setDAOData(prevState => ({
									...prevState,
									token: {
										// copy all other key-value pairs of food object
										...prevState.token,
										tokenName: e.target.value
									}
								}))
							}
						/>
						<br />
						<label>Token Symbol</label>
						<br />
						<input
							className="tokenSymbol"
							onChange={e =>
								setDAOData(prevState => ({
									...prevState,
									token: {
										// copy all other key-value pairs of food object
										...prevState.token,
										tokenSymbol: e.target.value
									}
								}))
							}
						/>
						<br />
						<label>Premint Amount</label>
						<br />
						<input
							className="tokenAmount"
							onChange={e =>
								setDAOData(prevState => ({
									...prevState,
									token: {
										// copy all other key-value pairs of food object
										...prevState.token,
										premintAmount: parseInt(e.target.value)
									}
								}))
							}
						/>
						<br />
						<br />
						<br />
						<label>Governor Settings</label>
						<br />
						<label>DAO Name</label>
						<br />
						<input
							className="DAOName"
							onChange={e =>
								setDAOData(prevState => ({
									...prevState,
									governor: {
										// copy all other key-value pairs of food object
										...prevState.governor,
										daoName: e.target.value
									}
								}))
							}
						/>
						<br />
						<label>Voting Quantity</label>
						<br />
						<input
							className="votingQuantity"
							onChange={e =>
								setDAOData(prevState => ({
									...prevState,
									governor: {
										// copy all other key-value pairs of food object
										...prevState.governor,
										votingQuantity: parseInt(e.target.value)
									}
								}))
							}
						/>
						<br />
						<label>Voting Period</label>
						<br />
						<select
							className="votingPeriod"
							onChange={e =>
								setDAOData(prevState => ({
									...prevState,
									governor: {
										// copy all other key-value pairs of food object
										...prevState.governor,
										votingPeriod: parseInt(e.target.value)
									}
								}))
							}>
							<option value="seconds">seconds</option>
							<option value="minutes">minutes</option>
							<option value="hours">hours</option>
							<option value="days">days</option>
							<option value="weeks">weeks</option>
						</select>
						<br />
						<label>Quorum Amount</label>
						<br />
						<input
							className="Quarum Amount"
							onChange={e =>
								setDAOData(prevState => ({
									...prevState,
									governor: {
										// copy all other key-value pairs of food object
										...prevState.governor,
										quorumAmount: parseInt(e.target.value)
									}
								}))
							}
						/>
						<br />
						<br />
						<button onClick={() => handleSubmit}>SUBMIT</button>
					</div>
				</div>
			</main>
		</>
	)
}
