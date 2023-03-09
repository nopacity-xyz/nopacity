import { Box, Center, Heading, Stack, Text } from '@chakra-ui/react'

import { asConfig, Config } from '@/config'
import Proposals from '@/pages/g/[groupAddress]/Proposals'
import Layout from '@/pages/layout'

interface Props {
  config: Config
  // params: { groupAddress: string }
}

export default function Group(props: Props) {
  const { config } = props

  return (
    <>
      <Layout config={config}>
        <Box
          mt="5%"
          p="5%"
          backdropFilter="auto"
          backdropBlur="8px"
          border="1px solid rgba(255, 255, 255, 0.4)"
          borderRadius="20px"
          backgroundColor="rgba(255, 255, 255, 0.2)"
          shadow="0px 0px 5px rgba(255,255,255,0.3), 1px 1px 5px rgba(255,255,255,0.3),10px 10px 30px rgba(0,0,0,0.3)"
        >
          <Center>
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
          </Center>
        </Box>
      </Layout>
    </>
  )
}

export function getStaticProps() {
  const config = asConfig(process.env)
  return { props: { config } }
}

export function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking'
  }
}
