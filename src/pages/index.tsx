import { Button, FormControl, FormLabel, Input, Select } from '@chakra-ui/react'
import { Inter } from 'next/font/google'
import Head from 'next/head'
import { ChangeEvent, useState } from 'react'

import DAOConfig from '@/components/contractDeployment/DAOConfig'
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
      quorumFraction: 0
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
          <div>
            <FormLabel>Token Settings</FormLabel>
            <FormControl>
              <FormLabel>Token Name</FormLabel>
              <Input
                className="tokenName"
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setDAOData(prevState => ({
                    ...prevState,
                    token: {
                      // copy all other key-value pairs of food object
                      ...prevState.token,
                      tokenName: e.target.value
                    }
                  }))
                }}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Token Symbol</FormLabel>
              <Input
                className="tokenSymbol"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
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
            </FormControl>
            <FormControl>
              <FormLabel>Premint Amount</FormLabel>
              <Input
                className="tokenAmount"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
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
            </FormControl>
            <FormLabel>Governor Settings</FormLabel>
            <FormControl>
              <FormLabel>DAO Name</FormLabel>
              <Input
                className="DAOName"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
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
            </FormControl>
            <FormControl>
              <FormLabel>Voting Quantity</FormLabel>
              <Input
                className="votingQuantity"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
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
            </FormControl>
            <FormControl>
              <FormLabel>Voting Period</FormLabel>
              <Select
                className="votingPeriod"
                placeholder="Select Voting Period"
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setDAOData(prevState => ({
                    ...prevState,
                    governor: {
                      // copy all other key-value pairs of food object
                      ...prevState.governor,
                      votingPeriod: parseInt(e.target.value)
                    }
                  }))
                }
              >
                <option value="seconds">seconds</option>
                <option value="minutes">minutes</option>
                <option value="hours">hours</option>
                <option value="days">days</option>
                <option value="weeks">weeks</option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Quorum Amount</FormLabel>
              <Input
                className="Quorum Fraction"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setDAOData(prevState => ({
                    ...prevState,
                    governor: {
                      // copy all other key-value pairs of food object
                      ...prevState.governor,
                      quorumFraction: parseInt(e.target.value)
                    }
                  }))
                }
              />
            </FormControl>
            <br />
            <Button colorScheme="teal" onClick={() => handleSubmit}>
              Deploy 🚀
            </Button>
          </div>
        </div>
      </main>
      <DAOConfig />
    </>
  )
}
