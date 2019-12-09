//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { isEmail } from 'validator'

import { mutation } from '@app/api'

import { IAppState } from '@app/state'
import { ITeam, ITeamMember } from '@app/state/team/types'
import { updateTeam } from '@app/state/team/actions'

import AutosizeInput from 'react-input-autosize'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SettingsTeamsTeamMembersAddMember = ({
  team: {
    id: teamId,
    members: teamMemberIds
  }
}: ISettingsTeamsTeamMembersAddMember) => {
  
  const dispatch = useDispatch()
  const allTeamMembers = useSelector((state: IAppState) => state.teams.allTeamMembers)
  
  const [ status, setStatus ] = useState('READY' as IStatus)
  const [ addMemberEmailInputValue, setAddMemberEmailInputValue ] = useState(null)
  
  useEffect(() => {
    if(status === 'READY') { 
      addEventListener('keypress', handleKeyPressWhileInputVisible)
    }
    if([ 'EMAIL_IS_INVALID', 'MEMBER_IS_ALREADY_ON_TEAM' ].includes(status)) { 
      setTimeout(() => setStatus('READY'), 2000) 
    }
    return () => {
      removeEventListener('keypress', handleKeyPressWhileInputVisible)
    }
  }, [ status, addMemberEmailInputValue ])
  
  const handleAddMember = () => {
    if(!isEmail(addMemberEmailInputValue)) {
      setStatus('EMAIL_IS_INVALID')
    }
    else if (teamMemberIds.map(teamMemberId => allTeamMembers[teamMemberId].email).includes(addMemberEmailInputValue)) {
      setStatus('MEMBER_IS_ALREADY_ON_TEAM')
    }
    else {
      setStatus('CHECKING_IF_NEW_MEMBER_IS_VALID')
      mutation.createTeamMember(teamId, addMemberEmailInputValue).then(
        updatedTeam => {
          setTimeout(() => {
            setStatus('ADDED')
          }, 400)
          setTimeout(() => {
            setStatus('READY')
            setAddMemberEmailInputValue(null)
            dispatch(updateTeam(teamId, {
              members: updatedTeam.members.map((teamMember: ITeamMember) => teamMember.id)
            }))
          }, 1500)
        },
        () => {
          setTimeout(() => {
            setStatus('NEW_MEMBER_IS_INVALID')
          }, 300)
          setTimeout(() => {
            setStatus('READY')
          }, 2000)
        }
      )
    }
  }
  
  const handleKeyPressWhileInputVisible = (e: KeyboardEvent) => {
    if(e.key === 'Enter') {
      handleAddMember()
    }
  }
  
  const buttonMessages = {
    READY: 'Add',
    CHECKING_IF_NEW_MEMBER_IS_VALID: 'Adding...',
    EMAIL_IS_INVALID: 'That is not a valid email address',
    MEMBER_IS_ALREADY_ON_TEAM: 'That user is already on the team',
    NEW_MEMBER_IS_INVALID: 'That user does not exist',
    ADDED: 'Added!'
  }
  const buttonMessage = buttonMessages[status]
  
  return (
    <AddMemberContainer>
      <AutosizeInput
        placeholder="New Member's Email Address..."
        value={addMemberEmailInputValue || ''}
        onChange={e => setAddMemberEmailInputValue(e.target.value)}
        inputStyle={{
          marginRight: '1rem',
          padding: '0.125rem 0',
          height: '100%',
          border: 'none',
          backgroundColor: 'transparent',
          outline: 'none',
          fontFamily: 'inherit',
          fontSize: 'inherit',
          fontWeight: 'inherit'}}/>
      <AddMemberButton
        isError={['EMAIL_IS_INVALID', 'NEW_MEMBER_IS_INVALID', 'MEMBER_IS_ALREADY_ON_TEAM'].includes(status)}
        onClick={() => handleAddMember()}>
        {buttonMessage}
      </AddMemberButton>
    </AddMemberContainer>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
export interface ISettingsTeamsTeamMembersAddMember {
  team: ITeam
}

type IStatus = 'READY' 
  | 'CHECKING_IF_NEW_MEMBER_IS_VALID' 
  | 'EMAIL_IS_INVALID' 
  | 'NEW_MEMBER_IS_INVALID' 
  | 'ADDED'
  | 'MEMBER_IS_ALREADY_ON_TEAM'

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Button = styled.div`
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 7px;
  color: white;
  white-space: nowrap;
`

const AddMemberButton = styled(Button)`
  background-color: ${ ({ isError }: IAddMemberButton ) => isError ? 'rgb(150, 0, 0)' : 'rgb(0, 120, 0)' };
  &:hover {
    background-color: ${ ({ isError }: IAddMemberButton ) => isError ? 'rgb(180, 0, 0)' : 'rgb(0, 150, 0)' };
  }
`
interface IAddMemberButton {
  isError?: boolean
}

const AddMemberContainer = styled.div`
  width: 100%;
  padding: 0 0 0.375rem 0.25rem;
  border-bottom: 1px dashed rgb(200, 200, 200);
  display: flex;
  align-items: center;
`

export default SettingsTeamsTeamMembersAddMember
