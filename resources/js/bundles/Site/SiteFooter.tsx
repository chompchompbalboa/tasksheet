//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SiteFooter = () => {
  
  return (
    <Container>
      ©Tasksheet
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  padding: 3rem;
  font-size: 0.9rem;
  color: white;
  display: flex;
  align-items: center;
  @media (max-width: 480px) {
    padding: 1.25rem 1.5rem;
  }
`

export default SiteFooter
