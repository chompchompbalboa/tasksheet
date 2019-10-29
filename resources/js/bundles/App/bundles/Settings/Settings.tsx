//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useState } from 'react'

import Content from '@app/bundles/Content/Content'
import SettingsContent from '@app/bundles/Settings/SettingsContent'
import SettingsSidebar from '@app/bundles/Settings/SettingsSidebar'

export type ISettingsContent = 
  'TEAMS' |
  'USER' |
  'BILLING' |
  'COLUMN_SETTINGS'
//-----------------------------------------------------------------------------
// Components
//-----------------------------------------------------------------------------
const Settings = () => {

  const [ activeContent, setActiveContent ] = useState('USER' as ISettingsContent)

  const headers = {
    BILLING: 'Billing',
    COLUMN_SETTINGS: 'Columns',
    TEAMS: 'Teams',
    USER: 'User',
  }
  const SettingsHeader = () => headers[activeContent]

  const SettingsSidebarComponent = () => (
    <SettingsSidebar
     activeContent={activeContent}
     setActiveContent={setActiveContent}/>
  )

  const SettingsContentComponent = () => (
    <SettingsContent
      activeContent={activeContent}/>
  )

  return (
    <Content
      Content={SettingsContentComponent}
      Header={SettingsHeader}
      Sidebar={SettingsSidebarComponent}/>
  )
}

export default Settings
