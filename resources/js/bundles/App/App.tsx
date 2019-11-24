//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { IAppState } from '@app/state'

import History from '@app/bundles/History/History'
import Messenger from '@app/bundles/Messenger/Messenger'
import Modals from '@app/bundles/Modal/Modals'
import Tabs from '@app/bundles/Tabs/Tabs'
import SiteSplash from '@site/SiteSplash'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
export const App = () => {

  const isDemoUser = useSelector((state: IAppState) => state.user.isDemoUser)
  const userColorPrimary = useSelector((state: IAppState) => state.user.color.primary)

  if(isDemoUser) {
    return (
      <Container
        containerBackgroundColor={userColorPrimary}>
        <SiteContainer>
          <SiteContent>
            <SiteSplash/>
            <SpreadsheetIcon
              src={environment.assetUrl + 'images/spreadsheet.png'}/>
          </SiteContent>
        </SiteContainer>
        <AppContainer>
          <AppContent>
            <History />
            <Messenger />
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
        <Messenger />
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
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 200vh;
  background-color: ${ ({ containerBackgroundColor }: ContainerProps) => containerBackgroundColor };
`
interface ContainerProps {
  containerBackgroundColor: string
}

const SiteContainer = styled.div`
  z-index: 1000;
  position: absolute;
  width: 100%;
  height: 200vh;
  top: -100vh;
  left: 0;
  overflow: hidden;
  background-color: rgb(23, 50, 110);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
`

const SiteContent = styled.div`
  width: 100%;
  height: 100vh;
`

const SpreadsheetIcon = styled.img`
  position: absolute;
  top: 100vh;
  left: 0;
  width: 100%;
  opacity: 0.1;
  @media (max-width: 480px) {
    height: 100%;
    width: auto;
  }
`

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

export default App
