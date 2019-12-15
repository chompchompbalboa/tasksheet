//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useState } from 'react'

import { action } from '@app/api'
import { LOGOUT } from '@app/assets/icons'

import ContentSidebarItem from '@app/bundles/Content/ContentSidebarItem'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const UserLogout = () => {

  const [ isLoggingOut, setIsLoggingOut ] = useState(false)

  const handleLogoutButtonClick = () => {
    setIsLoggingOut(true)
    action.userLogout().then(
      success => { if(success) { window.location = window.location.href as any } },
      err => {
        setIsLoggingOut(false)
       }
    )
  }

  return (
    <ContentSidebarItem
      icon={LOGOUT}
      isActive={false}
      onClick={() => handleLogoutButtonClick()}
      text={isLoggingOut ? "Logging Out..." : "Logout"}/>
  )
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default UserLogout
