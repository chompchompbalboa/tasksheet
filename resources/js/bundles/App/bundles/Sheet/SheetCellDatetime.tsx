//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useState } from 'react'
import moment from 'moment'

import { ISheetCell } from '@app/state/sheet/types'

import SheetCellContainer from '@app/bundles/Sheet/SheetCellContainer'
import SheetCellDatetimeDatepicker from '@app/bundles/Sheet/SheetCellDatetimeDatepicker'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
export const SheetCellDatetime = ({
  updateCellValue,
  value,
  ...passThroughProps
}: ISheetCellDatetimeProps) => {

  const [ localValue, setLocalValue ] = useState(value)
  const [ isInputEditing, setIsInputEditing ] = useState(false)

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

  const dateValidator = (date: any) => {
    return date
      && String(date).length > 5
      && moment(new Date(date)).isValid() 
      && ![0, 1, '0', '1', null].includes(date)
  }

  const formatDate = (date: any) => {
    return moment(new Date(date)).format('MM/DD/YYYY')
  }

  const handleUpdateCellValue = (nextCellValue: string) => {
    setLocalValue(nextCellValue)
  }

  return (
    <SheetCellContainer
      testId="SheetCellDatetime"
      focusCell={() => setIsInputEditing(true)}
      onCloseCell={() => setIsInputEditing(false)}
      value={localValue}
      {...passThroughProps}>
      <SheetCellDatetimeDatepicker
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
  isCellSelected: boolean
  updateCellValue(nextCellValue: string): void
  value: string
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetCellDatetime
