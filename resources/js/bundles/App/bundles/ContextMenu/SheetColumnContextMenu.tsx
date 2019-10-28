//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import arrayMove from 'array-move'

import { CHECKMARK } from '@app/assets/icons'

import { IAppState } from '@app/state'
import { 
  ISheet,
  ISheetColumn
} from '@app/state/sheet/types'
import { 
  createSheetColumn,
  createSheetColumnBreak,
  deleteSheetColumn,
  deleteSheetColumnBreak,
  hideSheetColumn,
  showSheetColumn,
  updateSheet,
  updateSheetActive,
  updateSheetColumn
} from '@app/state/sheet/actions'
import { 
  updateActiveTab 
} from '@app/state/tab/actions'

import ContextMenu from '@app/bundles/ContextMenu/ContextMenu'
import ContextMenuDivider from '@app/bundles/ContextMenu/ContextMenuDivider'
import ContextMenuItem from '@app/bundles/ContextMenu/ContextMenuItem'

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
  const allSheetColumnTypes = useSelector((state: IAppState) => state.sheet.allSheetColumnTypes)
  const allSheetColumnTypesIds = Object.keys(allSheetColumnTypes)
  
  const sheetColumns = useSelector((state: IAppState) => state.sheet.allSheets[sheetId].columns)
  const sheetVisibleColumns = useSelector((state: IAppState) => state.sheet.allSheets[sheetId].visibleColumns)
  
  // Is this is a column break?
  const sheetColumnType = columnId === 'COLUMN_BREAK' ? 'COLUMN_BREAK' : allSheetColumnTypes[allSheetColumns[columnId].typeId]
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
    const moveFromIndex = sheetVisibleColumns.findIndex(sheetVisibleColumnId => sheetVisibleColumnId === moveFromColumnId)
    const nextVisibleColumns = arrayMove(sheetVisibleColumns, moveFromIndex, (moveToIndex > moveFromIndex ? moveToIndex - 1 : moveToIndex))
    closeContextMenuOnClick(() => {
      dispatch(updateSheet(sheetId, { visibleColumns: nextVisibleColumns }))
    })
  }

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
      {sheetColumnType !== 'COLUMN_BREAK' && 
        <>
          <ContextMenuItem 
            text="Insert Column Break" 
            onClick={() => closeContextMenuOnClick(() => dispatch(createSheetColumnBreak(sheetId, columnIndex)))}/>
          <ContextMenuItem 
            text="Move Before">
            {sheetVisibleColumns.map((sheetColumnId, index) => (
              <ContextMenuItem 
                key={sheetColumnId === 'COLUMN_BREAK' ? sheetColumnId + index : sheetColumnId}
                text={sheetColumnId === 'COLUMN_BREAK' ? 'Column Break' : allSheetColumns[sheetColumnId].name} 
                onClick={() => handleColumnMoveClick(columnId, index)}/>
            ))}
          </ContextMenuItem>
          <ContextMenuDivider />
          <ContextMenuItem 
            text="Hide" 
            onClick={() => closeContextMenuOnClick(() => dispatch(hideSheetColumn(sheetId, columnIndex)))}/>
          <ContextMenuItem 
            text="Show">
            {sheetColumns.filter(columnId => !sheetVisibleColumns.includes(columnId)).map(columnId => {
              const column = allSheetColumns[columnId]
              return (
                <ContextMenuItem
                  key={column.id}
                  text={column.name}
                  onClick={() => dispatch(showSheetColumn(sheetId, columnIndex, column.id))}/>
              )
            })}
          </ContextMenuItem>
          <ContextMenuDivider />
          <ContextMenuItem 
            text="Rename" 
            onClick={() => closeContextMenuOnClick(() => dispatch(updateSheetActive({ columnRenamingId: columnId })))}/>
          <ContextMenuItem 
            text="Type">
            {allSheetColumnTypesIds.map((sheetColumnTypeId, index) => {
              const currentColumnType = allSheetColumnTypes[sheetColumnTypeId]
              return (
                <ContextMenuItem
                  key={sheetColumnTypeId}
                  isFirstItem={index === 0}
                  isLastItem={index === (allSheetColumnTypesIds.length - 1)}
                  logo={sheetColumnType.id === currentColumnType.id ? CHECKMARK : null}
                  onClick={() => closeContextMenuOnClick(() => dispatch(updateSheetColumn(columnId, { typeId: currentColumnType.id })))}
                  text={currentColumnType.name}
                  />)})}
            </ContextMenuItem>
            <ContextMenuItem
              testId="SheetColumnContextMenuColumnSettings"
              text="Column Settings" 
              onClick={() => closeContextMenuOnClick(() => {
                dispatch(updateActiveTab('SETTINGS'))
            })}/>
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
