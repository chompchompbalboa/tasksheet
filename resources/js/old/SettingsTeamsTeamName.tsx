//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { ITeam } from '@/state/team/types'

import { updateTeam } from '@/state/team/actions'

import SettingsLabelledInput from '@desktop/Settings/SettingsLabelledInput'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SettingsTeamName = ({
  team: {
    id: teamId,
    name: teamName
  }
}: ISettingsTeamName) => {

  const dispatch = useDispatch()
  const [ localTeamName, setLocalTeamName ] = useState(teamName)

  const updateTeamName = () => {
    if(teamName !== localTeamName) {
      dispatch(updateTeam(
        teamId, 
        { name: localTeamName },
        'ORGANIZATION_UPDATE_ORGANIZATION_NAME_ERROR'
      ))
    }
  }

  return (
    <SettingsLabelledInput
      label="Name:"
      onBlur={() => updateTeamName()}
      onChange={nextTeamName => setLocalTeamName(nextTeamName)}
      value={localTeamName}
      width="20%"/>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
export interface ISettingsTeamName {
  team: ITeam
}

export default SettingsTeamName
