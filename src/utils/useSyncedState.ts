import {useEffect, useState, useCallback} from 'react'
import browser from 'webextension-polyfill'
import {useErrorHandler} from 'react-error-boundary'
import {MiuStorage, MiuStorageKey} from '@types'

export function useSyncedState<Key extends MiuStorageKey>(storageKey: Key) {
  const [localState, setLocalState] = useState<MiuStorage[Key] | null>(null)
  const handleError = useErrorHandler()

  const setState = useCallback(
    (newState: MiuStorage[Key] | null) => {
      setLocalState(newState)
      browser.storage.sync.set({[storageKey]: newState})
    },
    [storageKey],
  )

  useEffect(() => {
    const getStorage = async () => {
      const result = await browser.storage.sync.get(storageKey)

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      if (result[storageKey] === undefined) {
        setState(localState || null)
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        setLocalState(result[storageKey])
      }
    }

    getStorage().catch(e => handleError(e))
  }, [handleError, storageKey, setState, localState])

  return [localState, setState] as const
}
