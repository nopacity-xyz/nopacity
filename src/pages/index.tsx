import { Box, Button, useBoolean } from '@chakra-ui/react'
// import { Alchemy, Network, Utils } from 'alchemy-sdk'
import { Inter } from 'next/font/google'
import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'

import NavBar from '@/components/Navigation/NavBar'
import styles from '@/styles/Home.module.css'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [loggedIn, setLoggedIn] = useBoolean()
  const [user, setUser] = useState('')

  return (
    <>
      <Head>
        <title>Nopacity</title>
        <meta name="description" content="Create a DAO in 2 clicks." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar
        loggedIn={loggedIn}
        setLoggedIn={setLoggedIn}
        user={user}
        setUser={setUser}
      />
      <main className={styles.main}>
        <div className={styles.description}>
          <Box>
            <Link href="/create-organization">
              <Button>Create a business</Button>
            </Link>
          </Box>
        </div>
      </main>
    </>
  )
}
