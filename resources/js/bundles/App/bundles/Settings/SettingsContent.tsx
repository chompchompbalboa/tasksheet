//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'

import { ISettingsContent } from '@app/bundles/Settings/Settings'

import SettingsBilling from '@app/bundles/Settings/SettingsBilling'
import SettingsUser from '@app/bundles/Settings/SettingsUser'
import SettingsTeams from '@app/bundles/Settings/SettingsTeams'

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
