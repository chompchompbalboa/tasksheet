//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'

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
`
interface ContainerProps {
  isActiveTab: boolean
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default User
