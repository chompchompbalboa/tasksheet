//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useState } from 'react'
import styled from 'styled-components'

import { action } from '@app/api'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const UserLogout = ({
}: UserLogoutProps) => {

  const [ logoutStatus, setLogoutStatus ] = useState('READY')

  const handleClick = () => {
    setLogoutStatus('LOGGING_OUT')
    action.userLogout().then(
      success => {
        if(success) {
          window.location = window.location.href as any
        }
      },
      err => {
        console.log(err)
      }
    )
  }

  return (
    <Container
      onClick={() => handleClick()}>
      {logoutStatus === 'LOGGING_OUT' ? 'Logging Out...' : 'Logout'}
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface UserLogoutProps {
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  cursor: pointer;
  border-radius: 5px;
  padding: 0.75rem 0.5rem;
  &:hover {
    background-color: rgb(230, 230, 230);
  }
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default UserLogout
