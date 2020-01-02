//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { ChangeEvent, useEffect, useState } from 'react'
import moment from 'moment'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { formatDate } from '@desktop/Sheet/SheetCellDatetime'

import { ISheetCellTypesSharedProps } from '@mobile/Sheet/SheetCell'

import { updateSheetCell } from '@/state/sheet/actions'

import SheetCellContainer from '@mobile/Sheet/SheetCellContainer'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
export const SheetCellDatetime = ({
  cell
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
      const nextSheetCellValue = formatDate(cell.value)
      dispatch(updateSheetCell(cell.id, { value: nextSheetCellValue }))
    }
  }

  return (
    <SheetCellContainer>
      <StyledInput
        type="date"
        onBlur={handleInputBlur}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setCellValue(e.target.value)}
        value={cellValue ? moment(cellValue).format('YYYY-MM-DD') : ''}/>
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
