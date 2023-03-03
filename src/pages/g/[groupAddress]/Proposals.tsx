import {
  Box,
  Button,
  Card,
  CardBody,
  Center,
  Heading,
  Link,
  Progress,
  Skeleton,
  SkeletonText,
  Stack,
  Text
} from '@chakra-ui/react'
import React from 'react'

interface SingleProposalProps {
  proposalDescription: string
  groupName: string
  groupDescription: string
  percentagePass: number
}

const MakeProposalItem = () => {
  return (
    <Box mt="5%" mr="2.5%" ml="2.5%">
      <Card
        // className="nopaque"
        // color="white"
        // position="absolute"
        mt="0px"
        mr="0px"
        ml="0xpx"
        backdropFilter="auto"
        backdropBlur="8px"
        border="1px solid rgba(255, 255, 255, 0.4)"
        borderRadius="20px"
        backgroundColor="rgba(255, 255, 255, 0.1)"
        direction={{ base: 'column', sm: 'row' }}
        overflow="hidden"
        variant="outline"
      >
        <CardBody className="nopaque">
          <Skeleton>
            <Heading size="md">This is an example proposal!</Heading>
          </Skeleton>
          <SkeletonText mt="5%" mb="5%">
            <Text py="2">
              This is an example description! It's very interesting and requires
              a lot of votes.
            </Text>
          </SkeletonText>
          <Progress m="2%" isIndeterminate size="xs" colorScheme="gray" />
          <Center>
            {/* <Skeleton borderRadius="10px">
              <Text size="xs">0%</Text>
            </Skeleton> */}

            <Button
              variant="solid"
              backdropFilter="auto"
              backdropBlur="8px"
              color="white"
              border="1px solid rgba(255, 255, 255, 0.4)"
              backgroundColor="rgba(123, 209, 236,1)"
            >
              <Link href="veryInterestingLinkHere">Create New Idea</Link>
            </Button>
          </Center>
        </CardBody>
      </Card>
    </Box>
  )
}

const SingleProposalItem = ({
  proposalDescription,
  groupName,
  groupDescription,
  percentagePass
}: SingleProposalProps): JSX.Element => {
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
      backgroundColor="rgba(255, 255, 255, 0.1)"
      direction={{ base: 'column', sm: 'row' }}
      overflow="hidden"
      variant="outline"
    >
      <Stack>
        <CardBody className="nopaque">
          <Heading size="md">{proposalDescription}</Heading>
          <Text py="2">{groupDescription}</Text>
          {percentagePass !== 0 ? (
            <Progress
              m="2%"
              value={percentagePass}
              size="xs"
              colorScheme="cyan"
            />
          ) : (
            <Progress
              m="2%"
              value={percentagePass}
              size="xs"
              isIndeterminate
              colorScheme="cyan"
            />
          )}
          <Center>
            <Text py="2">{percentagePass}%</Text>
            <Button
              variant="solid"
              backdropFilter="auto"
              backdropBlur="8px"
              border="1px solid rgba(255, 255, 255, 0.4)"
              backgroundColor="rgba(255, 255, 255, 0.5)"
            >
              <Link href="veryInterestingLinkHere">Agree with Idea</Link>
            </Button>
          </Center>
        </CardBody>
      </Stack>
    </Card>
  )
}

export default function Proposals() {
  return (
    <>
      <MakeProposalItem />
      <SingleProposalItem
        proposalDescription="This is a very interesting proposal that does a cool thing"
        groupName="Test Group Name"
        groupDescription="Lorem ipsum mofo. Very intesting description describing the purpose of the group!"
        percentagePass={40}
      />
      <SingleProposalItem
        proposalDescription="This is a very interesting proposal that does a cool thing"
        groupName="Test Group Name"
        groupDescription="Lorem ipsum mofo. Very intesting description describing the purpose of the group!"
        percentagePass={0}
      />
    </>
  )
}
