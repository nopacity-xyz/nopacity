import { Action } from './actions'

export interface State {
  isAuth: boolean
  user?: string
}

export function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'init': {
      return action.state
    }
    case 'login': {
      return { ...state, isAuth: true, user: action.user }
    }
    case 'logout': {
      const { user: _, ...rest } = state
      return { ...rest, isAuth: false }
    }
    default:
      return state
  }
}

export const initialState: State = {
  isAuth: false
}
