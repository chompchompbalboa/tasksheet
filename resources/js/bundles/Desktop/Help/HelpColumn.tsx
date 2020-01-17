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
  containerAlignItems = 'center',
  containerWidth = '50%'
}: IHelpColumn) => {
  return (
    <Container
      containerAlignItems={containerAlignItems}
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
  containerAlignItems?: 'flex-start' | 'center'
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  width: ${ ({ containerWidth }: IContainer ) => containerWidth };
  padding: 1rem;
  display: flex;
  justify-content: flex-start;
  align-items: ${ ({ containerAlignItems }: IContainer ) => containerAlignItems };
`
interface IContainer {
  containerWidth: IHelpColumn['containerWidth']
  containerAlignItems: IHelpColumn['containerAlignItems']
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default HelpColumn
