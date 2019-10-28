//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'
import { ITeam } from '@app/state/team/types'

import { TRASH_CAN } from '@app/assets/icons'

import Icon from '@/components/Icon'
import SettingsList from '@app/bundles/Settings/SettingsList'
import SettingsListItem from '@app/bundles/Settings/SettingsListItem'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SettingsTeamMembers = ({
  team
}: ISettingsTeamMembers) => {

  return (
    <Container>
      <SettingsList
        name="Members"
        width="30%">
        {team.members && team.members.map((member, index) => (
          <SettingsListItem
            key={member.id}>
            <Member
              isFirst={index === 0}>
              <MemberName>{member.name}</MemberName>
              <MemberActions>
                <DeleteMemberFromTeam>
                  <Icon
                    icon={TRASH_CAN}
                    size="0.8rem"/>
                </DeleteMemberFromTeam>
            </MemberActions>
            </Member>
          </SettingsListItem>
        ))}
        <AddMember>
          Add Member...
        </AddMember>
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

const Member = styled.div`
  cursor: default;
  padding: 0.25rem 0.125rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: ${ ({ isFirst }: IMember ) => isFirst ? '1px dashed rgb(200, 200, 200)' : 'none' };
  border-bottom: 1px dashed rgb(200, 200, 200);
  &:hover {
    background-color: rgb(225, 225, 225);
  }
`
interface IMember {
  isFirst: boolean
}

const MemberName = styled.div``

const MemberActions = styled.div``

const DeleteMemberFromTeam = styled.div`
  cursor: pointer;
  opacity: 0.8;
  &:hover {
    opacity: 1;
  }
`

const AddMember = styled.div`
  cursor: pointer;
  padding: 0.25rem 0.125rem;
  border-bottom: 1px dashed rgb(200, 200, 200);
  &:hover {
    background-color: rgb(225, 225, 225);
  }
`

export default SettingsTeamMembers
