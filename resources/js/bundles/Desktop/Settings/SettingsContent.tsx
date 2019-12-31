//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'

import { ISettingsContent } from '@desktop/Settings/Settings'

import SettingsBilling from '@desktop/Settings/SettingsBilling'
import SettingsUser from '@desktop/Settings/SettingsUser'
import SettingsTeams from '@desktop/Settings/SettingsTeams'

//-----------------------------------------------------------------------------
// Components
//-----------------------------------------------------------------------------
const SettingsContent = ({
  activeContent
}: SettingsContentProps) => {

  const content = {
    BILLING: SettingsBilling,
    TEAMS: SettingsTeams,
    USER: SettingsUser,
  }

  const ContentComponent = activeContent ? content[activeContent] : null

  return <ContentComponent />
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SettingsContentProps {
  activeContent: ISettingsContent
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SettingsContent
