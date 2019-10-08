//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { ISheetCell, ISheetColumnType } from '@app/state/sheet/types'
import {
  updateSheetSelectionFromArrowKey as updateSheetSelectionFromArrowKeyAction
} from '@app/state/sheet/actions'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetCellBoolean = ({
  sheetId,
  cellId,
  isCellSelected,
  updateCellValue,
  value
}: SheetCellBooleanProps) => {

  const dispatch = useDispatch()
  const updateSheetSelectionFromArrowKey = useCallback((cellId, moveSelectedCellDirection) => dispatch(updateSheetSelectionFromArrowKeyAction(sheetId, cellId, moveSelectedCellDirection)), [])
  
  useEffect(() => {
    if(isCellSelected) {
      window.addEventListener('keydown', handleKeydownWhileCellIsSelected)
    }
    else {
      window.removeEventListener('keydown', handleKeydownWhileCellIsSelected)
    }
    return () => {
      window.removeEventListener('keydown', handleKeydownWhileCellIsSelected)
    }
  }, [ isCellSelected ])

  const handleKeydownWhileCellIsSelected = (e: KeyboardEvent) => {
    e.preventDefault()
    // Otherwise, navigate to an adjacent cell on an arrow or enter press
    if(e.key === 'Enter' || e.key === 'ArrowDown') {
      updateSheetSelectionFromArrowKey(cellId, 'DOWN')
    }
    if(e.key === 'Tab' || e.key === 'ArrowRight') {
      updateSheetSelectionFromArrowKey(cellId, 'RIGHT')
    }
    if(e.key === 'ArrowLeft') {
      updateSheetSelectionFromArrowKey(cellId, 'LEFT')
    }
    if(e.key === 'ArrowUp') {
      updateSheetSelectionFromArrowKey(cellId, 'UP')
    }
  }
  
  const handleChange = (checked: boolean) => {
    const nextCellValue = checked ? '1' : '0'
    updateCellValue(nextCellValue)
  }
  
  return (
    <Container
      data-testid="SheetCellBoolean">
      <StyledInput 
        type="checkbox"
        checked={value && ['1', 'TRUE', 'true'].includes(value)}
        onChange={(e) => handleChange(e.target.checked)}/>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetCellBooleanProps {
  sheetId: string
  cell: ISheetCell
  cellId: string
  columnType: ISheetColumnType
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
