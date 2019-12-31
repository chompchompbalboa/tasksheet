//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionTooltip = ({
  children,
  isTooltipVisible
}: SheetActionTooltipProps) => {

  return (
    <Container
      isTooltipVisible={isTooltipVisible}>
      {children}
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetActionTooltipProps {
  children?: any
  isTooltipVisible: boolean
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  cursor: default;
  display: ${ ({ isTooltipVisible }: IContainer) => isTooltipVisible ? 'block' : 'none' };
  position: absolute;
  left: -1px;
  top: 100%;
  padding: 0.25rem;
  background-color: rgb(250, 250, 250);
  border: 1px solid rgb(200, 200, 200);
  border-radius: 3px;
  box-shadow: 2px 2px 15px 0px rgba(0,0,0,0.3);
  white-space: nowrap;
`
interface IContainer {
  isTooltipVisible: boolean
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetActionTooltip
