//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { IAppState } from '@app/state'
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
  const isSelectedCellEditingPrevented = useSelector((state: IAppState) => state.sheet.allSheets[sheetId].selections.isSelectedCellEditingPrevented)
  const isSelectedCellNavigationPrevented = useSelector((state: IAppState) => state.sheet.allSheets[sheetId].selections.isSelectedCellNavigationPrevented)
  
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
  }, [ isCellSelected, isSelectedCellEditingPrevented, isSelectedCellNavigationPrevented ])

  const handleKeydownWhileCellIsSelected = (e: KeyboardEvent) => {
    if(!isSelectedCellEditingPrevented && !isSelectedCellNavigationPrevented) {
      // Otherwise, navigate to an adjacent cell on an arrow or enter press
      if(e.key === 'Enter' || e.key === 'ArrowDown') {
        e.preventDefault()
        updateSheetSelectionFromArrowKey(cellId, 'DOWN')
      }
      if(e.key === 'Tab' || e.key === 'ArrowRight') {
        e.preventDefault()
        updateSheetSelectionFromArrowKey(cellId, 'RIGHT')
      }
      if(e.key === 'ArrowLeft') {
        e.preventDefault()
        updateSheetSelectionFromArrowKey(cellId, 'LEFT')
      }
      if(e.key === 'ArrowUp') {
        e.preventDefault()
        updateSheetSelectionFromArrowKey(cellId, 'UP')
      }
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
