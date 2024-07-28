import React from 'react'
import {NavItem} from './NavItem'
import {SettingsIcon} from '@utils'
// QuotesIcon SettingsIcon MindlessIcon
export interface NavListProps {
  activeTab: 'websites' | 'quotes' | 'settings'
  onChange: (value: NavListProps['activeTab']) => void
}

export const NavList = ({onChange, activeTab}: NavListProps) => {
  return (
    <nav>
      <ul>
        <NavItem
          onClick={() => onChange('websites')}
          active={activeTab === 'websites'}
        >
          <SettingsIcon />
          Options
        </NavItem>
        {/* <NavItem
          onClick={() => onChange('quotes')}
          active={activeTab === 'quotes'}
        >
          <QuotesIcon />
          Motivational quotes
        </NavItem> */}
        {/* <NavItem
          onClick={() => onChange('settings')}
          active={activeTab === 'settings'}
        >
          <SettingsIcon />
          Settings
        </NavItem> */}
      </ul>
    </nav>
  )
}
