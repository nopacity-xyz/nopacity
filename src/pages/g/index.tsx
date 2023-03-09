import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Link,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr
} from '@chakra-ui/react'
import { ethers } from 'ethers'
import React, { useEffect, useState } from 'react'

import { asConfig, Config } from '@/config'
import { getContracts } from '@/contracts'
import { getMagic } from '@/utils/getMagic'

import Layout from '../layout'

interface GetGroupProps {
  config: Config
}

interface DaoData {
  address: string
  name: string
  description: string
}

export default function Groups(props: GetGroupProps) {
  const { config } = props
  const [loading, setLoading] = useState(true)
  const [daoData, setDaoData] = useState<DaoData[]>([])

  useEffect(() => {
    const magic = getMagic(config)
    const provider = new ethers.providers.Web3Provider(magic.rpcProvider as any)
    const signer = provider.getSigner()
    const { ourCloneFactory, ourGovernor } = getContracts(config, signer)

    const handler = async (): Promise<void> => {
      const daos = await ourCloneFactory.getDaos()
      const daoData = await Promise.all(
        daos.map(async dao => {
          const governor = ourGovernor.attach(dao.governor)
          const name = await governor.name()
          const description = await governor.daoDescription()
          const data: DaoData = {
            address: dao.governor,
            name,
            description
          }
          return data
        })
      )
      setDaoData(daoData)
      setLoading(false)
    }

    setLoading(true)
    handler().catch(error => {
      console.error(error)
    })
  }, [config])

  return (
    <>
      <Layout config={config}>
        <Box
          mt="5%"
          p="5%"
          backdropFilter="auto"
          backdropBlur="8px"
          border="1px solid rgba(255, 255, 255, 0.4)"
          backgroundColor="rgba(255, 255, 255, 0.2)"
          borderRadius="20px"
          shadow="0px 0px 5px rgba(255,255,255,0.3), 1px 1px 5px rgba(255,255,255,0.3),10px 10px 30px rgba(0,0,0,0.3)"
        >
          <Center>
            <Box flexGrow={1}>
              <Flex>
                <Heading
                  w="100%"
                  textAlign="left"
                  fontWeight="bold"
                  mb="2%"
                  color="white"
                  // color="white"
                >
                  Groups
                </Heading>
              </Flex>
              {loading ? 'Loading...' : null}
              <TableContainer>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Name</Th>
                      <Th>Description</Th>
                      <Th />
                      {/* <Th isNumeric>Members</Th> */}
                    </Tr>
                  </Thead>
                  <Tbody>
                    {daoData.map(data => {
                      return (
                        <Tr key={data.address}>
                          <Td>{data.name}</Td>
                          <Td>{data.description}</Td>
                          <Td>
                            <Button
                              variant="solid"
                              backgroundColor="#04212C"
                              color="white"
                              _hover={{
                                backgroundColor: 'gray.500'
                              }}
                            >
                              <Link href={`/g/${data.address}`}>
                                View Group
                              </Link>
                            </Button>
                          </Td>
                          {/* <Td isNumeric>25.4</Td> */}
                        </Tr>
                      )
                    })}
                  </Tbody>
                </Table>
              </TableContainer>
              <Flex flexDirection="column" />
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
