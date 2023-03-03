import { Box, Center, Heading, Stack, Text } from '@chakra-ui/react'

import Proposals from '@/pages/g/[groupAddress]/Proposals'
import Layout from '@/pages/layout'
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
          p="5%"
          backdropFilter="auto"
          backdropBlur="8px"
          border="1px solid rgba(255, 255, 255, 0.4)"
          borderRadius="20px"
          backgroundColor="rgba(255, 255, 255, 0.2)"
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
