//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'

import { ISettingsContent } from '@app/bundles/Settings/Settings'

import { USER, TEAM } from '@app/assets/icons'
 
import Logout from '@app/bundles/Settings/SettingsLogout'
import ContentSidebarItem from '@app/bundles/Content/ContentSidebarItem'

//-----------------------------------------------------------------------------
// Components
//-----------------------------------------------------------------------------
const SettingsSidebar = ({
  activeContent,
  setActiveContent
}: ISettingsSidebar) => {
  return (
    <>
      <ContentSidebarItem
        icon={USER}
        isActive={activeContent === 'USER'}
        onClick={() => setActiveContent('USER')}
        text="User"/>
      <ContentSidebarItem
        icon={TEAM}
        isActive={activeContent === 'TEAMS'}
        onClick={() => setActiveContent('TEAMS')}
        text="Teams"/>
      <Logout />
    </>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface ISettingsSidebar {
  activeContent: ISettingsContent
  setActiveContent(nextActiveContent: ISettingsContent): void
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SettingsSidebar
