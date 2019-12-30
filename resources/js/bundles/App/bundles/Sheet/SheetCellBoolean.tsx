//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { IAppState } from '@app/state'
import { ISheetCell } from '@app/state/sheet/types'
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
        dispatch(updateSheetSelectionFromArrowKeyAction(sheetId, cellId, 'DOWN', e.shiftKey))
      }
      if(e.key === 'Tab' || e.key === 'ArrowRight') {
        e.preventDefault()
        dispatch(updateSheetSelectionFromArrowKeyAction(sheetId, cellId, 'RIGHT', e.shiftKey))
      }
      if(e.key === 'ArrowLeft') {
        e.preventDefault()
        dispatch(updateSheetSelectionFromArrowKeyAction(sheetId, cellId, 'LEFT', e.shiftKey))
      }
      if(e.key === 'ArrowUp') {
        e.preventDefault()
        dispatch(updateSheetSelectionFromArrowKeyAction(sheetId, cellId, 'UP', e.shiftKey))
      }
    }
  }
  
  const handleChange = (checked: boolean) => {
    const nextCellValue = checked ? 'Checked' : ''
    updateCellValue(nextCellValue)
  }
  
  return (
    <Container
      data-testid="SheetCellBoolean">
      <StyledInput 
        type="checkbox"
        checked={value && value === 'Checked'}
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
