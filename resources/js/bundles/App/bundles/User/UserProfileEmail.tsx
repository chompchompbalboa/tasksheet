//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { IAppState } from '@app/state'

import { updateUser } from '@app/state/user/actions'

import ContentLabelledInput from '@app/bundles/Content/ContentLabelledInput'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const UserProfileEmail = () => {

  const dispatch = useDispatch()

  const userId = useSelector((state: IAppState) => state.user.id)
  const userEmail = useSelector((state: IAppState) => state.user.email)

  const [ localUserEmail, setLocalUserEmail ] = useState(userEmail)

  const updateUserEmail = () => {
    dispatch(updateUser(
      userId, 
      { email: localUserEmail },
      'USER_UPDATE_USER_EMAIL_SUCCESS',
      'USER_UPDATE_USER_EMAIL_ERROR'
    ))
  }

  return (
    <ContentLabelledInput
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
