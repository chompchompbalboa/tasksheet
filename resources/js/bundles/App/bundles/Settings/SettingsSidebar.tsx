//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'

import { ISettingsContent } from '@app/bundles/Settings/Settings'

import { SHEET_COLUMN, USER, ORGANIZATION } from '@app/assets/icons'
 
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
        icon={ORGANIZATION}
        isActive={activeContent === 'ORGANIZATION'}
        onClick={() => setActiveContent('ORGANIZATION')}
        text="Organizations"/>
      <ContentSidebarItem
        icon={SHEET_COLUMN}
        isActive={activeContent === 'COLUMN_SETTINGS'}
        onClick={() => setActiveContent('COLUMN_SETTINGS')}
        text="Column Settings"/>
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
