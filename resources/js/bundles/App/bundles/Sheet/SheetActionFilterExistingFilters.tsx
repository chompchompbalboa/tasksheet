//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'

import { Sheet, SheetColumns, SheetFilter } from '@app/state/sheet/types'

import SheetActionDropdownSelectedOption from '@app/bundles/Sheet/SheetActionDropdownSelectedOption'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionFilterExistingFilter = ({
  columns,
  deleteSheetFilter,
  filter,
  sheetId
}: SheetActionFilterExistingFilterProps) => {
    
    return (
      <SheetActionDropdownSelectedOption
        onOptionDelete={() => deleteSheetFilter(filter.id)}>
        <Container>
          {columns[filter.columnId].name} {filter.type} {filter.value}
        </Container>
      </SheetActionDropdownSelectedOption>
    )
  }

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetActionFilterExistingFilterProps {
  columns: SheetColumns
  deleteSheetFilter(filterId: SheetFilter['id']): void
  filter: SheetFilter
  sheetId: Sheet['id']
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  display: flex;
  align-items: center;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetActionFilterExistingFilter