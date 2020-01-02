//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
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

  // Handle Input Blur
  const handleInputChange = (nextValue: string) => {
    const nextSheetCellValue = formatDate(nextValue)
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
