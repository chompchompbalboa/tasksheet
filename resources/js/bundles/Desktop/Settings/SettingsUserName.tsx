//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { mutation } from '@/api'

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
  const [ updateUserNameStatus, setUpdateUserNameStatus ] = useState('READY' as IUpdateUserNameStatus)

  // Update User Name
  const updateUserName = () => {
    if(userName !== localUserName) {
      setUpdateUserNameStatus('UPDATING')
      mutation.updateUser(userId, { name: localUserName })
        .then(() => {
          dispatch(updateUser({ name: localUserName }))
          setTimeout(() => {
            setUpdateUserNameStatus('UPDATED')
          }, 500)
          setTimeout(() => {
            setUpdateUserNameStatus('READY')
          }, 2500)
        })
        .catch(() => {
          setTimeout(() => {
            setLocalUserName(userName)
            setUpdateUserNameStatus('ERROR_UPDATING')
          }, 500)
          setTimeout(() => {
            setUpdateUserNameStatus('READY')
          }, 2500)
        })
    }
  }

  return (
    <SettingsLabelledInput
      label="Name:"
      onBlur={() => updateUserName()}
      onChange={nextUserName => setLocalUserName(nextUserName)}
      status={settingsUserNameStatusMessages[updateUserNameStatus]}
      statusColor={updateUserNameStatus === 'ERROR_UPDATING' ? 'rgb(200, 0, 0)' : 'black'}
      statusContainerTestId="SettingsUserNameStatusContainer"
      value={localUserName}
      width="30%"/>
  )
}

//-----------------------------------------------------------------------------
// Types
//-----------------------------------------------------------------------------
type IUpdateUserNameStatus = 
  'READY' |
  'UPDATING' |
  'UPDATED' |
  'ERROR_UPDATING'

//-----------------------------------------------------------------------------
// Status Messages
//-----------------------------------------------------------------------------
export const settingsUserNameStatusMessages = {
  READY: '',
  UPDATING: 'Saving...',
  UPDATED: "Saved!",
  ERROR_UPDATING: "Uh oh, there was a problem saving your name. Please try again."
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SettingsUserName
