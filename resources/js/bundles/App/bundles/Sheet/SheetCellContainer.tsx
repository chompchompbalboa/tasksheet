//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useCallback, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { AppState } from '@app/state'
import { SheetCell, SheetCellUpdates, SheetStyles } from '@app/state/sheet/types'
import {
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
  onCloseCell,
  onlyRenderChildren,
  updateCellValue,
  updateSheetSelectionFromArrowKey,
  value
}: SheetCellContainerProps) => {
  
  const dispatch = useDispatch()
  const updateSheetCell = useCallback((updates: SheetCellUpdates) => dispatch(updateSheetCellAction(cellId, updates, null, true)), [])
  
  const activeSheetId = useSelector((state: AppState) => state.folder.files[state.tab.activeTab] && state.folder.files[state.tab.activeTab].typeId)
  const isSelectedCellEditingPrevented = useSelector((state: AppState) => state.sheet.sheets[sheetId].selections.isSelectedCellEditingPrevented)
  const isSelectedCellNavigationPrevented = useSelector((state: AppState) => state.sheet.sheets[sheetId].selections.isSelectedCellNavigationPrevented)
  const sheetStyles = useSelector((state: AppState) => state.sheet.sheets && state.sheet.sheets[sheetId] && state.sheet.sheets[sheetId].styles)

  const container = useRef(null)

  const isActiveSheet = sheetId === activeSheetId
  const isCellEditing = cell.isCellEditing && isActiveSheet
  const isCellSelected = cell.isCellSelected && isActiveSheet

  
  useEffect(() => {
    if(isCellSelected && !isCellEditing) {
      addEventListener('keydown', handleKeydownWhileCellIsSelected)
    }
    else {
      removeEventListener('keydown', handleKeydownWhileCellIsSelected)
    }
    return () => {
      removeEventListener('keydown', handleKeydownWhileCellIsSelected)
    }
  }, [ isCellSelected, isCellEditing, isSelectedCellEditingPrevented, isSelectedCellNavigationPrevented ])
  
  useEffect(() => {
    if(isCellEditing) {
      focusCell()
      addEventListener('keydown', closeOnKeydownEnter)
      addEventListener('click', handleClickWhileCellIsEditing)
    }
    else {
      removeEventListener('keydown', closeOnKeydownEnter)
      removeEventListener('click', handleClickWhileCellIsEditing)
    }
    return () => {
      removeEventListener('keydown', closeOnKeydownEnter)
      removeEventListener('click', handleClickWhileCellIsEditing)
    }
  }, [ isCellEditing ])

  const closeOnKeydownEnter = (e: KeyboardEvent) => {
    if(e.key === "Enter") {
      updateSheetCell({ 
        isCellEditing: false
      })
      onCloseCell && onCloseCell()
    }
  }

  const openOnDoubleClick = (e: any) => {
    e.preventDefault()
    updateSheetCell({ 
      isCellEditing: true
    })
  }
  
  const handleClickWhileCellIsEditing = (e: MouseEvent) => {
    if(!container.current.contains(e.target)) {
      updateSheetCell({ 
        isCellEditing: false
      })
      onCloseCell && onCloseCell()
    }
  }

  const handleKeydownWhileCellIsSelected = (e: KeyboardEvent) => {
    // If a character key is pressed, start editing the cell
    if(e.key && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !isSelectedCellEditingPrevented) {
      e.preventDefault()
      updateSheetCell({
        value: e.key,
        isCellEditing: true
      })
    }
    if(!isSelectedCellNavigationPrevented) {
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
      if(e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault()
        updateCellValue('')
      }
    }
  }

  return (
    <Container
      ref={container}
      cellId={cellId}
      isCellEditing={isCellEditing}
      onDoubleClick={(e) => openOnDoubleClick(e)}
      styles={sheetStyles}>
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
  updateSheetSelectionFromArrowKey(cellId: string, moveSelectedCellDirection: 'UP' | 'RIGHT' | 'DOWN' | 'LEFT'): void
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
  padding: 0.15rem 0.25rem;
  display: flex;
  align-items: center;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-weight: ${ ({ cellId, styles }: IContainer ) => styles.BOLD.has(cellId) ? 'bold' : 'normal' };
  font-style: ${ ({ cellId, styles }: IContainer ) => styles.ITALIC.has(cellId) ? 'italic' : 'normal' };
`
interface IContainer {
  cellId: SheetCell['id']
  isCellEditing: boolean
  styles: SheetStyles
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetCellContainer
