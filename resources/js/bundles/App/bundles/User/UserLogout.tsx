//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { action } from '@app/api'

import { AppState } from '@app/state'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const UserLogout = () => {

  // App state
  const userColorPrimary = useSelector((state: AppState) => state.user.color.primary)
  // Local state
  const [ logoutStatus, setLogoutStatus ] = useState('READY')

  // Handle logout button click
  const handleLogoutButtonClick = () => {
    setLogoutStatus('LOGGING_OUT')
    action.userLogout().then(
      success => { if(success) { window.location = window.location.href as any } },
      err => { console.log(err) }
    )
  }

  return (
    <Container>
      <LogoutButton
        logoutButtonBackgroundColor={userColorPrimary}
        onClick={() => handleLogoutButtonClick()}>
        {logoutStatus === 'LOGGING_OUT' ? 'Logging Out...' : 'Logout'}
      </LogoutButton>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`

const LogoutButton = styled.div`
  cursor: pointer;
  border-radius: 5px;
  padding: 0.5rem 1rem;
  background-color: rgb(210, 210, 210);
  color: rgb(100, 100, 100);
  &:hover {
    background-color: ${ ({ logoutButtonBackgroundColor }: ILogoutButton ) => logoutButtonBackgroundColor  };
    color: white;
  }
`
interface ILogoutButton {
  logoutButtonBackgroundColor: string
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default UserLogout
