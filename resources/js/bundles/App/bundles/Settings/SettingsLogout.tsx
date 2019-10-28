//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'

import { action } from '@app/api'
import { LOGOUT } from '@app/assets/icons'

import ContentSidebarItem from '@app/bundles/Content/ContentSidebarItem'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const UserLogout = () => {

  const handleLogoutButtonClick = () => {
    action.userLogout().then(
      success => { if(success) { window.location = window.location.href as any } },
      err => { console.log(err) }
    )
  }

  return (
    <ContentSidebarItem
      icon={LOGOUT}
      isActive={false}
      onClick={() => handleLogoutButtonClick()}
      text="Logout"/>
  )
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default UserLogout
