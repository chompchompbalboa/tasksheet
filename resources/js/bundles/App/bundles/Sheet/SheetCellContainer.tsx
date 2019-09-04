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
  onCloseCell,
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
      addEventListener('keydown', handleKeydownWhileCellIsSelected)
      addEventListener('mousedown', closeOnClickOutside)
    }
    else {
      removeEventListener('keydown', handleKeydownWhileCellIsSelected)
      removeEventListener('mousedown', closeOnClickOutside)
    }
    return () => {
      removeEventListener('keydown', handleKeydownWhileCellIsSelected)
      removeEventListener('mousedown', closeOnClickOutside)
    }
  }, [ isCellSelected, isCellEditing ])
  
  useEffect(() => {
    if(isCellEditing) {
      focusCell()
      addEventListener('mousedown', closeOnClickOutside)
      addEventListener('keydown', closeOnKeydownEnter)
    }
    else {
      removeEventListener('mousedown', closeOnClickOutside)
      removeEventListener('keydown', closeOnKeydownEnter)
    }
    return () => {
      removeEventListener('mousedown', closeOnClickOutside)
      removeEventListener('keydown', closeOnKeydownEnter)
    }
  }, [ isCellEditing ])

  const closeOnClickOutside = (e: MouseEvent) => {
    if(!container.current.contains(e.target)) {
      setIsCellEditing(false)
      !e.shiftKey && clearSheetSelection()
      localStorage.setItem('sheetCellIsEditing', null)
      onCloseCell && onCloseCell()
    }
  }

  const closeOnKeydownEnter = (e: KeyboardEvent) => {
    if(e.key === "Enter") {
      setIsCellEditing(false)
      localStorage.setItem('sheetCellIsEditing', null)
      onCloseCell && onCloseCell()
    }
  }

  const openOnDoubleClick = (e: any) => {
    e.preventDefault()
    setIsCellEditing(true)
    localStorage.setItem('sheetCellIsEditing', cellId)
  }

  const handleKeydownWhileCellIsSelected = (e: KeyboardEvent) => {
    // If a character key is pressed, start editing the cell
    if(e.key && e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      e.preventDefault()
      setIsCellEditing(true)
      e.key.length === 1 && updateCellValue(e.key)
      localStorage.setItem('sheetCellIsEditing', cellId)
    }
    // Otherwise, navigate to an adjacent cell on an arrow or enter press
    if(e.key === 'Enter' || e.key === 'ArrowDown') {
      e.preventDefault()
      updateSheetSelectedCell(cellId, 'DOWN')
    }
    if(e.key === 'Tab' || e.key === 'ArrowRight') {
      e.preventDefault()
      updateSheetSelectedCell(cellId, 'RIGHT')
    }
    if(e.key === 'ArrowLeft') {
      e.preventDefault()
      updateSheetSelectedCell(cellId, 'LEFT')
    }
    if(e.key === 'ArrowUp') {
      e.preventDefault()
      updateSheetSelectedCell(cellId, 'UP')
    }
    if(e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault()
      updateCellValue('')
    }
  }
  
  return (
    <Container
      ref={container}
      isCellEditing={isCellEditing}
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
  isCellEditing?: boolean
  isCellSelected: boolean
  onCloseCell?(...args: any): void
  updateCellValue(nextCellValue: string): void
  updateSheetSelectedCell(cellId: string, moveSelectedCellDirection: 'UP' | 'RIGHT' | 'DOWN' | 'LEFT'): void
  value: string
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  z-index: ${ ({ isCellEditing }: IContainer ) => isCellEditing ? '10' : '5' };
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  white-space: nowrap;
  text-overflow: ellipsis;
`
interface IContainer {
  isCellEditing: boolean
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetCellContainer
