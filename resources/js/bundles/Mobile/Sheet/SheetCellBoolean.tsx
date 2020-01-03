//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { ISheetCellTypesSharedProps } from '@mobile/Sheet/SheetCell'

import { 
  createSheetCellChange,
  updateSheetCell 
} from '@/state/sheet/actions'

import SheetCellContainer from '@mobile/Sheet/SheetCellContainer'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
export const SheetCellBoolean = ({
  sheetId,
  cell,
  isTrackCellChanges
}: ISheetCellTypesSharedProps) => {

  // Redux
  const dispatch = useDispatch()
  
  // Handle Change
  const handleChange = (checked: boolean) => {
    const nextCellValue = checked ? 'Checked' : 'Unchecked'
    dispatch(updateSheetCell(cell.id, { value: nextCellValue }, { value: cell.value }))
    if(isTrackCellChanges) {
      dispatch(createSheetCellChange(sheetId, cell.id, nextCellValue))
    }
  }

  return (
    <SheetCellContainer>
      <StyledInput 
        type="checkbox"
        checked={cell.value === 'Checked'}
        onChange={(e) => handleChange(e.target.checked)}/>
    </SheetCellContainer>
  )
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const StyledInput = styled.input``

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetCellBoolean
