import debounce from 'debounce'
import { useEffect } from 'react'

import { useDispatch } from '@/hooks/useDispatch'
import { useSelector } from '@/hooks/useSelector'
import { State } from '@/state/reducer'

const saveState = debounce((state: State) => {
  const cache = JSON.stringify(state)
  localStorage.setItem('cache', cache)
}, 600)

const loadState = (): State | undefined => {
  const cache = localStorage.getItem('cache')
  if (cache == null) return
  const state: State = JSON.parse(cache)
  return state
}

export function StorageService() {
  const state = useSelector(state => state)
  const dispatch = useDispatch()

  useEffect(() => {
    const state = loadState()
    if (state == null) return
    dispatch({ type: 'init', state })
  }, [dispatch])

  useEffect(() => {
    saveState(state)
  }, [state])

  return null
}
