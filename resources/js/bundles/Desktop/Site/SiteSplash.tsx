//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { IAppState } from '@/state'

import SiteLoginForm from '@desktop/Site/SiteLoginForm'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SiteSplash = ({
  isSiteSplashDocked
}: ISiteSplash) => {
  
  // Redux
  const userColorPrimary = useSelector((state: IAppState) => state.user.color.primary)

  return (
    <Container
      isSiteSplashDocked={isSiteSplashDocked}
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
        <Motto>Flexible and powerful, Tasksheet is the spreadsheet specifically built for task management</Motto>
        <Divider />
        <LoginContainer>
          <SiteLoginForm
            inputsMarginLeft="0.375rem"
            statusTextAlign="center"/>
        </LoginContainer>
      </Splash>
      <SpreadsheetIcon
        src={environment.assetUrl + 'images/spreadsheet.png'}/>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface ISiteSplash {
  isSiteSplashDocked: boolean
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  width: 100%;
  height: 100vh;
  background-color: ${ ({ userColorPrimary }: IContainer) => userColorPrimary };
  color: white;
  font-family: inherit;
  overflow: hidden;
  border-bottom: 1px solid rgb(150, 150, 150);
  box-shadow: ${ ({ isSiteSplashDocked }: IContainer) => isSiteSplashDocked ? 'none' : '0px 3px 20px 0px rgba(0,0,0,0.75)'};
`
interface IContainer {
  isSiteSplashDocked: boolean
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

const LoginContainer = styled.div`
  width: 40rem;
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
