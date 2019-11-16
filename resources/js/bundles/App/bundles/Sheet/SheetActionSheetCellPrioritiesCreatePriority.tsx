//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionSheetCellPrioritiesCreatePriority = ({
  sheetId
}: ISheetActionSheetCellPrioritiesCreatePriority) => {

  return (
    <Container>
      Create Priority
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface ISheetActionSheetCellPrioritiesCreatePriority {
  sheetId: string
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetActionSheetCellPrioritiesCreatePriority
