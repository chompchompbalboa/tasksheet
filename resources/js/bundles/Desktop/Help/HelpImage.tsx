//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const HelpImage = ({
  containerMarginBottom = '0.75rem',
  containerWidth = '100%',
  src,
}: IHelpImage) => {
  return (
    <Container
      containerMarginBottom={containerMarginBottom}
      containerWidth={containerWidth}>
      <StyledImage
        src={src}/>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface IHelpImage {
  containerMarginBottom?: string
  containerWidth?: string
  src: string
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  width: ${ ({ containerWidth }: IContainer ) => containerWidth };
  margin-bottom: 0.75rem;
  margin-bottom: ${ ({ containerMarginBottom }: IContainer ) => containerMarginBottom };
  display: flex;
  justify-content: flex-start;
  align-items: center;
`
interface IContainer {
  containerMarginBottom: IHelpImage['containerMarginBottom']
  containerWidth: IHelpImage['containerWidth']
}

const StyledImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 5px;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default HelpImage
