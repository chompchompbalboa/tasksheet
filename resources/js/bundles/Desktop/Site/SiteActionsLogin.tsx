//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'

import SiteLoginForm from '@desktop/Site/SiteLoginForm'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SiteActionsLogin = () => {
  return (
    <Container>
      <SiteLoginForm
        flexDirection="column"
        isDisplayLabels/>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div``

export default SiteActionsLogin
