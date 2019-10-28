//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'

import ContentContent from '@app/bundles/Content/ContentContent'
import SettingsUserEmail from '@app/bundles/Settings/SettingsUserEmail'
import SettingsUserName from '@app/bundles/Settings/SettingsUserName'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SettingsUser = () => {

  return (
    <ContentContent>
      <SettingsUserName />
      <SettingsUserEmail />
    </ContentContent>
  )
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SettingsUser
