//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useSelector } from 'react-redux'

import { IAppState } from '@app/state'

import ContentContent from '@app/bundles/Content/ContentContent'
import SettingsTeamsTeam from '@app/bundles/Settings/SettingsTeamsTeam'
//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SettingsTeams = () => {

  const allTeams = useSelector((state: IAppState) => state.teams.allTeams)
  const allTeamIds = Object.keys(allTeams)

  return (
    <ContentContent>
      {allTeamIds.map(teamId => (
        <SettingsTeamsTeam
          key={teamId}
          team={allTeams[teamId]}/>
      ))}
    </ContentContent>
  )
}

export default SettingsTeams
