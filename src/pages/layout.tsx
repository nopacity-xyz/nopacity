import { Box } from '@chakra-ui/react'

import NavBar from '@/components/Navigation/NavBar'

interface Props {
  children?: React.ReactNode
}

export default function Layout({ children }: Props) {
  return (
    <Box
      w="100%"
      h="100%"
      bgGradient="linear(to-l, #7928CA, #FF0080)"
      flex={1}
      minHeight="100vh"
    >
      <Box maxWidth={1080} m="auto" position="relative">
        <NavBar />
        <div>{children}</div>
      </Box>
    </Box>
  )
}
