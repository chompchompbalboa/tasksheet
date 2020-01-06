//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import moment from 'moment'

import { ISheetCellTypesSharedProps } from '@desktop/Sheet/SheetCell'

import { 
  createSheetCellChange,
  updateSheetCell,
  updateSheetCellValues
} from '@/state/sheet/actions'

import SheetCellContainer from '@desktop/Sheet/SheetCellContainer'
import SheetCellDatetimeDatepicker from '@desktop/Sheet/SheetCellDatetimeDatepicker'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
export const SheetCellDatetime = ({
  sheetId,
  cell,
  isCellInRange,
  isTrackCellChanges
}: ISheetCellTypesSharedProps) => {

  // Redux
  const dispatch = useDispatch()
  
  // State
  const [ sheetCellPreviousValue, setSheetCellPreviousValue ] = useState(null)

  // Begin Editing
  const beginEditing = (value: string = null) => {
    const nextSheetCellValue = value === null ? cell.value : value
    setSheetCellPreviousValue(cell.value)
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
    setTimeout(() => {          
      setSheetCellPreviousValue(null)
      const nextSheetCellValue = formatDate(cell.value)
      if(sheetCellPreviousValue !== nextSheetCellValue) {
        if(!isCellInRange) {
          dispatch(updateSheetCell(cell.id, { value: nextSheetCellValue }, { value: sheetCellPreviousValue }))
        }
        if(isTrackCellChanges) {
          dispatch(createSheetCellChange(sheetId, cell.id, nextSheetCellValue))
        }
      }
    }, 25)
  }
  
  // Handle Editing
  const handleEditing = (nextSheetCellValue: string) => {
    if(isCellInRange) {
      dispatch(updateSheetCellValues(sheetId, nextSheetCellValue))
    }
    else {
      dispatch(updateSheetCell(cell.id, { value: nextSheetCellValue }, null, true))
    }
  }

  return (
    <SheetCellContainer
      testId="SheetCellDatetime"
      sheetId={sheetId}
      cell={cell}
      beginEditing={beginEditing}
      completeEditing={completeEditing}
      value={cell.value}>
      <SheetCellDatetimeDatepicker
        sheetId={sheetId}
        dateValidator={dateValidator}
        handleEditing={handleEditing}
        value={cell.value}/>
    </SheetCellContainer>
  )
}

//-----------------------------------------------------------------------------
// Date functions
//-----------------------------------------------------------------------------
export const dateValidator = (date: any) => {
  return date
    && String(date).length > 5
    && moment(new Date(date)).isValid() 
    && ![0, 1, '0', '1', null].includes(date)
}

export const formatDate = (date: any) => {
  if(dateValidator(date)) {
    return moment(date).format('MM/DD/YYYY')
  }
  return date
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetCellDatetime
