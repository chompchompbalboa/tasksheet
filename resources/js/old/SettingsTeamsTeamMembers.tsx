//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { IAppState } from '@/state'
import { ITeam } from '@/state/team/types'

import SettingsList from '@desktop/Settings/SettingsList'
import SettingsTeamsTeamMembersAddMember from '@desktop/Settings/SettingsTeamsTeamMembersAddMember'
import SettingsTeamsTeamMembersMember from '@desktop/Settings/SettingsTeamsTeamMembersMember'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SettingsTeamMembers = ({
  team
}: ISettingsTeamMembers) => {

  const allTeamMembers = useSelector((state: IAppState) => state.teams.allTeamMembers)

  return (
    <Container>
      <SettingsList
        name="Members:"
        width="100%">
        {team.members && team.members.map(teamMemberId => (
          <SettingsTeamsTeamMembersMember
            key={teamMemberId}
            member={allTeamMembers[teamMemberId]}
            team={team}/>
        ))}
        <ActionsContainer>
          <SettingsTeamsTeamMembersAddMember
            team={team}/>
        </ActionsContainer>
      </SettingsList>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
export interface ISettingsTeamMembers {
  team: ITeam
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div``

const ActionsContainer = styled.div`
  display: flex;
  padding: 0.5rem 0 0.25rem 0;
  border-top: 1px dashed rgb(200, 200, 200);
`

export default SettingsTeamMembers
