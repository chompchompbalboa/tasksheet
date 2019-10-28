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
const UserProfileEmail = () => {

  const dispatch = useDispatch()

  const userId = useSelector((state: IAppState) => state.user.id)
  const userEmail = useSelector((state: IAppState) => state.user.email)

  const [ localUserEmail, setLocalUserEmail ] = useState(userEmail)

  const updateUserEmail = () => {
    if(userEmail !== localUserEmail) {
      dispatch(updateUser(
        userId, 
        { email: localUserEmail },
        'USER_UPDATE_USER_EMAIL_ERROR'
      ))
    }
  }

  return (
    <SettingsLabelledInput
      label="Email:"
      onBlur={() => updateUserEmail()}
      onChange={nextUserEmail => setLocalUserEmail(nextUserEmail)}
      value={localUserEmail}/>
  )
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default UserProfileEmail
