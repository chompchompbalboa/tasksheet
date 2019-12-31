//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { IAppState } from '@/state'
import {
  updateActiveSiteSplashForm,
  updateActiveSiteSplashFormMessage
} from '@/state/active/actions'

import History from '@desktop/History/History'
import Modals from '@desktop/Modal/Modals'
import Tabs from '@desktop/Tabs/Tabs'
import SiteSplash from '@desktop/Site/SiteSplash'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
export const App = () => {

  const dispatch = useDispatch()
  const isDemoUser = useSelector((state: IAppState) => state.user.tasksheetSubscription.type === 'DEMO')
  const userColorPrimary = useSelector((state: IAppState) => state.user.color.primary)

  const handleDemoUserCallToActionClick = () => {
    dispatch(updateActiveSiteSplashForm('REGISTER'))
    dispatch(updateActiveSiteSplashFormMessage('CLICK_TO_LOGIN_INSTEAD'))
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth'})
  }

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
            <DemoUserCallToAction
              onClick={() => handleDemoUserCallToActionClick()}>
              Click here to sign up for a free 30-day trial
            </DemoUserCallToAction>
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

const DemoUserCallToAction = styled.div`
  z-index: 10000;
  cursor: pointer;
  position: fixed;
  top: 0;
  right: 0;
  padding-top: 0.25rem;
  padding-right: 0.5rem;
  color: white;
  font-size: 0.75rem;
  font-style: italic;
  &:hover {
    text-decoration: underline;
  }
`

export default App
