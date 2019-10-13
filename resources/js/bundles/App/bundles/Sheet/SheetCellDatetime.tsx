//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useState } from 'react'
import moment from 'moment'

import { ISheetCell, ISheetColumnType } from '@app/state/sheet/types'

import SheetCellString from '@app/bundles/Sheet/SheetCellString'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
export const SheetCellDatetime = ({
  updateCellValue,
  value,
  ...passThroughProps
}: ISheetCellDatetimeProps) => {

  const [ localValue, setLocalValue ] = useState(value)

  useEffect(() => {
    setLocalValue(value)
  }, [ value ])

  useEffect(() => {
    let updateCellValueTimer: number = null
    if(value !== localValue) {
      clearTimeout(updateCellValueTimer)
      updateCellValueTimer = setTimeout(() => {
        const nextCellValue = isValidDate(localValue) ? formatDate(localValue) : localValue
        updateCellValue(nextCellValue)
      }, 1000)
    }
    return () => clearTimeout(updateCellValueTimer);
  }, [ localValue ])

  const isValidDate = (date: any) => {
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
    <SheetCellString
      testId="SheetCellDatetime"
      value={localValue}
      updateCellValue={nextCellValue => handleUpdateCellValue(nextCellValue)}
      {...passThroughProps}/>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
export interface ISheetCellDatetimeProps {
  sheetId: string
  cell: ISheetCell
  cellId: string
  columnType: ISheetColumnType
  isCellSelected: boolean
  updateCellValue(nextCellValue: string): void
  value: string
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetCellDatetime
