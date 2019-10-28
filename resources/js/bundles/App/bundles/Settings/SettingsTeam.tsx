//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { IAppState } from '@app/state'

import ContentContent from '@app/bundles/Content/ContentContent'
import SettingsTeamName from '@app/bundles/Settings/SettingsTeamName'
import SettingsTeamMembers from '@app/bundles/Settings/SettingsTeamMembers'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SettingsTeam = () => {

  const teams = useSelector((state: IAppState) => state.teams)
  const teamIds = Object.keys(teams)
  
  const [ activeTeamId ] = useState(teamIds ? teamIds[0] : null)

  return (
    <ContentContent>
      {activeTeamId && 
        <TeamsContainer>
          <ActiveTeamName>
            {teams[activeTeamId].name}
          </ActiveTeamName>
          {teamIds.length > 1 && 
            <TeamsDropdown>
              {teamIds && teamIds.map(teamId => {
                const team = teams[teamId]
                return (
                  <TeamsDropdownOption
                    key={team.id}>
                    {team.name}
                  </TeamsDropdownOption>
                )
              })}
            </TeamsDropdown>
          }
          <ActiveTeam>
            <SettingsTeamName
              team={teams[activeTeamId]}/>
            <SettingsTeamMembers
              team={teams[activeTeamId]}/>
          </ActiveTeam>
        </TeamsContainer>
      }
    </ContentContent>
  )
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const TeamsContainer = styled.div``

const ActiveTeamName = styled.h2`
  padding: 0.125rem;
`

const TeamsDropdown = styled.div``

const TeamsDropdownOption = styled.div``

const ActiveTeam = styled.div`
  width: 100%;
  height: 100%;
  margin-top: 0.5rem;
`

export default SettingsTeam
