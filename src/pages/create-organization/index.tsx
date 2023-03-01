import { QuestionIcon } from '@chakra-ui/icons'
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
  useDisclosure,
  useToast
} from '@chakra-ui/react'
import React, { ChangeEvent, useState } from 'react'

// interface DAOConfigData {
//   token: {
//     tokenName: string
//     tokenSymbol: string
//   }
//   governor: {
//     daoName: string
//     daoDescription: string
//     votingQuantity: number
//     votingPeriod: string
//     quorumFraction: number
//   }
// }

// const Form2 = () => {
//   return (
//   )
// }

const Form3 = () => {
  return (
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
  )
}

export default function CreateOrganization() {
  const toast = useToast()
  const [step, setStep] = useState(1)
  const [progress, setProgress] = useState(33.33)
  const [deploying, setDeploying] = useState(false)
  const { isOpen, onToggle } = useDisclosure()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [DAOData, setDAOData] = useState({
    token: {
      tokenName: '',
      tokenSymbol: ''
    },
    governor: {
      daoName: '',
      daoDescription: '',
      votingQuantity: 1,
      votingPeriod: 'days',
      quorumFraction: 51
    }
  })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSubmit = async (e: Event) => {
    e.preventDefault()

    console.log(JSON.stringify(DAOData))
    setDeploying(true)
    await fetch('/api/deploy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(DAOData)
    }).then(() => {
      setDeploying(false)
      setStep(3)
      toast({
        title: 'Account created.',
        description: 'Company Deployed! 🎉',
        status: 'success',
        duration: 3000,
        isClosable: true
      })
    })
  }

  return (
    <>
      <Box
        borderWidth="1px"
        rounded="lg"
        shadow="1px 1px 3px rgba(0,0,0,0.3)"
        maxWidth={800}
        p={6}
        m="10px auto"
        as="form"
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
            {/* COMPANY CONFIG */}
            <Heading w="100%" textAlign="left" fontWeight="normal" mb="2%">
              Configure Company
            </Heading>
            <Flex>
              {/* DAO NAME */}
              <FormControl mr="5%" isRequired>
                <Flex>
                  <FormLabel fontWeight="normal">Company Name</FormLabel>
                  <Tooltip label="What's the name?">
                    <QuestionIcon />
                  </Tooltip>
                </Flex>
                <Input
                  id="dao-name"
                  placeholder="The Muffin Man"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setDAOData(prevState => ({
                      ...prevState,
                      governor: {
                        // copy all other key-value pairs of food object
                        ...prevState.governor,
                        daoName: e.target.value
                      }
                    }))
                  }}
                  value={DAOData.governor.daoName}
                />
              </FormControl>
              {/* DAO DESCRIPTION */}
              <FormControl isRequired>
                <Flex>
                  <FormLabel fontWeight="normal">Company Description</FormLabel>
                  <Tooltip label="What's the purpose of your organization?">
                    <QuestionIcon />
                  </Tooltip>
                </Flex>
                <Textarea
                  id="dao-description"
                  placeholder="The one on Drury Lane"
                  rows={2}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                    setDAOData(prevState => ({
                      ...prevState,
                      governor: {
                        // copy all other key-value pairs of food object
                        ...prevState.governor,
                        daoDescription: e.target.value
                      }
                    }))
                  }}
                  value={DAOData.governor.daoDescription}
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
                      setDAOData(prevState => ({
                        ...prevState,
                        governor: {
                          // copy all other key-value pairs of food object
                          ...prevState.governor,
                          votingQuantity: parseInt(e)
                        }
                      }))
                    }}
                    value={DAOData.governor.votingQuantity}
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
                      setDAOData(prevState => ({
                        ...prevState,
                        governor: {
                          // copy all other key-value pairs of food object
                          ...prevState.governor,
                          votingPeriod: e.target.value
                        }
                      }))
                      console.log(DAOData.governor.votingPeriod)
                    }}
                    value={DAOData.governor.votingPeriod}
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
            <Button mt="5%" onClick={onToggle}>
              Show Advanced Settings
            </Button>
            <Collapse in={isOpen} animateOpacity>
              <Box
                p="40px"
                color="white"
                mt="4"
                bg="teal.500"
                rounded="md"
                shadow="md"
              >
                <Flex>
                  {/* VOTING QUORUM PERCENTAGE */}

                  <FormControl isRequired>
                    <Flex>
                      <FormLabel fontWeight="normal">Pass %</FormLabel>
                      <Tooltip label="What percentage of the voters in your organization need to agree with your idea for it to pass?">
                        <QuestionIcon />
                      </Tooltip>
                    </Flex>
                    <NumberInput
                      defaultValue={51}
                      min={0}
                      max={100}
                      size="md"
                      clampValueOnBlur={false}
                      onChange={(e: string) => {
                        setDAOData(prevState => ({
                          ...prevState,
                          governor: {
                            // copy all other key-value pairs of food object
                            ...prevState.governor,
                            quorumFraction: parseInt(e)
                          }
                        }))
                      }}
                      value={DAOData.governor.quorumFraction}
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
            <Heading w="100%" textAlign="center" fontWeight="normal" mb="2%">
              Review Configuration
            </Heading>
            <FormControl as={GridItem} colSpan={[6, 3]}>
              <Card>
                <CardHeader>
                  <Heading size="md">Company Data</Heading>
                </CardHeader>

                <CardBody>
                  <Stack divider={<StackDivider />} spacing="4">
                    <Box>
                      <Heading size="xs" textTransform="uppercase">
                        Company Name
                      </Heading>
                      <Text pt="2" fontSize="sm">
                        {DAOData.governor.daoName}
                      </Text>
                    </Box>
                    <Box>
                      <Heading size="xs" textTransform="uppercase">
                        Company Description
                      </Heading>
                      <Text pt="2" fontSize="sm">
                        {DAOData.governor.daoDescription}
                      </Text>
                    </Box>
                    <Box>
                      <Heading size="xs" textTransform="uppercase">
                        Voting Period
                      </Heading>
                      <Text pt="2" fontSize="sm">
                        {DAOData.governor.votingQuantity}{' '}
                        {DAOData.governor.votingPeriod}
                      </Text>
                    </Box>
                    <Box>
                      <Heading size="xs" textTransform="uppercase">
                        Pass %
                      </Heading>
                      <Text pt="2" fontSize="sm">
                        {DAOData.governor.quorumFraction}
                      </Text>
                    </Box>
                  </Stack>
                </CardBody>
              </Card>
            </FormControl>
          </>
        ) : (
          <Form3 />
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
                  colorScheme="blue"
                  variant="solid"
                  onClick={() => {
                    toast({
                      title: 'Account created.',
                      description: 'Company Deployed! 🎉',
                      status: 'success',
                      duration: 3000,
                      isClosable: true
                    })
                  }}
                >
                  Deploy 🚀
                </Button>
              ) : (
                <Button
                  w="7rem"
                  isLoading={deploying}
                  isDisabled={step === 3}
                  onClick={() => {
                    setStep(step + 1)
                    if (step === 3) {
                      setProgress(100)
                    } else {
                      setProgress(progress + 33.33)
                    }
                  }}
                  colorScheme="teal"
                  variant="solid"
                >
                  Next
                </Button>
              )}
            </Flex>
          </Flex>
        </ButtonGroup>
      </Box>
    </>
  )
}
