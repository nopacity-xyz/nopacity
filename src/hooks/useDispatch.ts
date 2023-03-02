import { Dispatch, useContext } from 'react'

import { StateContext } from '@/pages/_app'
import { Action } from '@/state/actions'

export function useDispatch(): Dispatch<Action> {
  const { dispatch } = useContext(StateContext)
  return dispatch
}
