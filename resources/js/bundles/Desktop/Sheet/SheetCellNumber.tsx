//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { ISheetCellTypesSharedProps } from '@desktop/Sheet/SheetCell'

import { 
  addSheetColumnAllCellValue,
  createSheetCellChange,
  updateSheet,
  updateSheetCell,
  updateSheetCellValues
} from '@/state/sheet/actions'

import SheetCellContainer from '@desktop/Sheet/SheetCellContainer'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetCellNumber = ({
  sheetId,
  columnId,
  cell,
  isCellInRange,
  isTrackCellChanges
}: ISheetCellTypesSharedProps) => {
  
  // Refs
  const input = useRef(null)

  // Redux
  const dispatch = useDispatch()
  
  // State
  const [ sheetCellPreviousValue, setSheetCellPreviousValue ] = useState(null)

  // Effects
  useEffect(() => {
    if(cell.isCellEditing && input && input.current) {
      input.current.focus()
    }
  })
  
  // Begin Editing
  const beginEditing = (value: string = null) => {
    const nextSheetCellValue = value === null ? cell.value : value
    setSheetCellPreviousValue(cell.value)
    dispatch(updateSheet(sheetId, { isCellEditing: true }, true))
    if(isCellInRange) {
      dispatch(updateSheetCell(cell.id, { isCellEditing: true }, null, true ))
      dispatch(updateSheetCellValues(sheetId, nextSheetCellValue))
    }
    else {
      dispatch(updateSheetCell(cell.id, { isCellEditing: true, value: nextSheetCellValue }, null, true ))
    }
  }
  
  // Complete Editing
  const completeEditing = () => {
    dispatch(updateSheetCell(cell.id, { isCellEditing: false }, null, true))
    dispatch(updateSheet(sheetId, { isCellEditing: false }, true))
    setTimeout(() => {          
      setSheetCellPreviousValue(null)
      if(cell.value !== sheetCellPreviousValue) {
        dispatch(addSheetColumnAllCellValue(columnId, cell.value))
        if(!isCellInRange) {
          dispatch(updateSheetCell(cell.id, { value: cell.value }, { value: sheetCellPreviousValue }))
        }
        if(isTrackCellChanges) {
          dispatch(createSheetCellChange(sheetId, cell.id, cell.value))
        }
      }
    }, 25)
  }
  
  // Handle Editing
  const handleEditing = (e: ChangeEvent<HTMLInputElement>) => {
    const nextSheetCellValue = e.target.value
    if(isCellInRange) {
      dispatch(updateSheetCellValues(sheetId, nextSheetCellValue))
    }
    else {
      dispatch(updateSheetCell(cell.id, { value: nextSheetCellValue }, null, true))
    }
  }
  
  return (
    <SheetCellContainer
      testId="SheetCellNumber"
      sheetId={sheetId}
      cell={cell}
      cellType='NUMBER'
      beginEditing={beginEditing}
      completeEditing={completeEditing}
      value={cell.value}>
      <StyledInput
        data-testid="SheetCellNumberInput"
        ref={input}
        onChange={handleEditing}
        value={cell.value || ''}/>
    </SheetCellContainer>
  )
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const StyledInput = styled.input`
  width: 100%;
  font-size: inherit;
  font-weight: inherit;
  font-family: inherit;
  letter-spacing: inherit;
  border: none;
  outline: none;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  -moz-appearance: textfield;
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetCellNumber
