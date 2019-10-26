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

  return (
    <ContentLabelledInput
      label="Email:"
      onBlur={() => dispatch(updateUser(userId, { email: localUserEmail }))}
      onChange={nextUserEmail => setLocalUserEmail(nextUserEmail)}
      value={localUserEmail}/>
  )
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default UserProfileEmail
