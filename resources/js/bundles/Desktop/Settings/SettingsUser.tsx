//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'

import ContentContent from '@desktop/Content/ContentContent'
import SettingsGroup from '@desktop/Settings/SettingsGroup'
import SettingsUserEmail from '@desktop/Settings/SettingsUserEmail'
import SettingsUserName from '@desktop/Settings/SettingsUserName'
import SettingsUserSubscription from '@desktop/Settings/SettingsUserSubscription'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SettingsUser = () => {

  return (
    <ContentContent>
      <SettingsGroup
        header="Profile">
        <SettingsUserName />
        <SettingsUserEmail />
      </SettingsGroup>
      <SettingsGroup
        header="Subscription">
        <SettingsUserSubscription />
      </SettingsGroup>
    </ContentContent>
  )
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SettingsUser
