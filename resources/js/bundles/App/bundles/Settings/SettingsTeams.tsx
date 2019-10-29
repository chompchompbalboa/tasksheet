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

  const teams = useSelector((state: IAppState) => state.teams)
  const teamIds = Object.keys(teams)

  return (
    <ContentContent>
      {teamIds.map(teamId => (
        <SettingsTeamsTeam
          key={teamId}
          team={teams[teamId]}/>
      ))}
    </ContentContent>
  )
}

export default SettingsTeams
