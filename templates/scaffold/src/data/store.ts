import { useSyncExternalStore } from 'react'

/**
 * Minimal observable store for fake data. Each prototype reads app state
 * through hooks built on this, so edits to fixtures.ts are the only thing
 * anyone needs to touch to change what the app shows.
 *
 * Usage (in src/data/index.ts, written during playground setup):
 *   export const db = createStore(fixtures)
 *   export const useTasks = () => db.useStore((s) => s.tasks)
 */
export interface Store<T> {
  get: () => T
  set: (update: T | ((prev: T) => T)) => void
  subscribe: (listener: () => void) => () => void
  useStore: <S>(selector: (state: T) => S) => S
}

export function createStore<T>(initial: T): Store<T> {
  let state = initial
  const listeners = new Set<() => void>()

  const set: Store<T>['set'] = (update) => {
    state = typeof update === 'function' ? (update as (prev: T) => T)(state) : update
    for (const listener of listeners) listener()
  }

  const subscribe: Store<T>['subscribe'] = (listener) => {
    listeners.add(listener)
    return () => listeners.delete(listener)
  }

  return {
    get: () => state,
    set,
    subscribe,
    useStore: (selector) => useSyncExternalStore(subscribe, () => selector(state)),
  }
}
