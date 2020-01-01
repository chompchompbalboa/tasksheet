//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { ISheetCellTypesSharedProps } from '@mobile/Sheet/SheetCell'

import { updateSheetCell } from '@/state/sheet/actions'

import SheetCellContainer from '@mobile/Sheet/SheetCellContainer'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
export const SheetCellString = ({
  cell
}: ISheetCellTypesSharedProps) => {

  // Redux
  const dispatch = useDispatch()
  
  // Handle Change
  const handleChange = (checked: boolean) => {
    const nextCellValue = checked ? 'Checked' : ''
    dispatch(updateSheetCell(cell.id, { value: nextCellValue }, { value: cell.value }))
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
const StyledInput = styled.input`
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
