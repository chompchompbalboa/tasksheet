//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { IAppState } from '@/state'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
export const MobileApp = () => {
  
  const userColorPrimary = useSelector((state: IAppState) => state.user.color.primary)
  return (
    <Container
      userColorPrimary={userColorPrimary}>
      MobileApp
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  background-color: ${ ({ userColorPrimary }: ContainerProps) => userColorPrimary };
`
interface ContainerProps {
  userColorPrimary: string
}

export default MobileApp
