//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'

import ContentContent from '@app/bundles/Content/ContentContent'
import SettingsGroup from '@app/bundles/Settings/SettingsGroup'
import SettingsUserEmail from '@app/bundles/Settings/SettingsUserEmail'
import SettingsUserName from '@app/bundles/Settings/SettingsUserName'
import SettingsUserSubscription from '@app/bundles/Settings/SettingsUserSubscription'

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
        header="Billing">
        <SettingsUserSubscription />
      </SettingsGroup>
    </ContentContent>
  )
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SettingsUser
