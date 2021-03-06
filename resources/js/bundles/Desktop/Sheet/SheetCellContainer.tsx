//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { MouseEvent, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { useSheetEditingPermissions } from '@/hooks'

import { IAppState } from '@/state'
import { 
  ISheet,
  ISheetCell, 
  ISheetCellType,
  ISheetStyles, 
} from '@/state/sheet/types'
import {
  createMessengerMessage
} from '@/state/messenger/actions'
import {
  updateSheetSelectionFromArrowKey
} from '@/state/sheet/actions'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetCellContainer = ({
  testId,
  sheetId,
  cell,
  cellType,
  children,
  containerPadding = '0.15rem 0.25rem',
  beginEditing = () => null,
  completeEditing = () => null,
  onlyRenderChildren = false,
  value
}: SheetCellContainerProps) => {
  
  // Refs
  const container = useRef(null)
  
  // Redux
  const dispatch = useDispatch()
  const activeSheetId = useSelector((state: IAppState) => state.folder.allFiles[state.tab.activeTab] && state.folder.allFiles[state.tab.activeTab].typeId)
  const isSelectedCellEditingPrevented = useSelector((state: IAppState) => state.sheet.allSheets[sheetId].selections.isSelectedCellEditingPrevented)
  const isSelectedCellNavigationPrevented = useSelector((state: IAppState) => state.sheet.allSheets[sheetId].selections.isSelectedCellNavigationPrevented)
  const sheetStyles = useSelector((state: IAppState) => state.sheet.allSheets && state.sheet.allSheets[sheetId] && state.sheet.allSheets[sheetId].styles)
  
  // Permissions
  const { 
    userHasPermissionToEditSheet,
    userHasPermissionToEditSheetErrorMessage
  } = useSheetEditingPermissions(sheetId)
  
  // Local Variables
  const isActiveSheet = activeSheetId === sheetId
  const isCellEditing = isActiveSheet && cell.isCellEditing
  const isCellSelected = isActiveSheet && cell.isCellSelectedSheetIds.has(sheetId)
  
  // If the cell is selected, but not editing, add the correct keydown event listener
  useEffect(() => {
    isCellSelected && !isCellEditing
      ? addEventListener('keydown', handleKeydownWhileCellIsSelected)
      : removeEventListener('keydown', handleKeydownWhileCellIsSelected)
    return () => removeEventListener('keydown', handleKeydownWhileCellIsSelected)
  }, [ beginEditing, isCellSelected, isCellEditing, isSelectedCellEditingPrevented, isSelectedCellNavigationPrevented ])
  
  // If the cell is editing, add a mousedown event listener and the correct keydown event listener
  useEffect(() => {
    if(isCellEditing) {
      addEventListener('keydown', handleKeydownWhileCellIsEditing)
      addEventListener('mousedown', completeEditingOnClickOutside)
    }
    else {
      removeEventListener('keydown', handleKeydownWhileCellIsEditing)
      removeEventListener('mousedown', completeEditingOnClickOutside)
    }
    return () => {
      removeEventListener('keydown', handleKeydownWhileCellIsEditing)
      removeEventListener('mousedown', completeEditingOnClickOutside)
    }
  }, [ completeEditing, isCellEditing, isSelectedCellNavigationPrevented ])

  // Begin editing on double click
  // Note: Needing to handle both click and double click events within cells
  // is the reason we have both SheetCell and SheetCellContainer. A single 
  // component can't handle both events wihout unexpected behavior.
  const beginEditingOnDoubleClick = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    if(!userHasPermissionToEditSheet) {
      dispatch(createMessengerMessage(userHasPermissionToEditSheetErrorMessage))
    }
    else {
      beginEditing()
    }
  }

  // Complete Editing On Click Outside
  const completeEditingOnClickOutside = (e: any) => {
    if(!container.current.contains(e.target)) {
      completeEditing()
    }
  } 

  // Handle keydown while cell is editing
  const handleKeydownWhileCellIsEditing = (e: KeyboardEvent) => {
    if(!isSelectedCellNavigationPrevented) {
      if(e.key === 'Enter' || e.key === 'ArrowDown') {
        e.preventDefault()
        dispatch(updateSheetSelectionFromArrowKey(sheetId, cell.id, 'DOWN', e.shiftKey))
        completeEditing()
      }
      if(e.key === 'Tab') {
        e.preventDefault()
        dispatch(updateSheetSelectionFromArrowKey(sheetId, cell.id, 'RIGHT', e.shiftKey))
        completeEditing()
      }
      if(e.key === 'ArrowUp') {
        e.preventDefault()
        dispatch(updateSheetSelectionFromArrowKey(sheetId, cell.id, 'UP', e.shiftKey))
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
      && !['BOOLEAN', 'FILES', 'PHOTOS'].includes(cellType)
    ) {
      e.preventDefault()
      if(!userHasPermissionToEditSheet) {
        dispatch(createMessengerMessage(userHasPermissionToEditSheetErrorMessage))
      }
      else {
        beginEditing(e.key)
      }
    }
    if(!isSelectedCellNavigationPrevented) {
      // Otherwise, navigate to an adjacent cell on an arrow or enter press
      if(e.key === 'Enter' || e.key === 'ArrowDown') {
        e.preventDefault()
        dispatch(updateSheetSelectionFromArrowKey(sheetId, cell.id, 'DOWN', e.shiftKey))
      }
      if(e.key === 'Tab' || e.key === 'ArrowRight') {
        e.preventDefault()
        dispatch(updateSheetSelectionFromArrowKey(sheetId, cell.id, 'RIGHT', e.shiftKey))
      }
      if(e.key === 'ArrowLeft') {
        e.preventDefault()
        dispatch(updateSheetSelectionFromArrowKey(sheetId, cell.id, 'LEFT', e.shiftKey))
      }
      if(e.key === 'ArrowUp') {
        e.preventDefault()
        dispatch(updateSheetSelectionFromArrowKey(sheetId, cell.id, 'UP', e.shiftKey))
      }
      if((e.key === 'Delete' || e.key === 'Backspace') && !['BOOLEAN', 'FILES', 'PHOTOS'].includes(cellType)) {
        e.preventDefault()
        if(!userHasPermissionToEditSheet) {
          dispatch(createMessengerMessage(userHasPermissionToEditSheetErrorMessage))
        }
        else {
          beginEditing('')
        }
      }
    }
  }
  
  return (
    <Container
      data-testid={testId}
      ref={container}
      containerPadding={containerPadding}
      isCellEditing={isCellEditing}
      onDoubleClick={beginEditingOnDoubleClick}>
        {isCellEditing || onlyRenderChildren
          ? children
          : <CellValue
              cellId={cell.id}
              styles={sheetStyles}>
              {value === null ? " " : value}
            </CellValue>
        }
    </Container>
  )

}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetCellContainerProps {
  testId: string
  sheetId: ISheet['id']
  cell: ISheetCell
  cellType: ISheetCellType
  children?: any
  containerPadding?: string
  beginEditing?(nextSheetCellValue?: string): void
  completeEditing?(...args: any): void
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
  padding:  ${ ({ containerPadding }: IContainer ) => containerPadding };
`
interface IContainer {
  containerPadding: string
  isCellEditing: boolean
}

const CellValue = styled.div`
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: ${ ({ cellId, styles }: ICellValue ) => styles.bold.has(cellId) ? 'bold' : 'normal' };
  font-style: ${ ({ cellId, styles }: ICellValue ) => styles.italic.has(cellId) ? 'italic' : 'normal' };
`
interface ICellValue {
  cellId: ISheetCell['id']
  styles: ISheetStyles
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetCellContainer
