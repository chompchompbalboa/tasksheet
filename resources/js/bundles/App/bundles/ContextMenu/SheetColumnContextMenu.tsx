//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useDispatch } from 'react-redux'
import arrayMove from 'array-move'

import { CHECKMARK } from '@app/assets/icons'

import { Sheet, SheetActiveUpdates, SheetUpdates, SheetColumn, SheetColumns, SheetColumnUpdates } from '@app/state/sheet/types'
import { 
  createSheetColumn as createSheetColumnAction,
  createSheetColumnBreak as createSheetColumnBreakAction,
  deleteSheetColumn as deleteSheetColumnAction,
  deleteSheetColumnBreak as deleteSheetColumnBreakAction
} from '@app/state/sheet/actions'

import ContextMenu from '@app/bundles/ContextMenu/ContextMenu'
import ContextMenuDivider from '@app/bundles/ContextMenu/ContextMenuDivider'
import ContextMenuItem from '@app/bundles/ContextMenu/ContextMenuItem'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetColumnContextMenu = ({
  sheetId,
  columnId,
  columnIndex,
  columns,
  closeContextMenu,
  contextMenuLeft,
  contextMenuTop,
  contextMenuRight,
  sheetVisibleColumns,
  updateSheet,
  updateSheetActive,
  updateSheetColumn
}: SheetColumnContextMenuProps) => {
  
  const dispatch = useDispatch()
  const createSheetColumn = () => dispatch(createSheetColumnAction(sheetId, columnIndex))
  const createSheetColumnBreak = () => dispatch(createSheetColumnBreakAction(sheetId, columnIndex))
  const deleteSheetColumn = () => dispatch(deleteSheetColumnAction(sheetId, columnId))
  const deleteSheetColumnBreak = () => dispatch(deleteSheetColumnBreakAction(sheetId, columnIndex))
  
  const columnType = columnId === 'COLUMN_BREAK' ? 'COLUMN_BREAK' : columns[columnId].type
  const onDeleteClick = columnId === 'COLUMN_BREAK' ? deleteSheetColumnBreak : deleteSheetColumn

  const closeOnClick = (thenCallThis: (...args: any) => void) => {
    closeContextMenu()
    setTimeout(() => thenCallThis(), 10)
  }
  
  const handleColumnMoveClick = (moveFromColumnId: SheetColumn['id'], moveToIndex: number) => {
    const moveFromIndex = sheetVisibleColumns.findIndex(sheetVisibleColumnId => sheetVisibleColumnId === moveFromColumnId)
    const nextVisibleColumns = arrayMove(sheetVisibleColumns, moveFromIndex, (moveToIndex > moveFromIndex ? moveToIndex - 1 : moveToIndex))
    closeOnClick(() => {
      updateSheet(sheetId, { visibleColumns: nextVisibleColumns })
    })
  }

  return (
    <ContextMenu
      closeContextMenu={closeContextMenu}
      contextMenuTop={contextMenuTop}
      contextMenuLeft={contextMenuLeft}
      contextMenuRight={contextMenuRight}>
      <ContextMenuItem text="Insert Column" onClick={() => closeOnClick(() => createSheetColumn())}/>
      {columnType !== 'COLUMN_BREAK' && 
        <>
          <ContextMenuItem text="Insert Column Break" onClick={() => closeOnClick(() => createSheetColumnBreak())}/>
          <ContextMenuItem text="Move Before">
            {sheetVisibleColumns.map((sheetColumnId, index) => (
              <ContextMenuItem 
                key={sheetColumnId === 'COLUMN_BREAK' ? sheetColumnId + index : sheetColumnId}
                text={sheetColumnId === 'COLUMN_BREAK' ? 'Column Break' : columns[sheetColumnId].name} 
                onClick={() => handleColumnMoveClick(columnId, index)}/>
            ))}
          </ContextMenuItem>
          <ContextMenuDivider />
          <ContextMenuItem text="Rename" onClick={() => closeOnClick(() => updateSheetActive({ columnRenamingId: columnId }))}/>
          <ContextMenuItem text="Type">
            <ContextMenuItem 
              text="String" 
              logo={ columnType === 'STRING' ? CHECKMARK : null}
              onClick={() => closeOnClick(() => updateSheetColumn(columnId, { type: 'STRING' }))}/>
            <ContextMenuItem 
              text="Number" 
              logo={ columnType === 'NUMBER' ? CHECKMARK : null}
              onClick={() => closeOnClick(() => updateSheetColumn(columnId, { type: 'NUMBER' }))}/>
            <ContextMenuItem 
              text="Checkbox" 
              logo={ columnType === 'BOOLEAN' ? CHECKMARK : null}
              onClick={() => closeOnClick(() => updateSheetColumn(columnId, { type: 'BOOLEAN' }))}/>
            <ContextMenuItem 
              text="Date" 
              logo={ columnType === 'DATETIME' ? CHECKMARK : null}
              onClick={() => closeOnClick(() => updateSheetColumn(columnId, { type: 'DATETIME' }))}/>
            <ContextMenuItem 
              text="Dropdown">
              <ContextMenuItem
                text="Dropdown 1"
                logo={ columnType === 'DROPDOWN' ? CHECKMARK : null}
                onClick={() => closeOnClick(() => updateSheetColumn(columnId, { type: 'DROPDOWN' }))}/>
              <ContextMenuItem
                text="Dropdown 2"
                logo={ columnType === 'DROPDOWN' ? CHECKMARK : null}
                onClick={() => closeOnClick(() => updateSheetColumn(columnId, { type: 'DROPDOWN' }))}/>
              <ContextMenuItem
                text="Dropdown 3"
                logo={ columnType === 'DROPDOWN' ? CHECKMARK : null}
                onClick={() => closeOnClick(() => updateSheetColumn(columnId, { type: 'DROPDOWN' }))}/>
              <ContextMenuDivider />
              <ContextMenuItem
                text="Manage Dropdowns"
                logo={ columnType === 'DROPDOWN' ? CHECKMARK : null}
                onClick={() => closeOnClick(() => updateSheetColumn(columnId, { type: 'DROPDOWN' }))}/>
            </ContextMenuItem>
          </ContextMenuItem>
          <ContextMenuDivider />
        </>
      }
        <ContextMenuItem 
          text="Delete"
          onClick={() => closeOnClick(() => onDeleteClick())}>
        </ContextMenuItem>
    </ContextMenu>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetColumnContextMenuProps {
  sheetId: Sheet['id']
  columnId: SheetColumn['id']
  columnIndex: number
  columns: SheetColumns
  closeContextMenu(): void
  contextMenuLeft: number
  contextMenuTop: number
  contextMenuRight: number
  sheetVisibleColumns: SheetColumn['id'][]
  updateSheet(sheetId: string, updates: SheetUpdates): void
  updateSheetActive(updates: SheetActiveUpdates): void
  updateSheetColumn(columnId: SheetColumn['id'], updates: SheetColumnUpdates): void
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetColumnContextMenu
