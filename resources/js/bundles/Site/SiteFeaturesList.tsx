//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SiteFeaturesList = ({
  children,
  header
}: ISiteFeaturesList) => (
  <Container>
    <Header>{header}</Header>
    <ListItems>{children}</ListItems>
  </Container>
)

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
export interface ISiteFeaturesList {
  children?: any
  header: string
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div``

const Header = styled.h1`
  font-size: 1.375rem;
  @media (max-width: 480px) {
    text-align: center;
  }
`

const ListItems = styled.div`
  padding: 1rem 0;
  @media (max-width: 480px) {
    text-align: justify;
  }
`

export default SiteFeaturesList
