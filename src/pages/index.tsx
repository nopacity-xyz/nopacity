import { Box, Button } from '@chakra-ui/react'
import { Inter } from 'next/font/google'
import Head from 'next/head'
import Link from 'next/link'

import styles from '@/styles/Home.module.css'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const inter = Inter({ subsets: ['latin'] })

export default function Home() {
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
