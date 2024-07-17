import React, {useEffect, useState} from 'react'
import {Breathing} from './Breathing'
import {CompleteBreathing} from './CompleteBreathing'
import {CopyQuote} from './CopyQuote'
import {
  Logo,
  useBreathingPattern,
  useNumberOfBreath,
  useSyncedState,
} from '@utils'
import browser from 'webextension-polyfill'
import {motion} from 'framer-motion'
import {QuoteWhileBreathing} from './QuoteWhileBreathing'
import {useQuote} from './useQuote'
import { QUIZ_HOST } from '@utils'

type Step =
  | 'breathing'
  | 'completeBreathing'
  | 'copyQuote'
  | 'breathingWithQuote'
  | 'notInitialized'

const useCurrentStep = () => {
  const [showQuoteWhileBreathing] = useSyncedState('showQuoteWhileBreathing')
  const [currentStep, setCurrentStep] = useState<Step>('notInitialized')

  useEffect(() => {
    if (showQuoteWhileBreathing) {
      setCurrentStep('breathingWithQuote')
    } else {
      setCurrentStep('breathing')
    }
  }, [showQuoteWhileBreathing])

  return [currentStep, setCurrentStep] as const
}

const Stop = () => {
  const numberOfBreath = useNumberOfBreath()
  const isCopyQuote = useIsCopyQuote()
  const quote = useQuote()
  const [currentStep, setCurrentStep] = useCurrentStep()
  const breathingPattern = useBreathingPattern(true)
  const [deniedUrl, setDeniedUrl] = useState<string | null | undefined>('')
  const [codeValue] = useSyncedState('quizCode')

  const getCurrentTabUrl = async () => {
    try {
      const tabs = await browser.tabs.query({active: true, currentWindow: true})
      if (tabs.length > 0) {
        const url = new URL(tabs[0].url || '')
        const queryParams = Object.fromEntries(url.searchParams.entries())
        return {param: queryParams.url, main: url}
      }
      return null
    } catch (error) {
      console.error('Error getting current tab URL:', error)
      return null
    }
  }

  useEffect(() => {
    getCurrentTabUrl().then(blockedUrl => {
      console.log('stopped= ', blockedUrl?.main)
      setDeniedUrl(blockedUrl?.param || '')
    })
  }, [])

  if (currentStep === 'notInitialized' || quote === 'notInitialized') {
    return null
  }

  return (
    <motion.div
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      transition={{duration: 1.5}}
      className="grid h-full place-content-center overflow-hidden bg-gradient-to-tl from-mui-blue-dark to-mui-blue text-amber-50"
    >
      <div className="absolute left-5 top-5">
        <div className="  flex items-center">
          <Logo />

          <div className="p-2  font-bold">
            Mindful <br /> <span className="text-mui-gold">Internet Use</span>
          </div>
        </div>
      </div>
      {(() => {
        switch (currentStep) {
          case 'breathing':
          case 'breathingWithQuote':
            return (
              <div>
                {currentStep === 'breathingWithQuote' && (
                  <QuoteWhileBreathing quote={quote} />
                )}

                {numberOfBreath && breathingPattern ? (
                  <Breathing
                    breathingPattern={breathingPattern}
                    numberOfBreath={1}
                    onComplete={() => {
                      const redirectUrl = `${QUIZ_HOST}/quiz?endpoint=${
                        deniedUrl || 'null'
                      }&code=${codeValue || 'null'}`
                      if (breathingPattern.name === '3') {
                        browser.tabs.update({
                          url: redirectUrl,
                        })
                      }
                      setCurrentStep(
                        isCopyQuote ? 'copyQuote' : 'completeBreathing',
                      )
                    }}
                  />
                ) : null}
              </div>
            )
          case 'completeBreathing':
            return <CompleteBreathing quote={quote} />
          case 'copyQuote':
            return <CopyQuote quote={quote} />
          default:
            throwUnhandledStopStep(currentStep)
        }
      })()}
    </motion.div>
  )
}

const throwUnhandledStopStep = (currentStep: never): never => {
  throw new Error(`'${JSON.stringify(currentStep)}' is not a valid step`)
}

const useIsCopyQuote = () => {
  const [isCopy] = useSyncedState('copy')

  return isCopy
}

export default Stop
