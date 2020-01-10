//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { IAppState } from '@/state'
import {
  updateActiveSiteForm,
  updateActiveSiteFormMessage
} from '@/state/active/actions'

import SiteLoginForm from '@desktop/Site/SiteLoginForm'
import SiteRegisterForm from '@desktop/Site/SiteRegisterForm'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SiteSplash = () => {
  
  // Redux
  const dispatch = useDispatch()
  const activeSiteSplashForm = useSelector((state: IAppState) => state.active.SITE_FORM)
  const activeSiteFormMessage = useSelector((state: IAppState) => state.active.SITE_FORM_MESSAGE)

  // Site Form Messaages
  const siteFormMessages = {
    ACCOUNT_NEEDED_TO_CREATE_SHEET: 
      <>
        You need to create an account or sign in to an existing account to create a new sheet.
        <br/>
        If you have an exisiting account, click here to login.
      </>,
    ACCOUNT_NEEDED_TO_UPLOAD_CSV: 
      <>
        You need to create an account or sign in to an existing account to upload a .csv file.
        <br/>
        If you have an exisiting account, click here to login.
      </>,
    CLICK_TO_LOGIN_INSTEAD: 'Click here to log in instead',
    CLICK_TO_REGISTER_INSTEAD: 'Click here to sign up for a 30-day free trial',
    ERROR_DURING_LOGIN: 
      <>
        We were unable to log you in.
        <br/>
        Please verify that you have correctly entered your email address and password and try again.
      </>,
    ERROR_DURING_REGISTRATION: 
      <>
        We were unable to create your account.
        <br/>
        Please verify that you have correctly entered your name, email address and password and try again.
      </>
  }
  
  const handleScroll = () => {
    console.log('handleSroll')
  }
  
  return (
    <Container
      onScroll={handleScroll}>
      <Header>
        <HeaderName>
          tasksheet
        </HeaderName>
        <HeaderLinks>
          <HeaderLink>30-day free trial<br/>$5 per month or $100 for lifetime access</HeaderLink>
        </HeaderLinks>
      </Header>
      <Splash>
        <Name>tasksheet</Name>
        <Motto>The spreadsheet that makes it easy to organize your to-dos</Motto>
        <Divider />
        <LoginRegisterContainer>
          {activeSiteSplashForm === 'REGISTER' &&
            <SiteRegisterForm />
          }
          {activeSiteSplashForm === 'LOGIN' &&
            <SiteLoginForm />
          }
        </LoginRegisterContainer>
        <CurrentStatus>
          <CurrentStatusLink
            onClick={activeSiteSplashForm === 'LOGIN' 
              ? () => {
                  dispatch(updateActiveSiteForm('REGISTER'))
                  dispatch(updateActiveSiteFormMessage('CLICK_TO_LOGIN_INSTEAD'))}
              : () => {
                  dispatch(updateActiveSiteForm('LOGIN'))
                  dispatch(updateActiveSiteFormMessage('CLICK_TO_REGISTER_INSTEAD'))}
              }>
            {siteFormMessages[activeSiteFormMessage]}
          </CurrentStatusLink>
        </CurrentStatus>
      </Splash>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  position: absolute;
  top: 100vh;
  z-index: 100;
	width: 100%;
	height: 100vh;
	display: flex;
  flex-direction: column;
  color: white;
  @media (max-width: 480px) {
    position: fixed;
    top: 0;
    left: 0;
  }
`

const Header = styled.div`
  width: 100%;
  padding: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media (max-width: 480px) {
    padding: 1rem;
    justify-content: flex-end;
  }
`

const HeaderName = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  @media (max-width: 480px) {
    display: none;
  }
`

const HeaderLinks = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
`

const HeaderLink = styled.div`
  font-size: 0.9rem;
  line-height: 1.3rem;
  text-align: right;
  white-space: nowrap;
`

const Splash = styled.div`
  margin-top: 2rem;
  height: calc(100% - 5.5rem);
	display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const Name = styled.div`
  font-size: 3rem;
  font-weight: bold;
  margin-top: 10%;
  margin-bottom: 0.625rem;
  display: flex;
  align-items: flex-start;
  @media (max-width: 480px) {
    margin-top: -10%;
  }
`

const Motto = styled.div`
  font-size: 1.125rem;
  width: 80%;
  text-align: center;
`

const CurrentStatus = styled.div`
  font-size: 0.85rem;
  line-height: 1.25rem;
  text-align: center;
`

const CurrentStatusLink = styled.span`
  cursor: pointer;
  transition: text-decoration 0.1s;
  text-align: center;
  &:hover {
    text-decoration: underline;
  }
  @media (max-width: 480px) {
    max-width: 90%;
  }
`

const LoginRegisterContainer = styled.div`
	display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
  @media (max-width: 480px) {
    width: 80%;
  }
`

const Divider = styled.div`
  margin: 2rem 0;
  width: 10rem;
  height: 1px;
  background-color: white;
`

export default SiteSplash
