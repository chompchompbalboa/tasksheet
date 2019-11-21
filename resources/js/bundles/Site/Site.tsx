//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import { action } from '@app/api'

import SiteDemo from '@site/SiteDemo'
import SiteSplash from '@site/SiteSplash'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const Site = () => {
  
  const [ isLoginOrRegister, setIsLoginOrRegister ] = useState('REGISTER' as 'LOGIN' | 'REGISTER')

  // Log a guest user out when they leave the page
  useEffect(() => {
    window.addEventListener('beforeunload', () => {
      action.userLogout()
    })
    return () => action.userLogout()
  }, [])
  
  return (
    <Container>
      <SiteContainer>
        <SiteSplash
          isLoginOrRegister={isLoginOrRegister}
          setIsLoginOrRegister={setIsLoginOrRegister}/>
        <SpreadsheetIcon
          src={environment.assetUrl + 'images/spreadsheet.png'}/>
      </SiteContainer>
      <DemoContainer>
        <SiteDemo />
      </DemoContainer>
    </Container>
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
`

const SiteContainer = styled.div`
  z-index: 1000;
  position: absolute;
  width: 100%;
  height: 100vh;
  top: 0;
  left: 0;
  overflow: hidden;
  background-color: rgba(52, 12, 107, 1);
`

const SpreadsheetIcon = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  opacity: 0.1;
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url('/images/spreadsheet.png');
  @media (max-width: 480px) {
    height: 100%;
    width: auto;
  }
`

const DemoContainer = styled.div`
  z-index: 100;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
`

export default Site
