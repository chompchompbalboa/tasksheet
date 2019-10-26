//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'

import ContentContent from '@app/bundles/Content/ContentContent'
import UserProfileEmail from '@app/bundles/User/UserProfileEmail'
import UserProfileName from '@app/bundles/User/UserProfileName'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const UserProfile = () => {

  return (
    <ContentContent>
      <UserProfileName />
      <UserProfileEmail />
    </ContentContent>
  )
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default UserProfile
