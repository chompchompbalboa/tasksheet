//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { CHECKMARK } from '@/assets/icons'

import { IAppState } from '@/state'
import { 
  ISheet,
  ISheetColumn,
  ISheetCellType
} from '@/state/sheet/types'
import { 
  createSheetGantt,
  updateSheetColumn
} from '@/state/sheet/actions'

import ContextMenu from '@desktop/ContextMenu/ContextMenu'
import ContextMenuDivider from '@desktop/ContextMenu/ContextMenuDivider'
import ContextMenuItem from '@desktop/ContextMenu/ContextMenuItem'
import SheetColumnContextMenuDeleteColumns from '@/bundles/Desktop/Sheet/SheetColumnContextMenuDeleteColumns'
import SheetColumnContextMenuHideColumns from '@/bundles/Desktop/Sheet/SheetColumnContextMenuHideColumns'
import SheetColumnContextMenuInsertColumnBreak from '@/bundles/Desktop/Sheet/SheetColumnContextMenuInsertColumnBreak'
import SheetColumnContextMenuInsertColumns from '@/bundles/Desktop/Sheet/SheetColumnContextMenuInsertColumns'
import SheetColumnContextMenuMoveColumns from '@/bundles/Desktop/Sheet/SheetColumnContextMenuMoveColumns'
import SheetColumnContextMenuRenameColumn from '@/bundles/Desktop/Sheet/SheetColumnContextMenuRenameColumn'
import SheetColumnContextMenuShowColumns from '@/bundles/Desktop/Sheet/SheetColumnContextMenuShowColumns'
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
  const sheetColumn = allSheetColumns[columnId]

  // Cell Types
  const sheetCellTypes: { 
    [sheetCellType: string]: { 
      label: string
      cellType: ISheetCellType
      updateCellType(...args: any): void
    }
  } = {
    STRING: {
      label: 'Text',
      cellType: 'STRING',
      updateCellType:() => dispatch(updateSheetColumn(columnId, { cellType: 'STRING', defaultValue: null }))
    },
    NUMBER: {
      label: 'Number',
      cellType: 'NUMBER',
      updateCellType:() => dispatch(updateSheetColumn(columnId, { cellType: 'NUMBER', defaultValue: null }))
    },
    DATETIME: {
      label: 'Date',
      cellType: 'DATETIME',
      updateCellType:() => dispatch(updateSheetColumn(columnId, { cellType: 'DATETIME', defaultValue: null }))
    },
    BOOLEAN: {
      label: 'Checkbox',
      cellType: 'BOOLEAN',
      updateCellType:() => dispatch(updateSheetColumn(columnId, { cellType: 'BOOLEAN', defaultValue: 'Unchecked' }))
    },
    PHOTOS: {
      label: 'Photos',
      cellType: 'PHOTOS',
      updateCellType:() => dispatch(updateSheetColumn(columnId, { cellType: 'PHOTOS', defaultValue: null }))
    },
    FILES: {
      label: 'Files',
      cellType: 'FILES',
      updateCellType:() => dispatch(updateSheetColumn(columnId, { cellType: 'FILES', defaultValue: null }))
    },
    LABELS: {
      label: 'Labels',
      cellType: 'LABELS',
      updateCellType:() => dispatch(updateSheetColumn(columnId, { cellType: 'LABELS', defaultValue: null }))
    },
    GANTT: {
      label: 'Gantt',
      cellType: 'GANTT',
      updateCellType:() => dispatch(createSheetGantt(sheetId, columnId))
    }
  }
  const sheetCellTypesKeys = Object.keys(sheetCellTypes)

  // Is this is a column break?
  const sheetColumnCellType = columnId === 'COLUMN_BREAK' ? 'COLUMN_BREAK' : sheetColumn.cellType

  // Close the context menu before handling a click
  const closeContextMenuOnClick = (thenCallThis: (...args: any) => void) => {
    closeContextMenu()
    setTimeout(() => thenCallThis(), 10)
  }

  return (
    <ContextMenu
      testId="SheetColumnContextMenu"
      closeContextMenu={closeContextMenu}
      contextMenuTop={contextMenuTop}
      contextMenuLeft={contextMenuLeft}
      contextMenuRight={contextMenuRight}>
      <SheetColumnContextMenuInsertColumns
        sheetId={sheetId}
        closeContextMenu={closeContextMenu}
        columnIndex={columnIndex}/>
      {sheetColumnCellType !== 'COLUMN_BREAK' && 
        <>
          <SheetColumnContextMenuInsertColumnBreak
            sheetId={sheetId}
            columnIndex={columnIndex}
            closeContextMenu={closeContextMenu}/>
          <ContextMenuDivider />
          <SheetColumnContextMenuMoveColumns
            sheetId={sheetId}
            columnId={columnId}
            closeContextMenu={closeContextMenu}/>
          <SheetColumnContextMenuHideColumns
            sheetId={sheetId}
            closeContextMenu={closeContextMenu}/>
          <SheetColumnContextMenuShowColumns 
            sheetId={sheetId}
            columnIndex={columnIndex}
            closeContextMenu={closeContextMenu}/>
          <ContextMenuDivider />
          <SheetColumnContextMenuRenameColumn
            sheetId={sheetId}
            columnId={columnId}
            closeContextMenu={closeContextMenu}/>
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
                  onClick={() => {
                    if(sheetColumnCellType !== currentCellType.cellType) {
                      closeContextMenuOnClick(() => currentCellType.updateCellType())
                    }
                  }}
                  text={currentCellType.label}
                  />)})}
            </ContextMenuItem>
            <SheetColumnContextMenuSettings
              sheetId={sheetId}
              columnId={columnId}/>
          <ContextMenuDivider />
        </>
      }
      <SheetColumnContextMenuDeleteColumns 
        sheetId={sheetId}
        columnId={columnId}
        columnIndex={columnIndex}
        closeContextMenu={closeContextMenu}/>
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
