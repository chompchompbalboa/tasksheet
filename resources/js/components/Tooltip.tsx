//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const Tooltip = ({
  children,
  isVisible
}: ITooltip) => {

  return (
    <Container
      data-testid="Tooltip"
      isVisible={isVisible}>
      {children}
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
export interface ITooltip {
  children: any
  isVisible: boolean
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  cursor: default;
  display: ${ ({ isVisible }: IContainer) => isVisible ? 'block' : 'none' };
  position: absolute;
  left: -1px;
  top: 100%;
  padding: 0.25rem;
  background-color: rgb(250, 250, 250);
  border: 1px solid rgb(175, 175, 175);
  border-radius: 3px;
  box-shadow: 2px 2px 15px 0px rgba(0,0,0,0.3);
  white-space: nowrap;
`
interface IContainer {
  isVisible: boolean
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default Tooltip
