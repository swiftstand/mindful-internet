import dayjs from 'dayjs'
import {
  syncQuotes,
  filterSubStrings,
  isSubStringInArray,
  findSubString,
} from '../utilities/utilities'
import browser from 'webextension-polyfill'
import {MiuStorage, TempAccess} from '@types'
import {DefaultQuoteWithoutShow} from '../../allQuotes'
import {BackgroundState} from '../index'
import {errorHandler} from '@ui'
import {QUIZ_HOST} from '@utils'

export const syncTempAccess = (tempAccess: TempAccess[]): TempAccess[] => {
  const updated = tempAccess.filter(
    temp => dayjs().diff(dayjs(temp.firstAccess), 'minutes') <= temp.time,
  )

  if (updated.length < tempAccess.length) {
    browser.storage.sync.set({tempAccess: updated})
  }
  return updated
}

export const reloadIfStopPage = async () => {
  try {
    const tabs = await browser.tabs.query({
      active: true,
      lastFocusedWindow: true,
    })

    if (!(tabs && tabs[0] && tabs[0].url)) {
      return
    }

    const {url} = tabs[0]

    const isStopPage = url.includes(browser.runtime.getURL('/stop.html'))
    if (isStopPage) {
      browser.tabs.update(tabs[0].id, {url})
    }
  } catch (e) {
    errorHandler(e as Error, {extra: 'functionName: reloadIfStopPage'})
  }
}

export const syncStorage = async (
  rawQuotes: DefaultQuoteWithoutShow[],
  callback: () => void,
) => {
  const {
    numBreath = 4,
    userQuotes = [],
    dangerList = [],
    defaultQuotes = null,
    tempAccess = [],
    copy = false,
    isMIUEnabled = true,
    selectedBreathingPattern = '424',
    showQuoteWhileBreathing = false,
    maxAccessTime = 120,
  } = (await browser.storage.sync.get([
    'defaultQuotes',
    'copy',
    'dangerList',
    'tempAccess',
    'userQuotes',
    'selectedBreathingPattern',
    'isMIUEnabled',
    'numBreath',
    'showQuoteWhileBreathing',
    'maxAccessTime',
  ])) as MiuStorage
  await browser.storage.sync.set({
    numBreath,
    userQuotes,
    dangerList,
    defaultQuotes: syncQuotes(rawQuotes, defaultQuotes),
    tempAccess,
    selectedBreathingPattern,
    copy,
    isMIUEnabled,
    showQuoteWhileBreathing,
    maxAccessTime,
  })

  callback()
}

export const isMindless = (
  url: string,
  mindlessURLs: string[],
  tempAccessURLs: string[],
  state: BackgroundState,
) => {
  if (/^chrome-extension:/.test(url) || !mindlessURLs) {
    return
  }

  const regexPattern = `^(${QUIZ_HOST.replace(
    /[-/\\^$*+?.()|[\]{}]/g,
    '\\$&',
  )})`

  const regexwithParamPattern = `^${QUIZ_HOST.replace(
    /[-/\\^$*+?.()|[\]{}]/g,
    '\\$&',
  )}.*[?&]passed=([^&]*)`

  const patternHostRegex = new RegExp(regexwithParamPattern)

  const match = url.match(patternHostRegex)
  console.log('extension = ', match)

  if (match) {
    // Extract and return the parameter value
    const passedValue = decodeURIComponent(match[1])
    browser.tabs.update({
      url: passedValue,
    })
    return false
  }

  const quizHostRegex = new RegExp(regexPattern)
  if (quizHostRegex.test(url)) {
    return
  }

  const isMindless = isSubStringInArray(url, mindlessURLs)

  const longestMatch = filterSubStrings(state.dangerList, url).reduce(
    (a, b) => (a.length > b.length ? a : b),
    '',
  )
  const tempAccessPattern = findSubString(tempAccessURLs, longestMatch)

  if (!isMindless) return

  if (!(tempAccessPattern && tempAccessPattern.length <= longestMatch.length)) {
    return longestMatch
  }
}

type StorageChanges<S extends Partial<MiuStorage>> = {
  [storageKey in keyof S]: {
    newValue: S[storageKey]
    oldValue: S[storageKey]
  }
}

export const handleStorageChange = (
  changes: StorageChanges<MiuStorage>,
  currentState: BackgroundState,
) => {
  if (changes.isMIUEnabled) {
    currentState.isMIUEnabled = changes.isMIUEnabled.newValue
  }

  if (changes.dangerList) {
    currentState.dangerList = changes.dangerList.newValue
  }
  if (changes.tempAccess) {
    currentState.tempAccess = changes.tempAccess.newValue
  }
}

const makeUrlAccessible = async (time: number, urlString: string) => {
  const blockUrl = new URL(urlString)
  // const blockUrl = currentUrl.searchParams.get('url')!
  const blockPattern = blockUrl.hostname //currentUrl.searchParams.get('pattern')!

  // @ts-ignore
  const {tempAccess} = (await browser.storage.sync.get(['tempAccess'])) as {
    tempAccess: TempAccess[]
  }

  console.log({tempAccess})

  const updatedTempAccess = tempAccess.filter(
    access => access.blockPattern !== blockPattern,
  )
  console.log({updatedTempAccess})

  updatedTempAccess.push({blockPattern, firstAccess: dayjs().format(), time})

  await browser.storage.sync.set({tempAccess: updatedTempAccess})
  window.location.replace(blockUrl)
}

export const handlePageLoad = (
  {url, tabId}: {url: string; tabId: number},
  currentState: BackgroundState,
) => {
  const tempAccessURLs = currentState.tempAccess
    ? currentState.tempAccess.map(temp => temp.blockPattern)
    : []
  const mindlessURLs = currentState.dangerList || []
  const pattern = isMindless(url, mindlessURLs, tempAccessURLs, currentState)
  const stopUrl = browser.runtime.getURL('/stop.html')
  const isStopPage = url.includes(stopUrl)

  if (isStopPage) {
    reloadIfStopPage()
  }

  if (pattern && currentState.isMIUEnabled) {
    browser.tabs.update(tabId, {
      url: browser.runtime.getURL(`stop.html?url=${url}&pattern=${pattern}`),
    })
  } else {
    const paramUrl = new URL(url)
    const queryParams = Object.fromEntries(paramUrl.searchParams.entries())

    if (pattern === false) {
      makeUrlAccessible(60, queryParams.passed) // make accessible for 60 minutes
    }
    console.log('pp = ', pattern, queryParams.passed)
  }
}
