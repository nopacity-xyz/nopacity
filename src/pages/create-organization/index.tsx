import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  GridItem,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
  InputLeftElement,
  Progress,
  Select,
  SimpleGrid,
  Textarea,
  useToast
} from '@chakra-ui/react'
import React, { ChangeEvent, useState } from 'react'

const Form1 = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [DAOData, setDAOData] = useState({
    token: {
      tokenName: '',
      tokenSymbol: '',
      premintAmount: 0
    },
    governor: {
      daoName: '',
      daoDescription: '',
      votingQuantity: 0,
      votingPeriod: '',
      proposalThreshold: 0,
      quorumFraction: 0
    }
  })
  // const [show /* setShow */] = React.useState(false)
  // const handleClick = () => setShow(!show)
  return (
    <>
      {/* COMPANY CONFIG */}
      <Heading w="100%" textAlign="left" fontWeight="normal" mb="2%">
        Configure Company
      </Heading>
      <Flex>
        {/* DAO NAME */}
        <FormControl mr="5%">
          <FormLabel fontWeight="normal">Company Name</FormLabel>
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
          />
        </FormControl>
        {/* DAO DESCRIPTION */}
        <FormControl>
          <FormLabel fontWeight="normal">Company Description</FormLabel>
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
          />
        </FormControl>
      </Flex>
      <Flex mt="5%">
        <Heading w="50%" textAlign="left" fontWeight="normal" mb="2%">
          Vote Period
        </Heading>
        <Heading w="50%" textAlign="left" fontWeight="normal" mb="2%">
          Vote Criteria
        </Heading>
      </Flex>
      <Flex>
        <Flex>
          {/* VOTING PERIOD AMOUNT */}
          <FormControl mr="5%">
            <FormLabel htmlFor="voting-period-amount" fontWeight="normal">
              Amount
            </FormLabel>
            <Input
              id="voting-period-amount"
              type=""
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setDAOData(prevState => ({
                  ...prevState,
                  governor: {
                    // copy all other key-value pairs of food object
                    ...prevState.governor,
                    votingQuantity: parseInt(e.target.value)
                  }
                }))
              }}
            />
          </FormControl>
          {/* VOTING PERIOD TIME */}
          <FormControl mr="5%">
            <FormLabel htmlFor="voting-period-time" fontWeight="normal">
              Time
            </FormLabel>
            <Select
              className="voting-period-time"
              placeholder="weeks"
              onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                setDAOData(prevState => ({
                  ...prevState,
                  governor: {
                    // copy all other key-value pairs of food object
                    ...prevState.governor,
                    votingPeriod: e.target.value
                  }
                }))
              }}
            >
              <option value="weeks">weeks</option>
              <option value="days">days</option>
              <option value="hours">hours</option>
              <option value="minutes">minutes</option>
              <option value="seconds">seconds</option>
            </Select>
          </FormControl>
        </Flex>
        <Flex>
          {/* VOTING THRESHOLD */}
          <FormControl mr="5%">
            <FormLabel fontWeight="normal">Threshold</FormLabel>
            <Input
              id="email"
              type="email"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setDAOData(prevState => ({
                  ...prevState,
                  governor: {
                    // copy all other key-value pairs of food object
                    ...prevState.governor,
                    proposalThreshold: parseInt(e.target.value)
                  }
                }))
              }}
            />
          </FormControl>
          {/* VOTING QUORUM PERCENTAGE */}
          <FormControl>
            <FormLabel fontWeight="normal">Quorum %</FormLabel>
            <Input
              id="email"
              type="email"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setDAOData(prevState => ({
                  ...prevState,
                  governor: {
                    // copy all other key-value pairs of food object
                    ...prevState.governor,
                    quorumFraction: parseInt(e.target.value)
                  }
                }))
              }}
            />
          </FormControl>
        </Flex>
      </Flex>
      {/* TOKEN CONFIG */}
      <Heading mt="5%" w="100%" textAlign="left" fontWeight="normal" mb="2%">
        Configure Token
      </Heading>
      <Flex>
        {/* TOKEN NAME */}
        <FormControl mr="5%">
          <FormLabel fontWeight="normal" mt="2%">
            Token Name
          </FormLabel>
          <InputGroup size="md">
            <Input
              pr="4.5rem"
              type="text"
              placeholder="US Dollar"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setDAOData(prevState => ({
                  ...prevState,
                  token: {
                    // copy all other key-value pairs of food object
                    ...prevState.token,
                    tokenName: e.target.value
                  }
                }))
              }}
            />
          </InputGroup>
        </FormControl>
        {/* TOKEN SYMBOL */}
        <FormControl mr="5%">
          <FormLabel fontWeight="normal" mt="2%">
            Token Symbol
          </FormLabel>
          <InputGroup size="md">
            <Input
              pr="4.5rem"
              // type={show ? 'text' : 'password'}
              placeholder="USD"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setDAOData(prevState => ({
                  ...prevState,
                  token: {
                    // copy all other key-value pairs of food object
                    ...prevState.token,
                    tokenSymbol: e.target.value
                  }
                }))
              }}
            />
          </InputGroup>
        </FormControl>
        {/* TOKEN PREMINT AMOUNT */}
        <FormControl>
          <FormLabel fontWeight="normal" mt="2%">
            Token Quantity
          </FormLabel>
          <InputGroup size="md">
            <InputLeftElement
              pointerEvents="none"
              color="gray.300"
              // fontSize="1.2em"
              // eslint-disable-next-line react/no-children-prop
              children={'$' + DAOData.token.tokenSymbol}
            />
            <Input
              pr="4.5rem"
              // type={show ? 'text' : 'password'}
              placeholder="1,000,000"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setDAOData(prevState => ({
                  ...prevState,
                  token: {
                    // copy all other key-value pairs of food object
                    ...prevState.token,
                    premintAmount: parseInt(e.target.value)
                  }
                }))
              }}
            />
          </InputGroup>
        </FormControl>
      </Flex>
    </>
  )
}

