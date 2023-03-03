import { Box, Heading, Stack, Text } from '@chakra-ui/react'

import Proposals from '@/pages/g/[groupAddress]/Proposals'
import Layout from '@/pages/layout'
import styles from '@/styles/Home.module.css'
export default function Group({
  params
}: {
  params: { groupAddress: string }
}) {
  return (
    <>
      <Layout>
        <Box
          mt="5%"
          backdropFilter="auto"
          backdropBlur="8px"
          border="1px solid rgba(255, 255, 255, 0.4)"
          borderRadius="20px"
          backgroundColor="rgba(255, 255, 255, 0.2)"
        >
          <main className={styles.main}>
            <div className={styles.description}>
              {/* <h1>{groupAddress}</h1> */}
              <Box>
                <Stack>
                  <Heading
                    w="100%"
                    textAlign="left"
                    fontWeight="bold"
                    mb="2%"
                    color="white"
                    // color="white"
                  >
                    GroupNameHere
                  </Heading>
                  <Text
                    w="100%"
                    textAlign="left"
                    fontWeight="normal"
                    mb="2%"
                    color="white"
                  >
                    GroupDescription Goes Here
                  </Text>
                  <Proposals />
                </Stack>
              </Box>
            </div>
          </main>
        </Box>
      </Layout>
    </>
  )
}
