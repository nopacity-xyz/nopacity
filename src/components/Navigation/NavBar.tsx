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
import { Magic } from 'magic-sdk'
import { useEffect, useState } from 'react'

import { useDispatch } from '@/hooks/useDispatch'
import { useSelector } from '@/hooks/useSelector'

import Blockie from './Blockie'

const Links = [
  { name: 'Groups', link: '/g' },
  { name: 'Create a Group', link: 'create-group' }
]

interface NavLinkProps {
  name: string
  link: string
}

const NavLink = ({ name, link }: NavLinkProps): JSX.Element => (
  <Link
    px={2}
    py={1}
    rounded="md"
    color="white"
    fontWeight="bold"
    _hover={{
      textDecoration: 'none',
      bg: useColorModeValue('gray.700', 'gray.400')
    }}
    href={link}
  >
    {name}
  </Link>
)

export default function NavBar() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const isAuth = useSelector(state => state.isAuth)
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()
  const [magic, setMagic] = useState<Magic>()

  useEffect(() => {
    const magic = new Magic('pk_live_1E208ADDCC61B99E', {
      network: 'goerli'
    })
    setMagic(magic)

    if (user != null) {
      magic.wallet.connectWithUI().catch(err => {
        console.error(err)
        dispatch({ type: 'logout' })
      })
    }
  }, [dispatch, user])

  const handleLogIn = async () => {
    if (magic == null) return
    const accounts = await magic.wallet.connectWithUI().catch(console.error)
    dispatch({ type: 'login', user: accounts[0] })
  }

  const handleLogOut = async () => {
    if (magic == null) return
    const success = await magic.wallet.disconnect().catch(console.error)
    if (success) {
      dispatch({ type: 'logout' })
    }
  }

  const handleClickWallet = async () => {
    if (magic == null) return
    await magic.wallet.showUI().catch(console.error)
  }

  return (
    <Box
      bg={useColorModeValue('gray.100', 'gray.900')}
      px={4}
      top={0}
      right={0}
      left={0}
      zIndex={100}
      w="100%"
      as="header"
      borderBottomRadius={10}
      position="sticky"
      backdropFilter="auto"
      backdropBlur="8px"
      border="1px solid rgba(255, 255, 255, 0.4)"
      backgroundColor="rgba(255, 255, 255, 0.3)"
    >
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <IconButton
          size="md"
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label="Open Menu"
          display={{ md: 'none' }}
          onClick={isOpen ? onClose : onOpen}
        />
        <HStack spacing={8} alignItems="center">
          <Link href="/">
            <Image
              src="https://i.imgur.com/3dVHFRu.png"
              boxSize="50px"
              objectFit="cover"
              alt="Nopacity Logo"
            />
          </Link>
          <HStack as="nav" spacing={4} display={{ base: 'none', md: 'flex' }}>
            {Links.map(link => (
              <NavLink key={link.link} name={link.name} link={link.link} />
            ))}
          </HStack>
          <HStack as="nav" spacing={4} display={{ base: 'none', md: 'flex' }} />
        </HStack>
        <Flex alignItems="center" backdropBlur="8px">
          {!isAuth ? (
            <Button
              onClick={handleLogIn}
              variant="solid"
              backgroundColor="#7BD1EC"
              color="white"
              size="sm"
              mr={4}
            >
              Log In
            </Button>
          ) : (
            <Menu>
              <MenuButton
                as={Button}
                variant="link"
                cursor="pointer"
                minW={0}
                border="1px"
                borderColor="rgba(255,255,255,0.8)"
                shadow="0px 0px 5px rgba(255,255,255,0.3), 1px 1px 5px rgba(255,255,255,0.3),10px 10px 30px rgba(0,0,0,0.3)"
              >
                <Blockie address={user ?? ''} />
              </MenuButton>
              <MenuList
                backdropFilter="auto"
                backdropBlur="8px"
                border="1px solid rgba(255, 255, 255, 0.4)"
                backgroundColor="rgba(255, 255, 255, 0.3)"
                shadow="0px 0px 5px rgba(255,255,255,0.3), 1px 1px 5px rgba(255,255,255,0.3),10px 10px 30px rgba(0,0,0,0.3)"
              >
                <MenuDivider />
                <MenuItem
                  onClick={handleClickWallet}
                  backdropFilter="auto"
                  backdropBlur="0px"
                  border="1px solid rgba(255, 255, 255, 0)"
                  backgroundColor="rgba(255, 255, 255, 0)"
                  borderRadius="10px"
                >
                  My Profile
                </MenuItem>
                <MenuDivider />
                <MenuItem
                  onClick={handleLogOut}
                  backdropFilter="auto"
                  backdropBlur="0px"
                  border="1px solid rgba(255, 255, 255, 0)"
                  backgroundColor="rgba(255, 255, 255, 0)"
                  borderRadius="10px"
                >
                  Log Out
                </MenuItem>
              </MenuList>
            </Menu>
          )}
        </Flex>
      </Flex>

      {isOpen ? (
        <Box pb={4} display={{ md: 'none' }}>
          <Stack as="nav" spacing={4}>
            {Links.map(link => (
              <NavLink key={link.link} name={link.name} link={link.link} />
            ))}
          </Stack>
        </Box>
      ) : null}
    </Box>
  )
}
