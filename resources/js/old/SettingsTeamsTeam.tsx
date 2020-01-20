//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'

import { ITeam } from '@/state/team/types'

import SettingsGroup from '@desktop/Settings/SettingsGroup'
import SettingsTeamsTeamName from '@desktop/Settings/SettingsTeamsTeamName'
import SettingsTeamsTeamMembers from '@desktop/Settings/SettingsTeamsTeamMembers'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SettingsTeamsTeam = ({
  team
}: ISettingsTeamsTeam) => {
  return (
    <SettingsGroup
      header={team.name}>
      <SettingsTeamsTeamName
        team={team}/>
      <SettingsTeamsTeamMembers
        team={team}/>
    </SettingsGroup>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
export interface ISettingsTeamsTeam {
  team: ITeam
}

export default SettingsTeamsTeam
