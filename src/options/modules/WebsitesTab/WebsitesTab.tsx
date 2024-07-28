import React from 'react'

import {SectionContainer, SectionHeading, TabHeading} from '@option-ui'

import {MindlessUrlList} from './MindlessUrlList'
import {MindlessIcon} from '@utils'
import {QuizCode} from '../SettingsTab/TextSettings'

export const WebsitesTab = () => {
  return (
    <div className="space-y-6 text-amber-50">
      <TabHeading>
        <MindlessIcon /> Manage Block List
      </TabHeading>

      <SectionContainer>
        <SectionHeading>Enter Quiz Code</SectionHeading>
        <QuizCode />
      </SectionContainer>

      <SectionContainer>
        <SectionHeading>
          Delete and manage items from your blocked sites list
        </SectionHeading>
        <MindlessUrlList />
      </SectionContainer>
    </div>
  )
}
