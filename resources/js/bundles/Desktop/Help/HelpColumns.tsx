//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const HelpColumns = ({
  children,
  containerWidth = '100%'
}: IHelpColumns) => {
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
interface IHelpColumns {
  children?: any
  containerWidth?: string
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  width: ${ ({ containerWidth }: IContainer ) => containerWidth };
  display: flex;
  justify-content: flex-start;
  align-items: center;
`
interface IContainer {
  containerWidth: IHelpColumns['containerWidth']
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default HelpColumns
