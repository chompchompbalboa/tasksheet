//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { IAppState } from '@app/state'

import { updateUser } from '@app/state/user/actions'

import SettingsLabelledInput from '@app/bundles/Settings/SettingsLabelledInput'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const UserProfileName = () => {

  const dispatch = useDispatch()

  const userId = useSelector((state: IAppState) => state.user.id)
  const userName = useSelector((state: IAppState) => state.user.name)

  const [ localUserName, setLocalUserName ] = useState(userName)

  const updateUserName = () => {
    if(userName !== localUserName) {
      dispatch(updateUser(
        userId, 
        { name: localUserName },
        'USER_UPDATE_USER_NAME_ERROR'
      ))
    }
  }

  return (
    <SettingsLabelledInput
      label="Name:"
      onBlur={() => updateUserName()}
      onChange={nextUserName => setLocalUserName(nextUserName)}
      value={localUserName}
      width="20%"/>
  )
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default UserProfileName
