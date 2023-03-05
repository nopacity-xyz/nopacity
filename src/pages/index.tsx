import { Box, Button, Container, Heading } from '@chakra-ui/react'
// import { Alchemy, Network, Utils } from 'alchemy-sdk'
import { Plus_Jakarta_Sans } from 'next/font/google'
import Head from 'next/head'
import Link from 'next/link'

import styles from '@/styles/Home.module.css'

import Layout from './layout'

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'] })

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>Nopacity</title>
        <meta name="description" content="Create a Group in 2 clicks. " />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box>
        <main className={styles.main}>
          <div className={styles.description}>
            <Container
              borderWidth="1px"
              rounded="lg"
              maxWidth={800}
              height={500}
              p={6}
              m="10px auto"
              display="flex"
              flexDirection="column"
              alignItems="flex-start"
              color="white"
              backdropFilter="auto"
              backdropBlur="8px"
              shadow="0px 0px 5px rgba(255,255,255,0.3), 1px 1px 5px rgba(255,255,255,0.3),10px 10px 30px rgba(0,0,0,0.3)"
              className={jakarta.className}
              fontWeight="bold"
            >
              <Heading
                // w="100%"
                textAlign="left"
                fontWeight="bold"
                mb="2%"
                color="#052733"
                size="3xl"
                textShadow="0px 0px 5px rgba(5, 39, 51,0.3), 1px 1px 5px rgba(5, 39, 51,0.3),5px 5px 15px rgba(0,0,0,0.3)"
                // color="white"
              >
                Create value to fund your endeavor
              </Heading>
              <Heading
                size="lg"
                w="100%"
                textAlign="left"
                fontWeight="normal"
                color="#052733"
                mb="2%"
                textShadow="0px 0px 5px #fff, 1px 1px 5px rgba(5, 39, 51, 0.3), 5px 5px 10px rgba(5, 39, 51,0.3)"
                // textShadow="5px 10px 15px rgba(0,0,0,0.4)"
              >
                (not the other way around)
              </Heading>
              <p style={{ flexGrow: 1 }} />
              <Link href="/create-group">
                <Button
                  size="lg"
                  backgroundColor="#052733"
                  fontWeight="bold"
                  _hover={{
                    backgroundColor: 'gray.500'
                  }}
                  shadow="0px 0px 5px rgba(255,255,255,0.3), 1px 1px 5px rgba(255,255,255,0.3),10px 10px 30px rgba(0,0,0,0.3)"
                >
                  Create a group
                </Button>
              </Link>
            </Container>
          </div>
        </main>
      </Box>
    </Layout>
  )
}
