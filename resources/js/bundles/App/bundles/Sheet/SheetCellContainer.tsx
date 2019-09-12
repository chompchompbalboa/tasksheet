//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useCallback, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { AppState } from '@app/state'
import { SheetCell, SheetCellUpdates } from '@app/state/sheet/types'
import {
  clearSheetSelection as clearSheetSelectionAction,
  updateSheetCell as updateSheetCellAction
} from '@app/state/sheet/actions'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetCellContainer = ({
  sheetId,
  cell,
  cellId,
  children,
  focusCell,
  isCellSelected,
  onCloseCell,
  onlyRenderChildren,
  updateCellValue,
  updateSheetSelectedCell,
  value
}: SheetCellContainerProps) => {
  
  const dispatch = useDispatch()
  const updateSheetCell = useCallback((updates: SheetCellUpdates) => dispatch(updateSheetCellAction(cellId, updates, null, true)), [])
  const clearSheetSelection = useCallback(() => dispatch(clearSheetSelectionAction()), [])
  
  const activeSheetId = useSelector((state: AppState) => state.folder.files[state.tab.activeTab] && state.folder.files[state.tab.activeTab].typeId)

  const container = useRef(null)
  const isCellEditing = cell.isCellEditing && sheetId === activeSheetId
  
  useEffect(() => {
    if(cell.isCellSelected && !cell.isCellEditing) {
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
  }, [ cell.isCellSelected, cell.isCellEditing ])
  
  useEffect(() => {
    if(cell.isCellEditing) {
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
  }, [ cell.isCellEditing ])

  const closeOnClickOutside = (e: MouseEvent) => {
    if(!container.current.contains(e.target)) {
      !e.shiftKey && clearSheetSelection()
      updateSheetCell({ 
        isCellEditing: false,
        isCellEditingSheetId: null
      })
      onCloseCell && onCloseCell()
    }
  }

  const closeOnKeydownEnter = (e: KeyboardEvent) => {
    if(e.key === "Enter") {
      updateSheetCell({ 
        isCellEditing: false,
        isCellEditingSheetId: null
      })
      onCloseCell && onCloseCell()
    }
  }

  const openOnDoubleClick = (e: any) => {
    e.preventDefault()
    updateSheetCell({ 
      isCellEditing: true,
      isCellEditingSheetId: sheetId
    })
  }

  const handleKeydownWhileCellIsSelected = (e: KeyboardEvent) => {
    // If a character key is pressed, start editing the cell
    if(e.key && e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      e.preventDefault()
      updateSheetCell({
        value: e.key,
        isCellEditing: true,
        isCellEditingSheetId: sheetId
      })
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
        {isCellEditing || onlyRenderChildren
          ? children
          : value === null ? " " : value}
    </Container>
  )

}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetCellContainerProps {
  sheetId: string
  cell: SheetCell
  cellId: string
  children?: any
  focusCell?(): void
  isCellEditing?: boolean
  isCellSelected: boolean
  onCloseCell?(...args: any): void
  onlyRenderChildren?: boolean
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
