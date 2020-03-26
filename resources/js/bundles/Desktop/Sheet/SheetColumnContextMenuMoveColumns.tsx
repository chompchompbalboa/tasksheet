//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { useSheetEditingPermissions } from '@/hooks'

import { IAppState } from '@/state'
import { 
  ISheet,
  ISheetColumn
} from '@/state/sheet/types'
import { createMessengerMessage } from '@/state/messenger/actions'
import { moveSheetColumns } from '@/state/sheet/actions'

import ContextMenuItem from '@desktop/ContextMenu/ContextMenuItem'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
export const SheetColumnContextMenuMoveColumns = ({
  sheetId,
  columnId,
  closeContextMenu
}: ISheetColumnContextMenuMoveColumnsProps) => {
  
  // Redux
  const dispatch = useDispatch()
  const allSheetColumns = useSelector((state: IAppState) => state.sheet.allSheetColumns)
  const sheetActiveSheetViewId = useSelector((state: IAppState) => state.sheet.allSheets[sheetId].activeSheetViewId)
  const sheetViewVisibleColumns = useSelector((state: IAppState) => state.sheet.allSheetViews[sheetActiveSheetViewId] && state.sheet.allSheetViews[sheetActiveSheetViewId].visibleColumns)

  // Permissions
  const {
    userHasPermissionToEditSheet,
    userHasPermissionToEditSheetErrorMessage
  } = useSheetEditingPermissions(sheetId)
  
  // Handle moving a column
  const handleColumnMove = (
    moveToColumnIndex: number
  ) => {
    closeContextMenu()
    if(!userHasPermissionToEditSheet) {
      dispatch(createMessengerMessage(userHasPermissionToEditSheetErrorMessage))
    }
    else {
      dispatch(moveSheetColumns(sheetId, columnId, moveToColumnIndex))
    }
  }

  return (
    <ContextMenuItem 
      testId="SheetColumnContextMenuMoveColumns"
      text="Move Before">
      {sheetViewVisibleColumns.map((sheetColumnId, index) => (
        <ContextMenuItem 
          key={sheetColumnId === 'COLUMN_BREAK' ? sheetColumnId + index : sheetColumnId}
          containerBackgroundColor={sheetColumnId === 'COLUMN_BREAK' ? 'rgb(220, 220, 220)' : 'transparent'} 
          containerHoverBackgroundColor={sheetColumnId === 'COLUMN_BREAK' ? 'rgb(190, 190, 190)' : 'rgb(242, 242, 242)'} 
          text={sheetColumnId === 'COLUMN_BREAK' ? '' : allSheetColumns[sheetColumnId].name} 
          onClick={() => handleColumnMove(index)}/>
      ))}
    </ContextMenuItem>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
export interface ISheetColumnContextMenuMoveColumnsProps {
  sheetId: ISheet['id']
  columnId: ISheetColumn['id']
  closeContextMenu(): void
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetColumnContextMenuMoveColumns
