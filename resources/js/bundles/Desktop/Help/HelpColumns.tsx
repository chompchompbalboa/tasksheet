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
  containerAlignItems = 'center',
  containerWidth = '100%'
}: IHelpColumns) => {
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
interface IHelpColumns {
  children?: any
  containerWidth?: string
  containerAlignItems?: 'flex-start' | 'center'
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  width: ${ ({ containerWidth }: IContainer ) => containerWidth };
  display: flex;
  justify-content: flex-start;
  align-items: ${ ({ containerAlignItems }: IContainer ) => containerAlignItems };
`
interface IContainer {
  containerWidth: IHelpColumns['containerWidth']
  containerAlignItems: IHelpColumns['containerAlignItems']
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default HelpColumns
