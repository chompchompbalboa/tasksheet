//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import {
  clearSheetSelection as clearSheetSelectionAction
} from '@app/state/sheet/actions'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetCellContainer = ({
  cellId,
  children,
  focusCell,
  isCellSelected,
  updateCellValue,
  updateSheetSelectedCell,
  value
}: SheetCellContainerProps) => {
  
  const dispatch = useDispatch()
  const clearSheetSelection = useCallback(() => dispatch(clearSheetSelectionAction()), [])

  const container = useRef(null)
  const [ isCellEditing, setIsCellEditing ] = useState(localStorage.getItem('sheetCellIsEditing') === cellId)
  
  useEffect(() => {
    if(isCellSelected && !isCellEditing) {
      window.addEventListener('keydown', handleKeydownWhileCellIsSelected)
      window.addEventListener('mousedown', closeOnClickOutside)
    }
    else {
      window.removeEventListener('keydown', handleKeydownWhileCellIsSelected)
      window.removeEventListener('mousedown', closeOnClickOutside)
    }
    return () => {
      window.removeEventListener('keydown', handleKeydownWhileCellIsSelected)
      window.removeEventListener('mousedown', closeOnClickOutside)
    }
  }, [ isCellSelected, isCellEditing ])
  
  useEffect(() => {
    if(isCellEditing) {
      focusCell()
      window.addEventListener('mousedown', closeOnClickOutside)
      window.addEventListener('keydown', closeOnKeydownEnter)
    }
    else {
      window.removeEventListener('mousedown', closeOnClickOutside)
      window.removeEventListener('keydown', closeOnKeydownEnter)
    }
    return () => {
      window.removeEventListener('mousedown', closeOnClickOutside)
      window.removeEventListener('keydown', closeOnKeydownEnter)
    }
  }, [ isCellEditing ])

  const closeOnClickOutside = (e: MouseEvent) => {
    if(!container.current.contains(e.target)) {
      setIsCellEditing(false)
      !e.shiftKey && clearSheetSelection()
      localStorage.setItem('sheetCellIsEditing', null)
    }
  }

  const closeOnKeydownEnter = (e: KeyboardEvent) => {
    if(e.key === "Enter") {
      setIsCellEditing(false)
      localStorage.setItem('sheetCellIsEditing', null)
    }
  }

  const openOnDoubleClick = (e: any) => {
    e.preventDefault()
    setIsCellEditing(true)
    localStorage.setItem('sheetCellIsEditing', cellId)
  }

  const handleKeydownWhileCellIsSelected = (e: KeyboardEvent) => {
    e.preventDefault()
    // If a character key is pressed, start editing the cell
    if(e.key && e.key.length === 1 && !e.metaKey && !e.shiftKey) {
      setIsCellEditing(true)
      e.key.length === 1 && updateCellValue(e.key)
      localStorage.setItem('sheetCellIsEditing', cellId)
    }
    // Otherwise, navigate to an adjacent cell on an arrow or enter press
    if(e.key === 'Enter' || e.key === 'ArrowDown') {
      updateSheetSelectedCell(cellId, 'DOWN')
    }
    if(e.key === 'Tab' || e.key === 'ArrowRight') {
      updateSheetSelectedCell(cellId, 'RIGHT')
    }
    if(e.key === 'ArrowLeft') {
      updateSheetSelectedCell(cellId, 'LEFT')
    }
    if(e.key === 'ArrowUp') {
      updateSheetSelectedCell(cellId, 'UP')
    }
    if(e.key === 'Delete' || e.key === 'Backspace') {
      updateCellValue('')
    }
  }
  
  return (
    <Container
      ref={container}
      onDoubleClick={(e) => openOnDoubleClick(e)}>
        {isCellEditing 
          ? children
          : value === null ? " " : value}
    </Container>
  )

}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetCellContainerProps {
  cellId: string
  children?: any
  focusCell?(): void
  isCellSelected: boolean
  updateCellValue(nextCellValue: string): void
  updateSheetSelectedCell(cellId: string, moveSelectedCellDirection: 'UP' | 'RIGHT' | 'DOWN' | 'LEFT'): void
  value: string
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  white-space: nowrap;
  text-overflow: ellipsis;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetCellContainer
