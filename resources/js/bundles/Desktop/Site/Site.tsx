//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { IAppState } from '@/state'

import SiteLoginForm from '@desktop/Site/SiteLoginForm'
import SiteRegisterForm from '@desktop/Site/SiteRegisterForm'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const Site = () => {
  
  // Redux
  const userColorPrimary = useSelector((state: IAppState) => state.user.color.primary)
  
  // State
  const [ isLoginFormDocked, setIsLoginFormDocked ] = useState(false)
  const [ isRegisterFormDocked, setIsRegisterFormDocked ] = useState(true)
  
  // Effects
  useEffect(() => {
    addEventListener('scroll', handleScroll)
    return () => removeEventListener('scroll', handleScroll)
  }, [])
  
  // Handle Scroll
  const handleScroll = () => {
    // If the site container is no longer visible, dock it to the top
    if(window.scrollY >= window.innerHeight) {
      setIsLoginFormDocked(true)
      removeEventListener('scroll', handleScroll)
    }
  }

  // Handle Call To Action Click
  const handleCallToActionClick = () => {
    setIsRegisterFormDocked(false)
  }
  

  return (
    <Container
      isLoginFormDocked={isLoginFormDocked}>
      <SiteSplash
        userColorPrimary={userColorPrimary}>
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
            <SiteLoginForm />
          </LoginRegisterContainer>
        </Splash>
        <SpreadsheetIcon
          src={environment.assetUrl + 'images/spreadsheet.png'}/>
      </SiteSplash>
      <CallToAction
        isLoginFormDocked={isLoginFormDocked}
        onClick={handleCallToActionClick}>
        Click here to sign up for a free 30-day trial
      </CallToAction>
      <RegisterFormContainer
        isRegisterFormDocked={isRegisterFormDocked}
        userColorPrimary={userColorPrimary}>
        <SiteRegisterForm />
      </RegisterFormContainer>
      <AppOverlay></AppOverlay>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  z-index: 1000;
  position: absolute;
  top: ${ ({ isLoginFormDocked }: IContainer) => isLoginFormDocked ? '-100vh' : '0' };
  left: 0;
  width: 100%;
  height: 100vh;
`
interface IContainer {
  isLoginFormDocked: boolean
}

const SiteSplash = styled.div`
  width: 100%;
  height: 100vh;
  background-color: ${ ({ userColorPrimary }: ISiteSplash) => userColorPrimary };
  color: white;
  font-family: inherit;
  overflow: hidden;
`
interface ISiteSplash {
  userColorPrimary: string
}

const SpreadsheetIcon = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.1;
`

const RegisterFormContainer = styled.div`
  z-index: 500;
  position: fixed;
  width: 25vw;
  height: 100vh;
  top: 0;
  left: ${ ({ isRegisterFormDocked }: IRegisterFormContainer) => isRegisterFormDocked ? '100vw' : '75vw' };
  transition: left 0.25s;
  background-color: ${ ({ userColorPrimary }: IRegisterFormContainer) => userColorPrimary };
`
interface IRegisterFormContainer {
  isRegisterFormDocked: boolean
  userColorPrimary: string
}

const CallToAction = styled.div`
  display: ${ ({ isLoginFormDocked }: ICallToAction) => isLoginFormDocked ? 'block' : 'none' };
  z-index: 500;
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
interface ICallToAction {
  isLoginFormDocked: boolean
}

const AppOverlay = styled.div`
  width: 100%;
  height: 100vh;
  background-color: transparent;
  pointer-events: none;
`

const Header = styled.div`
  z-index: 10;
  position: relative;
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
  z-index: 10;
  position: relative;
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



export default Site
