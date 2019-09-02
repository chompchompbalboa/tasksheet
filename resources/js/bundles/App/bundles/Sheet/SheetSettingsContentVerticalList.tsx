//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'

//-----------------------------------------------------------------------------
// Components
//-----------------------------------------------------------------------------
const SheetSettingsContentColumn = ({
  children
}: SheetSettingsContentColumnProps) => (
  <Container>
    {children}
  </Container>
)

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetSettingsContentColumnProps {
  children?: any
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  height: 100%;
  width: 13rem;
  border-right: 1px solid rgb(220, 220, 220);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetSettingsContentColumn
