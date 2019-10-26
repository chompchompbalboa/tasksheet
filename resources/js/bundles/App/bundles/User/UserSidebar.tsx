//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'

import { IUserContent } from '@app/bundles/User/User'

import { BILLING, SETTINGS, USER } from '@app/assets/icons'
 
import UserLogout from '@app/bundles/User/UserLogout'
import ContentSidebarItem from '@app/bundles/Content/ContentSidebarItem'

//-----------------------------------------------------------------------------
// Components
//-----------------------------------------------------------------------------
const UserSidebar = ({
  activeContent,
  setActiveContent
}: IUserSidebar) => {
  return (
    <>
      <ContentSidebarItem
        icon={USER}
        isActive={activeContent === 'USER_PROFILE'}
        onClick={() => setActiveContent('USER_PROFILE')}
        text="Profile"/>
      <ContentSidebarItem
        icon={SETTINGS}
        isActive={activeContent === 'USER_SETTINGS'}
        onClick={() => setActiveContent('USER_SETTINGS')}
        text="Settings"/>
      <ContentSidebarItem
        icon={BILLING}
        isActive={activeContent === 'USER_BILLING'}
        onClick={() => setActiveContent('USER_BILLING')}
        text="Billing"/>
      <UserLogout />
    </>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface IUserSidebar {
  activeContent: IUserContent
  setActiveContent(nextActiveContent: IUserContent): void
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default UserSidebar
