//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'

import { ITeam } from '@app/state/team/types'

import SettingsGroup from '@app/bundles/Settings/SettingsGroup'
import SettingsTeamsTeamName from '@app/bundles/Settings/SettingsTeamsTeamName'
import SettingsTeamsTeamMembers from '@app/bundles/Settings/SettingsTeamsTeamMembers'

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
