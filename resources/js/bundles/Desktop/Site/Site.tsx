//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import SiteActions from '@desktop/Site/SiteActions'
import SiteSplash from '@desktop/Site/SiteSplash'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const Site = () => {
  
  // State
  const [ isSiteSplashDocked, setIsSiteSplashDocked ] = useState(false)
  const [ isSiteActionsDocked, setIsSiteActionsDocked ] = useState(true)
  
  // Effects
  useEffect(() => {
    addEventListener('scroll', handleScroll)
    return () => removeEventListener('scroll', handleScroll)
  }, [])
  
  // Handle Scroll
  const handleScroll = () => {
    // If SiteSplash has scrolled out of the window, dock it to the top
    if(window.scrollY >= window.innerHeight) {
      setIsSiteSplashDocked(true)
      removeEventListener('scroll', handleScroll)
    }
  }

  // Handle Call To Action Click
  const handleCallToActionClick = () => {
    setIsSiteActionsDocked(false)
  }
  
  return (
    <Container
      isSiteSplashDocked={isSiteSplashDocked}>
      <SiteSplash
        isSiteSplashDocked={isSiteSplashDocked}/>
      <CallToAction
        isSiteSplashDocked={isSiteSplashDocked}
        onClick={handleCallToActionClick}>
        Click here to sign up for a free 30-day trial / Log in
      </CallToAction>
      <SiteActions
        dockSiteActions={() => setIsSiteActionsDocked(true)}
        isSiteActionsDocked={isSiteActionsDocked}/>
      <AppOverlay />
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  z-index: 1000;
  position: absolute;
  top: ${ ({ isSiteSplashDocked }: IContainer) => isSiteSplashDocked ? '-100vh' : '0' };
  left: 0;
  width: 100%;
  height: 100vh;
`
interface IContainer {
  isSiteSplashDocked: boolean
}

const CallToAction = styled.div`
  opacity: ${ ({ isSiteSplashDocked }: ICallToAction) => isSiteSplashDocked ? '1' : '0' };
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
  transition: opacity 0.25s;
  &:hover {
    text-decoration: underline;
  }
`
interface ICallToAction {
  isSiteSplashDocked: boolean
}

const AppOverlay = styled.div`
  width: 100%;
  height: 100vh;
  background-color: transparent;
  pointer-events: none;
`

export default Site
