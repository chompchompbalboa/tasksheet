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
const UserProfileName = () => {

  const dispatch = useDispatch()

  const userId = useSelector((state: IAppState) => state.user.id)
  const userName = useSelector((state: IAppState) => state.user.name)

  const [ localUserName, setLocalUserName ] = useState(userName)

  return (
    <ContentLabelledInput
      label="Name:"
      onBlur={() => dispatch(updateUser(userId, { name: localUserName }))}
      onChange={nextUserName => setLocalUserName(nextUserName)}
      value={localUserName}/>
  )
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default UserProfileName
