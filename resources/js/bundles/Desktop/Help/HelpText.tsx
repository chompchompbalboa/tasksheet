//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const HelpText = ({
  containerMarginBottom = '0.75rem',
  children,
  header
}: IHelpText) => {
  return (
    <Container
      containerMarginBottom={containerMarginBottom}>
      {header && 
        <Header>{header}</Header>
      }
      <Text>
        {children}
      </Text>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface IHelpText {
  containerMarginBottom?: string
  children: any
  header?: string
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  max-width: 50rem;
  margin-bottom: ${ ({ containerMarginBottom }: IContainer ) => containerMarginBottom };
`
interface IContainer {
  containerMarginBottom: IHelpText['containerMarginBottom']
}

const Header = styled.h2`
  margin-bottom: 0.5rem;
`

const Text = styled.div`
  font-size: 0.9rem;
  letter-spacing: normal;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default HelpText
