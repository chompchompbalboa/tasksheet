//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'

import { IUserContent } from '@app/bundles/User/User'

import UserBilling from '@app/bundles/User/UserBilling'
import UserProfile from '@app/bundles/User/UserProfile'
import UserSettings from '@app/bundles/User/UserSettings'

//-----------------------------------------------------------------------------
// Components
//-----------------------------------------------------------------------------
const UserContent = ({
  activeContent
}: UserContentProps) => {

  const content = {
    USER_BILLING: UserBilling,
    USER_PROFILE: UserProfile,
    USER_SETTINGS: UserSettings,
  }

  const ContentComponent = activeContent ? content[activeContent] : null

  return <ContentComponent />
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface UserContentProps {
  activeContent: IUserContent
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default UserContent
