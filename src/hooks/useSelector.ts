import { useContext } from 'react'

import { StateContext } from '@/pages/_app'
import { State } from '@/state/reducer'

export function useSelector<T>(fn: (state: State) => T) {
  const { state } = useContext(StateContext)
  return fn(state)
}
