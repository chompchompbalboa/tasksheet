//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { IAppState } from '@/state'
import { 
  ISheet, 
  ISheetFilter 
} from '@/state/sheet/types'
import { updateSheetFilter } from '@/state/sheet/actions'

import SheetActionDropdownSelectedOption from '@desktop/Sheet/SheetActionDropdownSelectedOption'

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
  
  const filterSheetColumn = allSheetColumns[filter.columnId]

  return (
    <SheetActionDropdownSelectedOption
      isLocked={filter.isLocked}
      onOptionUpdate={(updates) => dispatch(updateSheetFilter(sheetId, filter.id, updates))}
      onOptionDelete={() => handleDeleteSheetFilter(filter.id)}>
      <Container>
        {filter && filterSheetColumn
          ? filterSheetColumn.name + ' ' + filter.type + ' ' + filter.value
          : ''
        }
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
  white-space: nowrap;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetActionFilterExistingFilter