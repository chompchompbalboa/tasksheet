//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { IAppState } from '@/state'

import History from '@desktop/History/History'
import Modals from '@desktop/Modal/Modals'
import Tabs from '@desktop/Tabs/Tabs'
import Site from '@desktop/Site/Site'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
export const Desktop = () => {

  const isDemoUser = useSelector((state: IAppState) => state.user.tasksheetSubscription.type === 'DEMO')
  const userColorPrimary = useSelector((state: IAppState) => state.user.color.primary)

  if(isDemoUser) {
    return (
      <Container
        containerBackgroundColor={userColorPrimary}>
        <Site/>
        <AppContainer>
          <AppContent>
            <History />
            <Modals />
            <Tabs />
          </AppContent>
        </AppContainer>
      </Container>
    )
  }
  return (
    <AppContainer>
      <AppContent>
        <History />
        <Modals />
        <Tabs />
      </AppContent>
    </AppContainer>
  )
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  background-color: ${ ({ containerBackgroundColor }: ContainerProps) => containerBackgroundColor };
`
interface ContainerProps {
  containerBackgroundColor: string
}

const AppContainer = styled.div`
  z-index: 100;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
`

const AppContent = styled.div`
	width: 100%;
  min-height: 100vh;
`

export default Desktop
