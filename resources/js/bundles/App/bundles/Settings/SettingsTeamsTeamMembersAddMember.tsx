//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useState } from 'react'
import styled from 'styled-components'

import { ITeam } from '@app/state/team/types'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SettingsTeamsTeamMembersAddMember = ({
}: ISettingsTeamsTeamMembersAddMember) => {
  
  const [ isMemberBeingAdded, setIsMemberBeingAdded ] = useState(false)

  return (
    <Container>
      {isMemberBeingAdded
        ? <AddMember>
            Adding New Member...
          </AddMember>
        : <AddMember
            onClick={() => setIsMemberBeingAdded(true)}>
            Add New Member...
          </AddMember>
      }
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
export interface ISettingsTeamsTeamMembersAddMember {
  team: ITeam
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div``

const AddMember = styled.div`
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 5px;
  background-color: rgb(0, 120, 0);
  color: white;
  &:hover {
    background-color: rgb(0, 150, 0);
  }
`

export default SettingsTeamsTeamMembersAddMember
