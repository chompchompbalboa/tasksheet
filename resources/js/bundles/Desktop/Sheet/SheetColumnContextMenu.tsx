//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import arrayMove from 'array-move'

import { CHECKMARK } from '@/assets/icons'

import { IAppState } from '@/state'
import { 
  ISheet,
  ISheetColumn,
  ISheetCellType
} from '@/state/sheet/types'
import { 
  createSheetColumn,
  createSheetColumnBreak,
  deleteSheetColumn,
  deleteSheetColumnBreak,
  hideSheetColumn,
  showSheetColumn,
  updateSheetView,
  updateSheetActive,
  updateSheetColumn
} from '@/state/sheet/actions'

import ContextMenu from '@desktop/ContextMenu/ContextMenu'
import ContextMenuDivider from '@desktop/ContextMenu/ContextMenuDivider'
import ContextMenuItem from '@desktop/ContextMenu/ContextMenuItem'
import SheetColumnContextMenuSettings from '@desktop/Sheet/SheetColumnContextMenuSettings'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
export const SheetColumnContextMenu = ({
  sheetId,
  columnId,
  columnIndex,
  closeContextMenu,
  contextMenuLeft,
  contextMenuTop,
  contextMenuRight,
}: ISheetColumnContextMenuProps) => {
  
  // Redux
  const dispatch = useDispatch()
  const allSheetColumns = useSelector((state: IAppState) => state.sheet.allSheetColumns)
  const sheetColumns = useSelector((state: IAppState) => state.sheet.allSheets[sheetId].columns)
  const sheetActiveSheetViewId = useSelector((state: IAppState) => state.sheet.allSheets[sheetId].activeSheetViewId)
  const sheetViewVisibleColumns = useSelector((state: IAppState) => state.sheet.allSheetViews[sheetActiveSheetViewId] && state.sheet.allSheetViews[sheetActiveSheetViewId].visibleColumns)
  const sheetColumn = allSheetColumns[columnId]

  // Cell Types
  const sheetCellTypes: { [sheetCellType: string]: { label: string, cellType: ISheetCellType }} = {
    STRING: {
      label: 'Text',
      cellType: 'STRING'
    },
    NUMBER: {
      label: 'Number',
      cellType: 'NUMBER'
    },
    DATETIME: {
      label: 'Date',
      cellType: 'DATETIME'
    },
    BOOLEAN: {
      label: 'Checkbox',
      cellType: 'BOOLEAN'
    },
    PHOTOS: {
      label: 'Photos',
      cellType: 'PHOTOS'
    },
    FILES: {
      label: 'Files',
      cellType: 'FILES'
    }
  }
  const sheetCellTypesKeys = Object.keys(sheetCellTypes)

  // Is this is a column break?
  const sheetColumnCellType = columnId === 'COLUMN_BREAK' ? 'COLUMN_BREAK' : sheetColumn.cellType
  const onDeleteClick = columnId === 'COLUMN_BREAK' 
    ? () => dispatch(deleteSheetColumnBreak(sheetId, columnIndex))
    : () => dispatch(deleteSheetColumn(sheetId, columnId))

  // Close the context menu before handling a click
  const closeContextMenuOnClick = (thenCallThis: (...args: any) => void) => {
    closeContextMenu()
    setTimeout(() => thenCallThis(), 10)
  }
  
  // Handle moving a column
  const handleColumnMoveClick = (moveFromColumnId: ISheetColumn['id'], moveToIndex: number) => {
    const moveFromIndex = sheetViewVisibleColumns.findIndex(sheetVisibleColumnId => sheetVisibleColumnId === moveFromColumnId)
    const nextVisibleColumns = arrayMove(sheetViewVisibleColumns, moveFromIndex, (moveToIndex > moveFromIndex ? moveToIndex - 1 : moveToIndex))
    closeContextMenuOnClick(() => {
      dispatch(updateSheetView(sheetActiveSheetViewId, { visibleColumns: nextVisibleColumns }))
    })
  }
  
  // Hidden sheet columns
  const hiddenSheetColumns = sheetColumns.filter(columnId => !sheetViewVisibleColumns.includes(columnId))

  return (
    <ContextMenu
      testId="SheetColumnContextMenu"
      closeContextMenu={closeContextMenu}
      contextMenuTop={contextMenuTop}
      contextMenuLeft={contextMenuLeft}
      contextMenuRight={contextMenuRight}>
      <ContextMenuItem 
        isFirstItem 
        text="Insert Column" 
        onClick={() => closeContextMenuOnClick(() => dispatch(createSheetColumn(sheetId, columnIndex)))}/>
      {sheetColumnCellType !== 'COLUMN_BREAK' && 
        <>
          <ContextMenuItem 
            text="Insert Column Break" 
            onClick={() => closeContextMenuOnClick(() => dispatch(createSheetColumnBreak(sheetId, columnIndex)))}/>
          <ContextMenuDivider />
          <ContextMenuItem 
            text="Move Before">
            {sheetViewVisibleColumns.map((sheetColumnId, index) => (
              <ContextMenuItem 
                key={sheetColumnId === 'COLUMN_BREAK' ? sheetColumnId + index : sheetColumnId}
                text={sheetColumnId === 'COLUMN_BREAK' ? 'Column Break' : allSheetColumns[sheetColumnId].name} 
                onClick={() => handleColumnMoveClick(columnId, index)}/>
            ))}
          </ContextMenuItem>
          <ContextMenuItem 
            text="Hide" 
            onClick={() => closeContextMenuOnClick(() => dispatch(hideSheetColumn(sheetId, columnIndex)))}/>
          {hiddenSheetColumns.length > 0 &&
            <ContextMenuItem 
              text="Show">
              {hiddenSheetColumns.map(columnId => {
                const column = allSheetColumns[columnId]
                return (
                  <ContextMenuItem
                    key={column.id}
                    text={column.name}
                    onClick={() => closeContextMenuOnClick(() => dispatch(showSheetColumn(sheetId, columnIndex, column.id)))}/>
                )
              })}
            </ContextMenuItem>
          }
          <ContextMenuDivider />
          <ContextMenuItem 
            text="Rename" 
            onClick={() => closeContextMenuOnClick(() => dispatch(updateSheetActive({ columnRenamingId: columnId })))}/>
          <ContextMenuItem 
            text="Type">
            {sheetCellTypesKeys.map((sheetCellType, index) => {
              const currentCellType = sheetCellTypes[sheetCellType]
              return (
                <ContextMenuItem
                  key={sheetCellType}
                  isFirstItem={index === 0}
                  isLastItem={index === (sheetCellTypesKeys.length - 1)}
                  logo={sheetColumnCellType === currentCellType.cellType ? CHECKMARK : null}
                  onClick={() => closeContextMenuOnClick(() => dispatch(updateSheetColumn(columnId, { cellType: currentCellType.cellType })))}
                  text={currentCellType.label}
                  />)})}
            </ContextMenuItem>
            <SheetColumnContextMenuSettings
              sheetId={sheetId}
              columnId={columnId}/>
          <ContextMenuDivider />
        </>
      }
        <ContextMenuItem 
          isLastItem
          text="Delete"
          onClick={() => closeContextMenuOnClick(() => onDeleteClick())}>
        </ContextMenuItem>
    </ContextMenu>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
export interface ISheetColumnContextMenuProps {
  sheetId: ISheet['id']
  columnId: ISheetColumn['id']
  columnIndex: number
  closeContextMenu(): void
  contextMenuLeft: number
  contextMenuTop: number
  contextMenuRight: number
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetColumnContextMenu
