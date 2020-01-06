//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { ChangeEvent, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

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
export const SheetCellString = ({
  sheetId,
  columnId,
  cell,
  isTrackCellChanges
}: ISheetCellTypesSharedProps) => {

  // Redux
  const dispatch = useDispatch()

  // State
  const [ cellValue, setCellValue ] = useState(cell ? cell.value : '')

  // Effects
  useEffect(() => {
    setCellValue(cell.value)
  }, [ cell.value ])

  // Handle Input Blur
  const handleInputBlur = () => {
    if(cell.value !== cellValue) {
      dispatch(updateSheetCell(cell.id, { value: cellValue }))
      dispatch(addSheetColumnAllCellValue(columnId, cellValue))
      if(isTrackCellChanges) {
        dispatch(createSheetCellChange(sheetId, cell.id, cellValue))
      }
    }
  }

  return (
    <SheetCellContainer>
      <StyledInput
        onBlur={handleInputBlur}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setCellValue(e.target.value)}
        value={cellValue || ''}/>
    </SheetCellContainer>
  )
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const StyledInput = styled.input`
  width: 100%;
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
export default SheetCellString