const Form2 = () => {
  return (
    <>
      <Heading w="100%" textAlign="center" fontWeight="normal" mb="2%">
        Review Configuration
      </Heading>
      <FormControl as={GridItem} colSpan={[6, 3]}>
        <FormLabel
          htmlFor="country"
          fontSize="sm"
          fontWeight="md"
          color="gray.700"
          _dark={{
            color: 'gray.50'
          }}
        >
          Country / Region
        </FormLabel>
        <Select
          id="country"
          name="country"
          autoComplete="country"
          placeholder="Select option"
          focusBorderColor="brand.400"
          shadow="sm"
          size="sm"
          w="full"
          rounded="md"
        >
          <option>United States</option>
          <option>Canada</option>
          <option>Mexico</option>
        </Select>
      </FormControl>

      <FormControl as={GridItem} colSpan={6}>
        <FormLabel
          htmlFor="street_address"
          fontSize="sm"
          fontWeight="md"
          color="gray.700"
          _dark={{
            color: 'gray.50'
          }}
          mt="2%"
        >
          Street address
        </FormLabel>
        <Input
          type="text"
          name="street_address"
          id="street_address"
          autoComplete="street-address"
          focusBorderColor="brand.400"
          shadow="sm"
          size="sm"
          w="full"
          rounded="md"
        />
      </FormControl>

      <FormControl as={GridItem} colSpan={[6, 6, null, 2]}>
        <FormLabel
          htmlFor="city"
          fontSize="sm"
          fontWeight="md"
          color="gray.700"
          _dark={{
            color: 'gray.50'
          }}
          mt="2%"
        >
          City
        </FormLabel>
        <Input
          type="text"
          name="city"
          id="city"
          autoComplete="city"
          focusBorderColor="brand.400"
          shadow="sm"
          size="sm"
          w="full"
          rounded="md"
        />
      </FormControl>

      <FormControl as={GridItem} colSpan={[6, 3, null, 2]}>
        <FormLabel
          htmlFor="state"
          fontSize="sm"
          fontWeight="md"
          color="gray.700"
          _dark={{
            color: 'gray.50'
          }}
          mt="2%"
        >
          State / Province
        </FormLabel>
        <Input
          type="text"
          name="state"
          id="state"
          autoComplete="state"
          focusBorderColor="brand.400"
          shadow="sm"
          size="sm"
          w="full"
          rounded="md"
        />
      </FormControl>

      <FormControl as={GridItem} colSpan={[6, 3, null, 2]}>
        <FormLabel
          htmlFor="postal_code"
          fontSize="sm"
          fontWeight="md"
          color="gray.700"
          _dark={{
            color: 'gray.50'
          }}
          mt="2%"
        >
          ZIP / Postal
        </FormLabel>
        <Input
          type="text"
          name="postal_code"
          id="postal_code"
          autoComplete="postal-code"
          focusBorderColor="brand.400"
          shadow="sm"
          size="sm"
          w="full"
          rounded="md"
        />
      </FormControl>
    </>
  )
}

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [DAOData, setDAOData] = useState({
    token: {
      tokenName: '',
      tokenSymbol: '',
      premintAmount: 0
    },
    governor: {
      daoName: '',
      votingQuantity: 0,
      votingPeriod: 0,
      quorumFraction: 0
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
        <Progress hasStripe value={progress} mb="5%" mx="5%" isAnimated />
        {step === 1 ? <Form1 /> : step === 2 ? <Form2 /> : <Form3 />}
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
