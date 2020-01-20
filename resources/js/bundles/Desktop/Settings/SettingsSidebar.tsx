//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'

import { ISettingsContent } from '@desktop/Settings/Settings'

import { USER } from '@/assets/icons'
 
import Logout from '@desktop/Settings/SettingsLogout'
import ContentSidebarItem from '@desktop/Content/ContentSidebarItem'

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
