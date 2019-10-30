//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { mutation } from '@app/api'

import { IAppState } from '@app/state'
import { ITeam, ITeamMember } from '@app/state/team/types'
import { updateTeam } from '@app/state/team/actions'

import SettingsListItem from '@app/bundles/Settings/SettingsListItem'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SettingsTeamsTeamMembersMember = ({
  member: {
    id: memberId,
    email: memberEmail,
    name: memberName,
  },
  team: {
    id: teamId,
    members: teamMembers
  }
}: ISettingsTeamsTeamMembersMember) => {
  
  const dispatch = useDispatch()
  
  const userId = useSelector((state: IAppState) => state.user.id)
  
  const [ deleteStatus, setDeleteStatus ] = useState('READY' as IDeleteStatus)
  const handleMemberDelete = () => {
    setDeleteStatus('DELETING')
    mutation.deleteTeamMember(teamId, memberId).then(
      () => {
        setTimeout(() => setDeleteStatus('DELETED'), 400)
        setTimeout(() => {
          dispatch(updateTeam(teamId, {
            members: teamMembers.filter(teamMember => teamMember.id !== memberId)
          }))
        }, 1500)
      },
      () => {}
    )
  }
  
  const deleteStatuses = {
    READY: 'Remove Member',
    DELETING: 'Removing...',
    DELETED: 'Removed'
  }

  return (
    <SettingsListItem>
      <Member>
        <MemberName><b>{memberName}</b> ({memberEmail})</MemberName>
        <MemberActions>
          <DeleteMemberFromTeam
            isActive={userId !== memberId}
            onClick={userId !== memberId ? () => handleMemberDelete() : () => null}>
            {deleteStatuses[deleteStatus]}
          </DeleteMemberFromTeam>
        </MemberActions>
      </Member>
    </SettingsListItem>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
export interface ISettingsTeamsTeamMembersMember {
  member: ITeamMember
  team: ITeam
}

type IDeleteStatus = 'READY' | 'DELETING' | 'DELETED'
            
//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Member = styled.div`
  cursor: default;
  padding: 0.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px dashed rgb(200, 200, 200);
  &:hover {
    background-color: rgb(235, 235, 235);
  }
`

const MemberName = styled.div``

const MemberActions = styled.div``

const DeleteMemberFromTeam = styled.div`
  cursor: ${ ({ isActive }: IDeleteMemberFromTeam ) => isActive ? 'pointer' : 'not-allowed' };
  padding: 0.25rem 0.5rem;
  border-radius: 7px;
  background-color: rgb(150, 0, 0);
  color: white;
  &:hover {
    background-color: rgb(180, 0, 0);
  }
`
interface IDeleteMemberFromTeam {
  isActive: boolean
}

export default SettingsTeamsTeamMembersMember
