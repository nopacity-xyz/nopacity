import * as React from 'react'

interface State<T> {
  callback: T
  bouncer: T
}

/**
 * A better version of `useCallback`.
 */
export function useHandler<T extends (...args: any[]) => any>(callback: T): T {
  const bouncer: any = (...args: any[]) => stateRef.current.callback(...args)
  const stateRef = React.useRef<State<T>>({ callback, bouncer })
  stateRef.current.callback = callback

  return stateRef.current.bouncer
}
