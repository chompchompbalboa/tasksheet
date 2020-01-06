//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import moment from 'moment'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { formatDate } from '@desktop/Sheet/SheetCellDatetime'

import { ISheetCellTypesSharedProps } from '@mobile/Sheet/SheetCell'

import { 
  addSheetColumnAllCellValue,
  createSheetCellChange,
  updateSheetCell 
} from '@/state/sheet/actions'

import SheetCellContainer from '@mobile/Sheet/SheetCellContainer'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
export const SheetCellDatetime = ({
  sheetId,
  columnId,
  cell,
  isTrackCellChanges
}: ISheetCellTypesSharedProps) => {

  // Redux
  const dispatch = useDispatch()

  // Handle Input Change
  const handleInputChange = (nextValue: string) => {
    const nextSheetCellValue = formatDate(nextValue)
    if(cell.value !== nextSheetCellValue) {
      dispatch(addSheetColumnAllCellValue(columnId, nextSheetCellValue))
      dispatch(updateSheetCell(cell.id, { value: nextSheetCellValue }))
      if(isTrackCellChanges) {
        dispatch(createSheetCellChange(sheetId, cell.id, nextSheetCellValue))
      }
    }
    dispatch(updateSheetCell(cell.id, { value: nextSheetCellValue }))
  }

  return (
    <SheetCellContainer>
      <StyledInput
        type="date"
        onChange={e => handleInputChange(e.target.value)}
        value={cell.value ? moment(cell.value).format('YYYY-MM-DD') : ''}/>
    </SheetCellContainer>
  )
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const StyledInput = styled.input`
  height: 100%;
  font-size: inherit;
  font-weight: inherit;
  font-family: inherit;
  color: inherit;
  letter-spacing: inherit;
  border: none;
  outline: none;
  background-color: transparent;
  text-align: right;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetCellDatetime
