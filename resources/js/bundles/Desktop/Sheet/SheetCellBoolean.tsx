//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { ISheetCell } from '@/state/sheet/types'
import {
  updateSheetCell
} from '@/state/sheet/actions'

import SheetCellContainer from '@desktop/Sheet/SheetCellContainer'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetCellBoolean = ({
  cellId,
  value,
  ...passThroughProps
}: SheetCellBooleanProps) => {
  
  const dispatch = useDispatch()
  
  const handleChange = (checked: boolean) => {
    const nextCellValue = checked ? 'Checked' : ''
    dispatch(updateSheetCell(cellId, { value: nextCellValue }, { value: value }))
  }
  
  return (
    <SheetCellContainer
      testId="SheetCellBoolean"
      cellId={cellId}
      onlyRenderChildren
      value={value}
      {...passThroughProps}>
      <Container>
        <StyledInput 
          type="checkbox"
          checked={value && value === 'Checked'}
          onChange={(e) => handleChange(e.target.checked)}/>
      </Container>
    </SheetCellContainer>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetCellBooleanProps {
  sheetId: string
  cell: ISheetCell
  cellId: string
  isCellInRange: boolean
  isCellSelected: boolean
  updateCellValue(nextCellValue: string): void
  value: string
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const StyledInput = styled.input`
  margin: auto;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetCellBoolean
