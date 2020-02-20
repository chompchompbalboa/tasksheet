//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { IAppState } from '@/state'

import { updateUser } from '@/state/user/actions'

import SettingsLabelledInput from '@desktop/Settings/SettingsLabelledInput'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SettingsUserName = () => {

  // Redux
  const dispatch = useDispatch()
  const userId = useSelector((state: IAppState) => state.user.id)
  const userName = useSelector((state: IAppState) => state.user.name)

  // State
  const [ localUserName, setLocalUserName ] = useState(userName)

  // Update User Name
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
      width="30%"/>
  )
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SettingsUserName
