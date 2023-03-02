import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import type { AppProps } from 'next/app'
import React, { useReducer } from 'react'

import { StorageService } from '@/components/services/StorageService'
import { Action } from '@/state/actions'
import { initialState, reducer, State } from '@/state/reducer'

// 2. Extend the theme to include custom colors, fonts, etc
const colors = {
  brand: {
    900: '#1a365d',
    800: '#153e75',
    700: '#2a69ac'
  }
}

const theme = extendTheme({ colors })

interface StateContextValue {
  state: State
  dispatch: React.Dispatch<Action>
}
export const StateContext = React.createContext<StateContextValue>({
  state: initialState,
  dispatch: () => {}
})

export default function App({ Component, pageProps }: AppProps) {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <ChakraProvider theme={theme}>
      <StateContext.Provider value={{ state, dispatch }}>
        <Component {...pageProps} />
        <StorageService />
      </StateContext.Provider>
    </ChakraProvider>
  )
}
