//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useDispatch } from 'react-redux'
import arrayMove from 'array-move'

import { Sheet, SheetActiveUpdates, SheetUpdates, SheetColumn, SheetColumns, SheetColumnUpdates } from '@app/state/sheet/types'
import { createSheetColumn as createSheetColumnAction } from '@app/state/sheet/actions'

import ContextMenu from '@app/bundles/ContextMenu/ContextMenu'
import ContextMenuDivider from '@app/bundles/ContextMenu/ContextMenuDivider'
import ContextMenuItem from '@app/bundles/ContextMenu/ContextMenuItem'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetColumnContextMenu = ({
  sheetId,
  columnId,
  columns,
  closeContextMenu,
  contextMenuLeft,
  contextMenuTop,
  sheetVisibleColumns,
  updateSheet,
  updateSheetActive,
  updateSheetColumn
}: SheetColumnContextMenuProps) => {
  
  const dispatch = useDispatch()
  const createSheetColumn = (columnid: SheetColumn['id'], beforeOrAfter: 'BEFORE' | 'AFTER') => dispatch(createSheetColumnAction(sheetId, columnId, beforeOrAfter))

  const closeOnClick = (thenCallThis: (...args: any) => void) => {
    closeContextMenu()
    setTimeout(() => thenCallThis(), 10)
  }
  
  const handleColumnMoveClick = (moveFromColumnId: SheetColumn['id'], moveToColumnId: SheetColumn['id']) => {
    const moveFromColumnIndex = sheetVisibleColumns.findIndex(sheetVisibleColumnId => sheetVisibleColumnId === moveFromColumnId)
    const moveToColumnIndex = sheetVisibleColumns.findIndex(sheetVisibleColumnId => sheetVisibleColumnId === moveToColumnId)
    const nextVisibleColumns = arrayMove(sheetVisibleColumns, moveFromColumnIndex, moveToColumnIndex)
    closeOnClick(() => {
      updateSheet(sheetId, { visibleColumns: nextVisibleColumns })
    })
  }

  return (
    <ContextMenu
      closeContextMenu={closeContextMenu}
      contextMenuTop={contextMenuTop}
      contextMenuLeft={contextMenuLeft}>
      <ContextMenuItem text="Insert Column Before" onClick={() => closeOnClick(() => createSheetColumn(columnId, 'BEFORE'))}/>
      <ContextMenuItem text="Insert Column After" onClick={() => closeOnClick(() => createSheetColumn(columnId, 'AFTER'))}/>
      <ContextMenuItem text="Move Before">
        {sheetVisibleColumns.map(sheetColumnId => (
          <ContextMenuItem 
            key={sheetColumnId}
            text={columns[sheetColumnId].name} 
            onClick={() => handleColumnMoveClick(columnId, sheetColumnId)}/>
        ))}
      </ContextMenuItem>
      <ContextMenuDivider />
      <ContextMenuItem text="Rename" onClick={() => closeOnClick(() => updateSheetActive({ columnRenamingId: columnId }))}/>
      <ContextMenuItem text="Type">
        <ContextMenuItem text="String" onClick={() => closeOnClick(() => updateSheetColumn(columnId, { type: 'STRING' }))}/>
        <ContextMenuItem text="Number" onClick={() => closeOnClick(() => updateSheetColumn(columnId, { type: 'NUMBER' }))}/>
        <ContextMenuItem text="Checkbox" onClick={() => closeOnClick(() => updateSheetColumn(columnId, { type: 'BOOLEAN' }))}/>
        <ContextMenuItem text="Date" onClick={() => closeOnClick(() => updateSheetColumn(columnId, { type: 'DATETIME' }))}/>
      </ContextMenuItem>
      <ContextMenuDivider />
      <ContextMenuItem text="Delete">
      </ContextMenuItem>
    </ContextMenu>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetColumnContextMenuProps {
  sheetId: Sheet['id']
  columnId: string
  columns: SheetColumns
  closeContextMenu(): void
  contextMenuLeft: number
  contextMenuTop: number
  sheetVisibleColumns: SheetColumn['id'][]
  updateSheet(sheetId: string, updates: SheetUpdates): void
  updateSheetActive(updates: SheetActiveUpdates): void
  updateSheetColumn(columnId: string, updates: SheetColumnUpdates): void
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetColumnContextMenu
