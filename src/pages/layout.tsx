import { Box } from '@chakra-ui/react'

import NavBar from '@/components/Navigation/NavBar'

import DynamicBackground from './bg'

interface Props {
  children?: React.ReactNode
}

export default function Layout({ children }: Props) {
  return (
    <Box
      w="100%"
      h="100%"
      background="rgba(0,0,0,0)"
      flex={1}
      minHeight="100vh"
    >
      <DynamicBackground />
      <Box maxWidth={1080} m="auto" position="relative">
        <NavBar />
        <Box m="5%" mt="0px" mb="0px">
          {children}
        </Box>
      </Box>
    </Box>
  )
}
