import { SetState, GetState, StoreApi, StateCreator } from 'zustand'

const isClient = typeof window !== 'undefined'

export const log = config => (set, get, api) =>
  config(
    args => {
      console.log('  applying', args)
      set(args)
      console.log('  new state', get())
    },
    get,
    api,
  )

export const persist = <T>(key: string, config: StateCreator<T>) => (
  set: SetState<T>,
  get: GetState<T>,
  api: StoreApi<T>,
): T => {
  const state = config(
    (payload: T) => {
      set(payload)

      if (isClient) {
        localStorage.setItem(key, JSON.stringify(payload))
      }
    },
    get,
    api,
  )

  return {
    ...state,
    ...(isClient && JSON.parse(localStorage.getItem(key))),
  }
}
