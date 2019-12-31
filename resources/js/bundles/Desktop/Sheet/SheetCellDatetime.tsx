//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useState } from 'react'
import moment from 'moment'

import { ISheetCell } from '@/state/sheet/types'

import SheetCellContainer from '@desktop/Sheet/SheetCellContainer'
import SheetCellDatetimeDatepicker from '@desktop/Sheet/SheetCellDatetimeDatepicker'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
export const SheetCellDatetime = ({
  sheetId,
  updateCellValue,
  value,
  ...passThroughProps
}: ISheetCellDatetimeProps) => {

  // State
  const [ localValue, setLocalValue ] = useState(value)
  const [ isInputEditing, setIsInputEditing ] = useState(false)

  // Effects
  useEffect(() => {
    setLocalValue(value)
  }, [ value ])

  useEffect(() => {
    if(value !== localValue && !isInputEditing) {
      const isLocalValueValidDate = dateValidator(localValue)
      const nextCellValue = isLocalValueValidDate ? formatDate(localValue) : localValue
      updateCellValue(nextCellValue)
    }
  }, [ isInputEditing, localValue ])

  // Date Validator
  const dateValidator = (date: any) => {
    return date
      && String(date).length > 5
      && moment(new Date(date)).isValid() 
      && ![0, 1, '0', '1', null].includes(date)
  }

  // Format the date
  const formatDate = (date: any) => {
    return moment(new Date(date)).format('MM/DD/YYYY')
  }

  // Handle Update Cell Value
  const handleUpdateCellValue = (nextCellValue: string) => {
    setLocalValue(nextCellValue)
  }

  return (
    <SheetCellContainer
      testId="SheetCellDatetime"
      sheetId={sheetId}
      focusCell={() => setIsInputEditing(true)}
      onCloseCell={() => setIsInputEditing(false)}
      value={localValue}
      {...passThroughProps}>
      <SheetCellDatetimeDatepicker
        sheetId={sheetId}
        dateValidator={dateValidator}
        updateCellValue={handleUpdateCellValue}
        value={localValue}/>
    </SheetCellContainer>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
export interface ISheetCellDatetimeProps {
  sheetId: string
  cell: ISheetCell
  cellId: string
  isCellInRange: boolean
  isCellSelected: boolean
  updateCellValue(nextCellValue: string): void
  value: string
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetCellDatetime
