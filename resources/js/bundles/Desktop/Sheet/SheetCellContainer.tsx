//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { IAppState } from '@/state'
import { 
  ISheetCell, 
  ISheetStyles 
} from '@/state/sheet/types'
import {
  updateSheetSelectionFromArrowKey
} from '@/state/sheet/actions'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetCellContainer = ({
  testId,
  cell: {
    id: cellId,
    sheetId,
    isCellEditing,
    isCellSelectedSheetIds
  },
  children,
  beginEditing,
  completeEditing,
  onlyRenderChildren = false,
  value
}: SheetCellContainerProps) => {
  
  // Refs
  const container = useRef(null)
  
  // Redux
  const dispatch = useDispatch()
  const activeSheetId = useSelector((state: IAppState) => state.folder.files[state.tab.activeTab] && state.folder.files[state.tab.activeTab].typeId)
  const isSelectedCellEditingPrevented = useSelector((state: IAppState) => state.sheet.allSheets[sheetId].selections.isSelectedCellEditingPrevented)
  const isSelectedCellNavigationPrevented = useSelector((state: IAppState) => state.sheet.allSheets[sheetId].selections.isSelectedCellNavigationPrevented)
  const sheetSelectionsRangeCellIds = useSelector((state: IAppState) => state.sheet.allSheets[sheetId].selections.rangeCellIds)
  const sheetStyles = useSelector((state: IAppState) => state.sheet.allSheets && state.sheet.allSheets[sheetId] && state.sheet.allSheets[sheetId].styles)
  
  // Local Variables
  const isActiveSheet = activeSheetId === sheetId
  const isCellEditing = isActiveSheet && isCellEditing
  const isCellSelected = isActiveSheet && isCellSelectedSheetIds.has(sheetId)
  
  // If the cell is selected, but not editing, add the correct keydown event listener
  useEffect(() => {
    isCellSelected && !isCellEditing
      ? addEventListener('keydown', handleKeydownWhileCellIsSelected)
      : removeEventListener('keydown', handleKeydownWhileCellIsSelected)
    return () => removeEventListener('keydown', handleKeydownWhileCellIsSelected)
  }, [ isCellSelected, isCellEditing, isSelectedCellEditingPrevented, isSelectedCellNavigationPrevented, sheetSelectionsRangeCellIds ])
  
  // If the cell is editing, add the correct keydown event listener
  useEffect(() => {
    isCellEditing
      ? addEventListener('keydown', handleKeydownWhileCellIsEditing)
      : removeEventListener('keydown', handleKeydownWhileCellIsEditing)
    return () => removeEventListener('keydown', handleKeydownWhileCellIsEditing)
  }, [ isCellEditing, isSelectedCellNavigationPrevented ])

  // Begin editing on double click
  // Note: Needing to handle both click and double click events within cells
  // is the reason we have both SheetCell and SheetCellContainer. A single 
  // component can't handle both events wihout unexpected behavior.
  const beginEditingOnDoubleClick = (e: any) => {
    e.preventDefault()
    beginEditing()
  }

  // Handle keydown while cell is editing
  const handleKeydownWhileCellIsEditing = (e: KeyboardEvent) => {
    if(!isSelectedCellNavigationPrevented) {
      if(e.key === 'Enter' || e.key === 'ArrowDown') {
        e.preventDefault()
        dispatch(updateSheetSelectionFromArrowKey(sheetId, cellId, 'DOWN', e.shiftKey))
        completeEditing()
      }
      if(e.key === 'Tab') {
        e.preventDefault()
        dispatch(updateSheetSelectionFromArrowKey(sheetId, cellId, 'RIGHT', e.shiftKey))
        completeEditing()
      }
      if(e.key === 'ArrowUp') {
        e.preventDefault()
        dispatch(updateSheetSelectionFromArrowKey(sheetId, cellId, 'UP', e.shiftKey))
        completeEditing()
      }
    }
  }

  // Handle keydown while cell is selected
  const handleKeydownWhileCellIsSelected = (e: KeyboardEvent) => {
    // If a character key is pressed, start editing the cell
    if(e.key 
      && e.key.length === 1 
      && !e.ctrlKey 
      && !e.metaKey 
      && !isSelectedCellEditingPrevented
      && !onlyRenderChildren
    ) {
      e.preventDefault()
      beginEditing(e.key)
    }
    if(!isSelectedCellNavigationPrevented) {
      // Otherwise, navigate to an adjacent cell on an arrow or enter press
      if(e.key === 'Enter' || e.key === 'ArrowDown') {
        e.preventDefault()
        dispatch(updateSheetSelectionFromArrowKey(sheetId, cellId, 'DOWN', e.shiftKey))
      }
      if(e.key === 'Tab' || e.key === 'ArrowRight') {
        e.preventDefault()
        dispatch(updateSheetSelectionFromArrowKey(sheetId, cellId, 'RIGHT', e.shiftKey))
      }
      if(e.key === 'ArrowLeft') {
        e.preventDefault()
        dispatch(updateSheetSelectionFromArrowKey(sheetId, cellId, 'LEFT', e.shiftKey))
      }
      if(e.key === 'ArrowUp') {
        e.preventDefault()
        dispatch(updateSheetSelectionFromArrowKey(sheetId, cellId, 'UP', e.shiftKey))
      }
      if((e.key === 'Delete' || e.key === 'Backspace') && !onlyRenderChildren) {
        e.preventDefault()
        beginEditing('')
      }
    }
  }
  
  return (
    <Container
      data-testid={testId}
      ref={container}
      cellId={cellId}
      isCellEditing={isCellEditing}
      onDoubleClick={(e) => beginEditingOnDoubleClick(e)}
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
  testId: string
  cell: ISheetCell
  children?: any
  beginEditing(): void
  completeEditing(...args: any): void
  onlyRenderChildren?: boolean
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
  font-weight: ${ ({ cellId, styles }: IContainer ) => styles.bold.has(cellId) ? 'bold' : 'normal' };
  font-style: ${ ({ cellId, styles }: IContainer ) => styles.italic.has(cellId) ? 'italic' : 'normal' };
`
interface IContainer {
  cellId: ISheetCell['id']
  isCellEditing: boolean
  styles: ISheetStyles
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetCellContainer
