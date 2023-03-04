import { QuestionOutlineIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Collapse,
  Divider,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  GridItem,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Progress,
  Select,
  SimpleGrid,
  Stack,
  StackDivider,
  Text,
  Textarea,
  Tooltip,
  useDisclosure
  // useToast
} from '@chakra-ui/react'
import { ethers } from 'ethers'
import { Magic } from 'magic-sdk'
import React, { ChangeEvent, useState } from 'react'

import TokenContract from '../../contracts/TokenContract.json'
import Layout from '../layout'

// interface GroupConfigData {
//   token: {
//     tokenName: string
//     tokenSymbol: string
//   }
//   governor: {
//     groupName: string
//     groupDescription: string
//     votingQuantity: number
//     votingPeriod: string
//     quorumFraction: number
//   }
// }

export default function CreateGroup() {
  // const toast = useToast()
  const [step, setStep] = useState(1)
  const [progress, setProgress] = useState(33.33)
  // const [deploying, setDeploying] = useState(false)
  const { isOpen, onToggle } = useDisclosure()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [GroupData, setGroupData] = useState({
    token: {
      tokenName: '',
      tokenSymbol: ''
    },
    governor: {
      groupName: '',
      groupDescription: '',
      votingQuantity: 1,
      votingPeriod: 'days',
      quorumFraction: 51
    }
  })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSubmit = async () => {
    // e.preventDefault()
    const magic = new Magic('pk_live_1E208ADDCC61B99E')
    const provider = new ethers.providers.Web3Provider(magic.rpcProvider as any)

    // ⭐️ After user is successfully authenticated

    const signer = provider.getSigner()

    const contractABI = TokenContract.abi

    const contractByteCode = TokenContract.bytecode
    const contractFactory = new ethers.ContractFactory(
      contractABI,
      contractByteCode,
      signer
    )

    // Deploy contract with "Hello World!" in the constructor
    const contract = await contractFactory.deploy(
      ethers.constants.AddressZero,
      'THIS WORKED WOW',
      'TWW'
    )

    // Wait for deployment to finish
    const receipt = await contract.deployed()

    console.log(receipt)

    // e.preventDefault()

    // console.log(JSON.stringify(GroupData))
    // setDeploying(true)
    // await fetch('/api/deploy', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(GroupData)
    // }).then(() => {
    //   setDeploying(false)
    //   setStep(3)
    //   toast({
    //     title: 'Account created.',
    //     description: 'Group Deployed! 🎉',
    //     status: 'success',
    //     duration: 3000,
    //     isClosable: true
    //   })
    // })
  }

  return (
    <Layout>
      <Box
        borderWidth="1px"
        rounded="lg"
        shadow="0px 0px 5px rgba(255,255,255,0.3), 1px 1px 5px rgba(255,255,255,0.3),10px 10px 30px rgba(0,0,0,0.3)"
        maxWidth={800}
        p={6}
        m="10px auto"
        as="form"
        backdropFilter="auto"
        backdropBlur="8px"
        border="1px solid rgba(255, 255, 255, 0.4)"
        backgroundColor="rgba(255, 255, 255, 0.2)"
      >
        <Progress
          hasStripe
          value={progress}
          mb="5%"
          mx="5%"
          isAnimated
          borderRadius="4px"
        />
        {step === 1 ? (
          // FORM #1
          <>
            {/* GROUP CONFIG */}
            <Heading
              w="100%"
              textAlign="left"
              fontWeight="bold"
              mb="2%"
              color="black"
            >
              Configure Group
            </Heading>
            <Flex color="black">
              {/* GROUP NAME */}
              <FormControl mr="5%" isRequired>
                <Flex>
                  <FormLabel fontWeight="normal">Group Name</FormLabel>
                  <Tooltip label="What's the name?">
                    <QuestionOutlineIcon />
                  </Tooltip>
                </Flex>
                <Input
                  id="group-name"
                  placeholder="The Muffin Man"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setGroupData(prevState => ({
                      ...prevState,
                      governor: {
                        // copy all other key-value pairs of food object
                        ...prevState.governor,
                        groupName: e.target.value
                      }
                    }))
                  }}
                  value={GroupData.governor.groupName}
                />
              </FormControl>
              {/* GROUP DESCRIPTION */}
              <FormControl isRequired>
                <Flex>
                  <FormLabel fontWeight="normal">Group Description</FormLabel>
                  <Tooltip label="What's the purpose of your group?">
                    <QuestionOutlineIcon />
                  </Tooltip>
                </Flex>
                <Textarea
                  id="group-description"
                  placeholder="The one on Drury Lane"
                  rows={2}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                    setGroupData(prevState => ({
                      ...prevState,
                      governor: {
                        // copy all other key-value pairs of food object
                        ...prevState.governor,
                        groupDescription: e.target.value
                      }
                    }))
                  }}
                  value={GroupData.governor.groupDescription}
                />
              </FormControl>
            </Flex>
            <Divider mt="5%" />
            <Flex mt="5%">
              <Heading w="50%" textAlign="left" fontWeight="normal" mb="2%">
                Vote Period
              </Heading>
            </Flex>
            <Flex>
              <Flex>
                {/* VOTING PERIOD AMOUNT */}
                <FormControl mr="5%">
                  <FormLabel htmlFor="voting-period-amount" fontWeight="normal">
                    Amount
                  </FormLabel>
                  <NumberInput
                    defaultValue={2}
                    min={1}
                    max={100}
                    size="md"
                    clampValueOnBlur={false}
                    onChange={(e: string) => {
                      setGroupData(prevState => ({
                        ...prevState,
                        governor: {
                          // copy all other key-value pairs of food object
                          ...prevState.governor,
                          votingQuantity: parseInt(e)
                        }
                      }))
                    }}
                    value={GroupData.governor.votingQuantity}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
                {/* VOTING PERIOD TIME */}
                <FormControl mr="5%">
                  <FormLabel htmlFor="voting-period-time" fontWeight="normal">
                    Time
                  </FormLabel>
                  <Select
                    className="voting-period-time"
                    // placeholder="weeks"
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                      console.log(e.target.value)
                      setGroupData(prevState => ({
                        ...prevState,
                        governor: {
                          // copy all other key-value pairs of food object
                          ...prevState.governor,
                          votingPeriod: e.target.value
                        }
                      }))
                      console.log(GroupData.governor.votingPeriod)
                    }}
                    value={GroupData.governor.votingPeriod}
                  >
                    <option value="weeks">weeks</option>
                    <option value="days">days</option>
                    <option value="hours">hours</option>
                    <option value="minutes">minutes</option>
                    <option value="seconds">seconds</option>
                  </Select>
                </FormControl>
              </Flex>
            </Flex>
            <Button
              mt="5%"
              onClick={onToggle}
              backdropFilter="auto"
              backdropBlur="8px"
              border="1px solid rgba(255, 255, 255, 0.4)"
              backgroundColor="rgba(255, 255, 255, 0.5)"
            >
              Show Advanced Settings
            </Button>
            <Collapse in={isOpen} animateOpacity>
              <Box
                p="40px"
                // color="white"
                mt="4"
                // bg="teal.500"
                rounded="md"
                shadow="md"
                backdropFilter="auto"
                backdropBlur="8px"
                border="1px solid rgba(255, 255, 255, 0.4)"
                backgroundColor="rgba(255, 255, 255, 0.1)"
              >
                <Flex>
                  {/* VOTING QUORUM PERCENTAGE */}

                  <FormControl isRequired>
                    <Flex>
                      <FormLabel fontWeight="bold">Pass %</FormLabel>
                      <Tooltip label="What percentage of the voters in your group need to agree with your idea for it to pass?">
                        <QuestionOutlineIcon />
                      </Tooltip>
                    </Flex>
                    <NumberInput
                      defaultValue={51}
                      min={0}
                      max={100}
                      size="md"
                      clampValueOnBlur={false}
                      onChange={(e: string) => {
                        setGroupData(prevState => ({
                          ...prevState,
                          governor: {
                            // copy all other key-value pairs of food object
                            ...prevState.governor,
                            quorumFraction: parseInt(e)
                          }
                        }))
                      }}
                      value={GroupData.governor.quorumFraction}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                </Flex>
              </Box>
            </Collapse>
          </>
        ) : // FORM #2
        step === 2 ? (
          <>
            <Heading w="100%" textAlign="center" fontWeight="bold" mb="2%">
              Review Configuration
            </Heading>
            <FormControl as={GridItem} colSpan={[6, 3]}>
              <Card
                backdropFilter="auto"
                backdropBlur="8px"
                border="1px solid rgba(255, 255, 255, 0.4)"
                backgroundColor="rgba(255, 255, 255, 0.2)"
              >
                <CardHeader>
                  <Heading size="md">Group Data</Heading>
                </CardHeader>

                <CardBody>
                  <Stack divider={<StackDivider />} spacing="4">
                    <Box>
                      <Heading size="xs" textTransform="uppercase">
                        Group Name
                      </Heading>
                      <Text pt="2" fontSize="sm">
                        {GroupData.governor.groupName}
                      </Text>
                    </Box>
                    <Box>
                      <Heading size="xs" textTransform="uppercase">
                        Group Description
                      </Heading>
                      <Text pt="2" fontSize="sm">
                        {GroupData.governor.groupDescription}
                      </Text>
                    </Box>
                    <Box>
                      <Heading size="xs" textTransform="uppercase">
                        Voting Period
                      </Heading>
                      <Text pt="2" fontSize="sm">
                        {GroupData.governor.votingQuantity}{' '}
                        {GroupData.governor.votingPeriod}
                      </Text>
                    </Box>
                    <Box>
                      <Heading size="xs" textTransform="uppercase">
                        Pass %
                      </Heading>
                      <Text pt="2" fontSize="sm">
                        {GroupData.governor.quorumFraction}
                      </Text>
                    </Box>
                  </Stack>
                </CardBody>
              </Card>
            </FormControl>
          </>
        ) : (
          <>
            <Heading w="100%" textAlign="center" fontWeight="normal">
              Social Handles
            </Heading>
            <SimpleGrid columns={1} spacing={6}>
              <FormControl as={GridItem} colSpan={[3, 2]}>
                <FormLabel
                  fontSize="sm"
                  fontWeight="md"
                  color="gray.700"
                  _dark={{
                    color: 'gray.50'
                  }}
                >
                  Website
                </FormLabel>
                <InputGroup size="sm">
                  <InputLeftAddon
                    bg="gray.50"
                    _dark={{
                      bg: 'gray.800'
                    }}
                    color="gray.500"
                    rounded="md"
                  >
                    http://
                  </InputLeftAddon>
                  <Input
                    type="tel"
                    placeholder="www.example.com"
                    focusBorderColor="brand.400"
                    rounded="md"
                  />
                </InputGroup>
              </FormControl>

              <FormControl id="email" mt={1}>
                <FormLabel
                  fontSize="sm"
                  fontWeight="md"
                  color="gray.700"
                  _dark={{
                    color: 'gray.50'
                  }}
                >
                  About
                </FormLabel>
                <Textarea
                  placeholder="you@example.com"
                  rows={3}
                  shadow="sm"
                  focusBorderColor="brand.400"
                  fontSize={{
                    sm: 'sm'
                  }}
                />
                <FormHelperText>
                  Brief description for your profile. URLs are hyperlinked.
                </FormHelperText>
              </FormControl>
            </SimpleGrid>
          </>
        )}
        <ButtonGroup mt="5%" w="100%">
          <Flex w="100%" justifyContent="space-between">
            <Flex>
              <Button
                onClick={() => {
                  setStep(step - 1)
                  setProgress(progress - 33.33)
                }}
                isDisabled={step === 1}
                colorScheme="teal"
                variant="outline"
                w="7rem"
                mr="5%"
              >
                Back
              </Button>
              {step === 2 ? (
                <Button
                  w="7rem"
                  color="white"
                  variant="solid"
                  backdropFilter="auto"
                  backdropBlur="8px"
                  border="1px solid rgba(255, 255, 255, 0.4)"
                  backgroundColor="rgba(43, 108, 176, 0.6)"
                  _hover={{ bg: 'rgba(43, 108, 176, 1)' }}
                  onClick={
                    () => {
                      handleSubmit()
                        .then(() => console.log('this will succeed'))
                        .catch(err => console.error(err))
                    }
                    //   () => {
                    //   toast({
                    //     title: 'Account created.',
                    //     description: 'Group Deployed! 🎉',
                    //     status: 'success',
                    //     duration: 3000,
                    //     isClosable: true
                    //   })
                    // }
                  }
                >
                  Deploy 🚀
                </Button>
              ) : (
                <Button
                  w="7rem"
                  // isLoading={deploying}
                  isDisabled={step === 3}
                  onClick={() => {
                    setStep(step + 1)
                    if (step === 3) {
                      setProgress(100)
                    } else {
                      setProgress(progress + 33.33)
                    }
                  }}
                  backdropFilter="auto"
                  backdropBlur="8px"
                  border="1px solid rgba(255, 255, 255, 0.4)"
                  backgroundColor="rgba(255, 255, 255, 0.5)"
                  variant="solid"
                >
                  Next
                </Button>
              )}
            </Flex>
          </Flex>
        </ButtonGroup>
      </Box>
    </Layout>
  )
}
