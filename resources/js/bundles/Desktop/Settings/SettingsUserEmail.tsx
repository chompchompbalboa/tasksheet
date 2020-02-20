//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useSelector } from 'react-redux'

import { IAppState } from '@/state'

import SettingsLabelledInput from '@desktop/Settings/SettingsLabelledInput'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const UserProfileEmail = () => {

  // Redux
  const userEmail = useSelector((state: IAppState) => state.user.email)

  return (
    <SettingsLabelledInput
      disabled
      label="Email:"
      onBlur={null}
      onChange={null}
      value={userEmail}
      width="30%"/>
  )
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default UserProfileEmail
