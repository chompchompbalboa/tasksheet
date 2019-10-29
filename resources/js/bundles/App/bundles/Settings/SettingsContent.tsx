//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'

import { ISettingsContent } from '@app/bundles/Settings/Settings'

import SettingsBilling from '@app/bundles/Settings/SettingsBilling'
import SettingsUser from '@app/bundles/Settings/SettingsUser'
import SettingsTeams from '@app/bundles/Settings/SettingsTeams'
import SettingsColumnSettings from '@app/bundles/Settings/SettingsColumnSettings'

//-----------------------------------------------------------------------------
// Components
//-----------------------------------------------------------------------------
const SettingsContent = ({
  activeContent
}: SettingsContentProps) => {

  const content = {
    BILLING: SettingsBilling,
    COLUMN_SETTINGS: SettingsColumnSettings,
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
