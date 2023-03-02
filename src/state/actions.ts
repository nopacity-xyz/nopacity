import { State } from './reducer'

export type Action =
  | { type: 'init'; state: State }
  | { type: 'login'; user: string }
  | { type: 'logout' }
