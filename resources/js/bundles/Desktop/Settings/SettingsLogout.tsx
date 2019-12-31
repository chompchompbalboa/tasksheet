//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useState } from 'react'

import { action } from '@/api'
import { LOGOUT } from '@/assets/icons'

import ContentSidebarItem from '@desktop/Content/ContentSidebarItem'

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
