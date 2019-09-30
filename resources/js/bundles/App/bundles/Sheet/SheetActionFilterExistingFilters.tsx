//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { IAppState } from '@app/state'
import { 
  ISheet, 
  ISheetFilter 
} from '@app/state/sheet/types'
import { updateSheetFilter } from '@app/state/sheet/actions'

import SheetActionDropdownSelectedOption from '@app/bundles/Sheet/SheetActionDropdownSelectedOption'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionFilterExistingFilter = ({
  sheetId,
  handleDeleteSheetFilter,
  filter
}: ISheetActionFilterExistingFilterProps) => {

  // Redux
  const dispatch = useDispatch()

  const allSheetColumns = useSelector((state: IAppState) => state.sheet.allSheetColumns)

  return (
    <SheetActionDropdownSelectedOption
      isLocked={filter.isLocked}
      onOptionUpdate={(updates) => dispatch(updateSheetFilter(sheetId, filter.id, updates))}
      onOptionDelete={() => handleDeleteSheetFilter(filter.id)}>
      <Container>
        {allSheetColumns[filter.columnId].name} {filter.type} {filter.value}
      </Container>
    </SheetActionDropdownSelectedOption>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface ISheetActionFilterExistingFilterProps {
  sheetId: ISheet['id']
  handleDeleteSheetFilter(filterId: ISheetFilter['id']): void
  filter: ISheetFilter
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