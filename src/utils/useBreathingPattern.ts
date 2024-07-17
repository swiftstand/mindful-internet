import {useSyncedState} from './useSyncedState'
import {breathingPatterns} from '../breathing-patterns'
import {errorHandler} from '@ui'

export const useBreathingPattern = (isRedirecting?: boolean | undefined) => {
  const [patternName] = useSyncedState('selectedBreathingPattern')

  if (patternName === null) {
    return null
  }

  let pattern

  if (isRedirecting) {
    pattern = breathingPatterns.find(pattern => pattern.name === '3')
  } else {
    pattern = breathingPatterns.find(pattern => pattern.name === patternName)
  }

  try {
    if (pattern === undefined) {
      throw new Error(
        `${patternName} was not found in breathingPatterns ${JSON.stringify(
          pattern,
        )}`,
      )
    }
  } catch (e) {
    errorHandler(e as Error)
  }

  return pattern || breathingPatterns[0]
}
