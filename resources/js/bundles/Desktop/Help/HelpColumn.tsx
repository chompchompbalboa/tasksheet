//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const HelpColumn = ({
  children,
  containerWidth = '50%'
}: IHelpColumn) => {
  return (
    <Container
      containerWidth={containerWidth}>
      {children}
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface IHelpColumn {
  children?: any
  containerWidth?: string
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  width: ${ ({ containerWidth }: IContainer ) => containerWidth };
  padding: 1rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`
interface IContainer {
  containerWidth: IHelpColumn['containerWidth']
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default HelpColumn
