//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'

import { Sheet, SheetColumns, SheetFilter, SheetFilterUpdates } from '@app/state/sheet/types'

import SheetActionDropdownSelectedOption from '@app/bundles/Sheet/SheetActionDropdownSelectedOption'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionFilterExistingFilter = ({
  columns,
  deleteSheetFilter,
  filter,
  updateSheetFilter
}: SheetActionFilterExistingFilterProps) => {
    
    return (
      <SheetActionDropdownSelectedOption
        isLocked={filter.isLocked}
        onOptionUpdate={(updates) => updateSheetFilter(filter.id, updates)}
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
  updateSheetFilter(filterId: SheetFilter['id'], updates: SheetFilterUpdates): void
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