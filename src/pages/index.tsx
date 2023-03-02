import { Box, Button, Heading, useBoolean } from '@chakra-ui/react'
// import { Alchemy, Network, Utils } from 'alchemy-sdk'
import { Plus_Jakarta_Sans } from 'next/font/google'
import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'

import NavBar from '@/components/Navigation/NavBar'
import styles from '@/styles/Home.module.css'

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'] })

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
      <Box w="100%" h="100%" bgGradient="linear(to-l, #7928CA, #FF0080)">
        <main className={styles.main}>
          <div className={styles.description}>
            <Box
              borderWidth="1px"
              rounded="lg"
              shadow="1px 1px 3px rgba(0,0,0,0.3)"
              maxWidth={800}
              p={6}
              m="10px auto"
              display="flex"
              flexDirection="column"
              alignItems="flex-start"
              color="white"
              backdropFilter="auto"
              backdropBlur="8px"
              className={jakarta.className}
              fontWeight="bold"
            >
              <Heading
                w="100%"
                textAlign="left"
                fontWeight="normal"
                mb="2%"
                // color="white"
              >
                Create value to fund your endeavor
              </Heading>
              <Heading
                size="md"
                w="100%"
                textAlign="left"
                fontWeight="normal"
                mb="2%"
                textShadow="0px 0px 5px #fff, 1px 1px 5px #ccc"
              >
                (not the other way around)
              </Heading>
              <Link href="/create-organization">
                <Button colorScheme="blue">Create a business</Button>
              </Link>
            </Box>
          </div>
        </main>
      </Box>
    </>
  )
}
