//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import arrayMove from 'array-move'

import { CHECKMARK } from '@app/assets/icons'

import { AppState } from '@app/state'
import { ISheet, ISheetActiveUpdates, ISheetUpdates, ISheetColumn, IAllSheetColumns, ISheetColumnUpdates } from '@app/state/sheet/types'
import { 
  createSheetColumn as createSheetColumnAction,
  createSheetColumnBreak as createSheetColumnBreakAction,
  deleteSheetColumn as deleteSheetColumnAction,
  deleteSheetColumnBreak as deleteSheetColumnBreakAction,
  hideSheetColumn as hideSheetColumnAction,
  showSheetColumn as showSheetColumnAction
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
  
  const allSheetColumnTypes = useSelector((state: AppState) => state.sheet.allSheetColumnTypes)
  const sheetColumns = useSelector((state: AppState) => state.sheet.allSheets[sheetId].columns)
  const columnTypeIds = Object.keys(allSheetColumnTypes)
  const dispatch = useDispatch()
  const createSheetColumn = () => dispatch(createSheetColumnAction(sheetId, columnIndex))
  const createSheetColumnBreak = () => dispatch(createSheetColumnBreakAction(sheetId, columnIndex))
  const deleteSheetColumn = () => dispatch(deleteSheetColumnAction(sheetId, columnId))
  const deleteSheetColumnBreak = () => dispatch(deleteSheetColumnBreakAction(sheetId, columnIndex))
  const hideSheetColumn = () => dispatch(hideSheetColumnAction(sheetId, columnIndex))
  const showSheetColumn = (columnIdToShow: ISheetColumn['id']) => dispatch(showSheetColumnAction(sheetId, columnIndex, columnIdToShow))
  
  const columnType = columnId === 'COLUMN_BREAK' ? 'COLUMN_BREAK' : allSheetColumnTypes[columns[columnId].typeId]
  const onDeleteClick = columnId === 'COLUMN_BREAK' ? deleteSheetColumnBreak : deleteSheetColumn

  const closeOnClick = (thenCallThis: (...args: any) => void) => {
    closeContextMenu()
    setTimeout(() => thenCallThis(), 10)
  }
  
  const handleColumnMoveClick = (moveFromColumnId: ISheetColumn['id'], moveToIndex: number) => {
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
      <ContextMenuItem isFirstItem text="Insert Column" onClick={() => closeOnClick(() => createSheetColumn())}/>
      {columnType !== 'COLUMN_BREAK' && 
        <>
          <ContextMenuItem 
            text="Insert Column Break" 
            onClick={() => closeOnClick(() => createSheetColumnBreak())}/>
          <ContextMenuItem 
            text="Move Before">
            {sheetVisibleColumns.map((sheetColumnId, index) => (
              <ContextMenuItem 
                key={sheetColumnId === 'COLUMN_BREAK' ? sheetColumnId + index : sheetColumnId}
                text={sheetColumnId === 'COLUMN_BREAK' ? 'Column Break' : columns[sheetColumnId].name} 
                onClick={() => handleColumnMoveClick(columnId, index)}/>
            ))}
          </ContextMenuItem>
          <ContextMenuDivider />
          <ContextMenuItem 
            text="Hide" 
            onClick={() => closeOnClick(() => hideSheetColumn())}/>
          <ContextMenuItem 
            text="Show">
            {sheetColumns.filter(columnId => !sheetVisibleColumns.includes(columnId)).map(columnId => {
              const column = columns[columnId]
              return (
                <ContextMenuItem
                  key={column.id}
                  text={column.name}
                  onClick={() => showSheetColumn(column.id)}/>
              )
            })}
          </ContextMenuItem>
          <ContextMenuDivider />
          <ContextMenuItem 
            text="Rename" 
            onClick={() => closeOnClick(() => updateSheetActive({ columnRenamingId: columnId }))}/>
          <ContextMenuItem 
            text="Type">
            {columnTypeIds.map((columnTypeId, index) => {
              const currentColumnType = allSheetColumnTypes[columnTypeId]
              return (
                <ContextMenuItem
                  key={columnTypeId}
                  isFirstItem={index === 0}
                  isLastItem={index === (columnTypeIds.length - 1)}
                  logo={columnType.id === currentColumnType.id ? CHECKMARK : null}
                  onClick={() => closeOnClick(() => updateSheetColumn(columnId, { typeId: currentColumnType.id }))}
                  text={currentColumnType.name}
                  />
              )
            })}
          </ContextMenuItem>
          <ContextMenuDivider />
        </>
      }
        <ContextMenuItem 
          isLastItem
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
  sheetId: ISheet['id']
  columnId: ISheetColumn['id']
  columnIndex: number
  columns: IAllSheetColumns
  closeContextMenu(): void
  contextMenuLeft: number
  contextMenuTop: number
  contextMenuRight: number
  sheetVisibleColumns: ISheetColumn['id'][]
  updateSheet(sheetId: string, updates: ISheetUpdates): void
  updateSheetActive(updates: ISheetActiveUpdates): void
  updateSheetColumn(columnId: ISheetColumn['id'], updates: ISheetColumnUpdates): void
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetColumnContextMenu
