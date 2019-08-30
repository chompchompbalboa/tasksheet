//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'

import SettingsUserColor from '@app/bundles/Settings/SettingsUserColor'
import UserLogout from '@app/bundles/User/UserLogout'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const User = ({
  isActiveTab
}: SheetProps) => {
  return (
    <Container
      isActiveTab={isActiveTab}>
      <UserLogout />
      <SettingsUserColor />
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetProps {
  isActiveTab: boolean
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  display: ${ ({ isActiveTab }: ContainerProps) => isActiveTab ? 'block' : 'none' };
  position: relative;
  width: 100%;
  height: 100%;
  padding: 1.5rem;
`
interface ContainerProps {
  isActiveTab: boolean
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default User
