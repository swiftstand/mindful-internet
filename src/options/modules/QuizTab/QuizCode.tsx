import React from 'react'

import {SectionContainer, SectionHeading, TabHeading} from '@option-ui'

import {QuizIcon} from '@utils'
import {QuizCode} from '../SettingsTab/TextSettings'

export const QuizCodeTab = () => {
  return (
    <div className="space-y-6 text-amber-50">
      <TabHeading>
        <QuizIcon /> Set Your Unique Quiz Code
      </TabHeading>

      <SectionContainer>
        <SectionHeading>Enter Quiz Code</SectionHeading>
        <QuizCode />
      </SectionContainer>
    </div>
  )
}
