//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetRowLeader = ({ 
  isHeader = false
}: SheetRowLeaderProps) => (
  <Container
    isHeader={isHeader}>
      &nbsp;
  </Container>
)

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
type SheetRowLeaderProps = {
  isHeader?: boolean
}
//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.td`
  position: sticky;
  top: ${ ({ isHeader }: ContainerProps) => isHeader ? '2rem' : 'auto'};
  width: 2rem;
  padding: 0.15rem 0 0.15rem 0.25rem;
  background-color: ${ ({ isHeader }: ContainerProps) => isHeader ? 'white' : 'transparent'};
  border: ${ ({ isHeader }: ContainerProps) => isHeader ? 'none' : '0.5px dashed black'};
  border-bottom: ${ ({ isHeader }: ContainerProps) => isHeader ? 'none' : '0.5px dashed black'};
  border-left: none;
  box-shadow: ${ ({ isHeader }: ContainerProps) => isHeader ? '0px 1px 0px 0px rgba(0,0,0,1)' : 'none'};
`
interface ContainerProps {
  isHeader: boolean
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetRowLeader
