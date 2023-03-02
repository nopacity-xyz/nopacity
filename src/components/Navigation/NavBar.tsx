import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Image,
  Link,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Stack,
  useColorModeValue,
  useDisclosure
} from '@chakra-ui/react'
import { ethers } from 'ethers'
import { useCallback, useEffect } from 'react'

import Blockie from './Blockie'

const Links = ['Dashboard', 'Projects', 'Team']

interface NavLinkProps {
  children: React.ReactNode
}
const NavLink = ({ children }: NavLinkProps) => (
  <Link
    px={2}
    py={1}
    rounded="md"
    _hover={{
      textDecoration: 'none',
      bg: useColorModeValue('gray.200', 'gray.700')
    }}
    href="#"
  >
    {children}
  </Link>
)

interface NavBarProps {
  loggedIn: boolean
  setLoggedIn: {
    on: () => void
    off: () => void
    toggle: () => void
  }
  user: string
  setUser: (address: string) => void
}

export default function NavBar({
  loggedIn,
  setLoggedIn,
  user,
  setUser
}: NavBarProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const handleLogIn = async () => {
    // NOT SURE HOW TO GET THE BELOW TO WORK
    // @ts-expect-error
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const res = await provider.send('eth_requestAccounts', [])

    if (res != null) {
      setLoggedIn.on()
      setUser(res[0])
    }
  }

  const handleLogOut = useCallback(async () => {
    setLoggedIn.off()
  }, [setLoggedIn])

  useEffect(() => {
    handleLogOut().catch(err => console.error(err))
  }, [handleLogOut])

  return (
    <>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex h={16} alignItems="center" justifyContent="space-between">
          <IconButton
            size="md"
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label="Open Menu"
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems="center">
            <Image
              src="https://i.imgur.com/3dVHFRu.png"
              boxSize="50px"
              objectFit="cover"
              alt="Nopacity Logo"
            />
            {/* <Image
              src="https://i.imgur.com/LHIXA73.png"
              // boxSize="50px"
              height="50px"
              objectFit="cover"
              alt="Nopacity Logo"
            /> */}
            <HStack
              as="nav"
              spacing={4}
              display={{ base: 'none', md: 'flex' }}
            />
          </HStack>
          <Flex alignItems="center">
            {!loggedIn ? (
              <Button
                onClick={handleLogIn}
                variant="solid"
                backgroundColor="#7BD1EC"
                color="white"
                size="sm"
                mr={4}
              >
                Connect Wallet
              </Button>
            ) : (
              <Menu>
                <MenuButton
                  as={Button}
                  variant="link"
                  cursor="pointer"
                  minW={0}
                >
                  <Blockie address={user} />
                </MenuButton>
                <MenuList>
                  {/* <MenuItem onClick={getUserTokenBalance}>My Tokens</MenuItem> */}
                  <MenuDivider />
                  <MenuItem onClick={handleLogOut}>Log Out</MenuItem>
                </MenuList>
              </Menu>
            )}
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as="nav" spacing={4}>
              {Links.map(link => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  )
}
