//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionButtonDropdownItem = ({
  children,
  onClick
}: ISheetActionButtonDropdownItem) => (
  <Container
    onClick={onClick}>
    {children}
  </Container>
)

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface ISheetActionButtonDropdownItem {
  children?: any
  onClick?(...args: any): void
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  padding: 0.25rem 0.375rem 0.25rem 0.5rem;
  font-style: italic;
  font-size: inherit;
  color: inherit;
  &:hover {
    background-color: rgb(220, 220, 220);
  }
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetActionButtonDropdownItem
