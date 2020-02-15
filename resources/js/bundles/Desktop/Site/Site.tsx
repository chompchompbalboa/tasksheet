//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'

import SiteSplash from '@desktop/Site/SiteSplash'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const Site = () => {
  
  return (
    <Container
      data-testid="DesktopSite">
      <SiteSplash />
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
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
`

const AppOverlay = styled.div`
  width: 100%;
  height: 100vh;
  background-color: transparent;
  pointer-events: none;
`

export default Site
