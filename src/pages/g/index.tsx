import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  Center,
  Flex,
  Heading,
  // Image,
  Link,
  Stack,
  Text
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
            <Box>
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
              <Flex flexDirection="column">
                {loading ? 'Loading...' : null}
                {daoData.map(data => {
                  return (
                    <SingleGroupItem
                      key={data.address}
                      groupAddress={data.address}
                      groupName={data.name}
                      groupDescription={data.description}
                      // numMembers={40}
                    />
                  )
                })}
                {/* <SingleGroupItem
                      groupAddress="0x77a11df57295e5d6d4923872223a75bd96887a3a"
                      groupName="Test Group Name"
                      groupDescription="Lorem ipsum mofo. Very intesting description describing the purpose of the group!"
                      numMembers={40}
                    />
                  </Flex>
                  <Flex>
                    <SingleGroupItem
                      groupAddress="0x77a11df57295e5d6d4923872223a75bd96887a3a"
                      groupName="Test Group Name"
                      groupDescription="Lorem ipsum mofo. Very intesting description describing the purpose of the group!"
                      numMembers={40}
                    />
                    <SingleGroupItem
                      groupAddress="0x77a11df57295e5d6d4923872223a75bd96887a3a"
                      groupName="Test Group Name"
                      groupDescription="Lorem ipsum mofo. Very intesting description describing the purpose of the group!"
                      numMembers={40}
                    />
                  */}
              </Flex>
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

interface SingleGroupProps {
  groupAddress: string
  groupName: string
  groupDescription: string
  numMembers?: number
}
const SingleGroupItem = ({
  groupAddress,
  groupName,
  groupDescription,
  numMembers
}: SingleGroupProps): JSX.Element => {
  return (
    //     {groupName = 'Test Group',
    // groupDescription = 'This is a very interesting description',
    // numMembers = 23}
    <Card
      // className="nopaque"
      // color="white"
      mt="5%"
      mr="2.5%"
      ml="2.5%"
      backdropFilter="auto"
      backdropBlur="8px"
      border="1px solid rgba(255, 255, 255, 0.4)"
      borderRadius="20px"
      backgroundColor="rgba(255, 255, 255, 0.2)"
      shadow="0px 0px 5px rgba(255,255,255,0.3), 1px 1px 5px rgba(255,255,255,0.3),10px 10px 30px rgba(0,0,0,0.3)"
      direction={{ base: 'column', sm: 'row' }}
      overflow="hidden"
      variant="outline"
    >
      {/* <Image
        objectFit="cover"
        maxW={{ base: '100%', sm: '200px' }}
        src="https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60"
        alt="Caffe Latte"
      /> */}
      <Stack>
        <CardBody className="nopaque">
          <Heading size="md">{groupName}</Heading>
          <Text py="2">{groupDescription}</Text>
          <Text py="2">{numMembers}</Text>
        </CardBody>
        <CardFooter>
          <Button
            variant="solid"
            backgroundColor="#04212C"
            color="white"
            _hover={{
              backgroundColor: 'gray.500'
            }}
          >
            <Link href={`/g/${groupAddress}`}>View Group</Link>
          </Button>
        </CardFooter>
      </Stack>
    </Card>
  )
}
