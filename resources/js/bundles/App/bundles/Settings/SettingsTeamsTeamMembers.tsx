//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'
import { ITeam } from '@app/state/team/types'

import SettingsList from '@app/bundles/Settings/SettingsList'
import SettingsTeamsTeamMembersAddMember from '@app/bundles/Settings/SettingsTeamsTeamMembersAddMember'
import SettingsTeamsTeamMembersMember from '@app/bundles/Settings/SettingsTeamsTeamMembersMember'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SettingsTeamMembers = ({
  team
}: ISettingsTeamMembers) => {

  return (
    <Container>
      <SettingsList
        name="Members:"
        width="100%">
        {team.members && team.members.map((member, index) => (
          <SettingsTeamsTeamMembersMember
            key={member.id}
            member={member}
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
