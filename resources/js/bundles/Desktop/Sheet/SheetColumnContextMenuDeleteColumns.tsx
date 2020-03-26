//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { useSheetEditingPermissions } from '@/hooks'

import { IAppState } from '@/state'
import { 
  ISheet,
  ISheetColumn,
} from '@/state/sheet/types'
import { createMessengerMessage } from '@/state/messenger/actions'
import { 
  deleteSheetColumn,
  deleteSheetColumnBreak,
} from '@/state/sheet/actions'

import ContextMenuItem from '@desktop/ContextMenu/ContextMenuItem'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
export const SheetColumnContextMenuDeleteColumns = ({
  sheetId,
  columnId,
  columnIndex,
  closeContextMenu,
}: ISheetColumnContextMenuDeleteColumnsProps) => {
  
  // Redux
  const dispatch = useDispatch()
  const sheetSelections = useSelector((state: IAppState) => state.sheet.allSheets[sheetId]?.selections)

  // Permissions
  const {
    userHasPermissionToEditSheet,
    userHasPermissionToEditSheetErrorMessage
  } = useSheetEditingPermissions(sheetId)

  // Are Multiple Columns Selected?
  const isMultipleColumnsSelected = 
    sheetSelections.rangeColumnIds.size > 1 
    && sheetSelections.rangeColumnIds.has(columnId)

  // Get Context Menu Item Text
  const getContextMenuItemText = () => {
    if(columnId === 'COLUMN_BREAK') {
      return "Delete Column Break"
    }
    else {
      return isMultipleColumnsSelected
        ? "Delete " + sheetSelections.rangeColumnIds.size + " Columns"
        : "Delete Column"
    }
  }

  // On Delete Click
  const handleColumnDelete = () => {
    closeContextMenu()
    if(!userHasPermissionToEditSheet) {
      dispatch(createMessengerMessage(userHasPermissionToEditSheetErrorMessage))
    }
    else {
      columnId === 'COLUMN_BREAK'
        ? dispatch(deleteSheetColumnBreak(sheetId, columnIndex))
        : dispatch(deleteSheetColumn(sheetId, columnId))
    }
  }

  return (
    <ContextMenuItem 
      testId="SheetColumnContextMenuDeleteColumns"
      isLastItem
      text={getContextMenuItemText()}
      onClick={handleColumnDelete}>
    </ContextMenuItem>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
export interface ISheetColumnContextMenuDeleteColumnsProps {
  sheetId: ISheet['id']
  columnId: ISheetColumn['id']
  columnIndex: number
  closeContextMenu(): void
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetColumnContextMenuDeleteColumns
