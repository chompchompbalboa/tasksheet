//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useState } from 'react'

import Content from '@desktop/Content/Content'
import SettingsContent from '@desktop/Settings/SettingsContent'
import SettingsSidebar from '@desktop/Settings/SettingsSidebar'

export type ISettingsContent = 'USER'
//-----------------------------------------------------------------------------
// Components
//-----------------------------------------------------------------------------
const Settings = () => {

  const [ activeContent, setActiveContent ] = useState('USER' as ISettingsContent)

  const headers = {
    USER: 'User'
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
