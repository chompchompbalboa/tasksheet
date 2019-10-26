//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useState } from 'react'

import Content from '@app/bundles/Content/Content'
import UserContent from '@app/bundles/User/UserContent'
import UserSidebar from '@app/bundles/User/UserSidebar'

export type IUserContent = 'USER_PROFILE' | 'USER_SETTINGS' | 'USER_BILLING'
//-----------------------------------------------------------------------------
// Components
//-----------------------------------------------------------------------------
const User = () => {

  const [ activeContent, setActiveContent ] = useState('USER_PROFILE' as IUserContent)

  const headers = {
    USER_BILLING: 'Billing',
    USER_PROFILE: 'Profile',
    USER_SETTINGS: 'Settings',
  }
  const UserHeader = () => headers[activeContent]

  const UserSidebarComponent = () => (
    <UserSidebar
     activeContent={activeContent}
     setActiveContent={setActiveContent}/>
  )

  const UserContentComponent = () => (
    <UserContent
      activeContent={activeContent}/>
  )

  return (
    <Content
      Content={UserContentComponent}
      Header={UserHeader}
      Sidebar={UserSidebarComponent}/>
  )
}

export default User
