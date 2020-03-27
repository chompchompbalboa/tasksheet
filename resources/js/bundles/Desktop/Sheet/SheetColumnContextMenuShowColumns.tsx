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
import { showSheetColumn } from '@/state/sheet/actions'

import ContextMenuItem from '@desktop/ContextMenu/ContextMenuItem'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
export const SheetColumnContextMenu = ({
  sheetId,
  columnIndex,
  closeContextMenu
}: ISheetColumnContextMenuProps) => {
  
  // Redux
  const dispatch = useDispatch()
  const allSheetColumns = useSelector((state: IAppState) => state.sheet.allSheetColumns)
  const sheetColumns = useSelector((state: IAppState) => state.sheet.allSheets[sheetId].columns)
  const sheetActiveSheetViewId = useSelector((state: IAppState) => state.sheet.allSheets[sheetId].activeSheetViewId)
  const sheetViewVisibleColumns = useSelector((state: IAppState) => state.sheet.allSheetViews[sheetActiveSheetViewId] && state.sheet.allSheetViews[sheetActiveSheetViewId].visibleColumns)

  // Permissions
  const {
    userHasPermissionToEditSheet,
    userHasPermissionToEditSheetErrorMessage
  } = useSheetEditingPermissions(sheetId)

  // Handle showing columns
  const handleColumnShow = (columnId: ISheetColumn['id']) => {
    closeContextMenu()
    if(!userHasPermissionToEditSheet) {
      dispatch(createMessengerMessage(userHasPermissionToEditSheetErrorMessage))
    }
    else {
      dispatch(showSheetColumn(sheetId, columnIndex, columnId))
    }
  }
  
  // Hidden sheet columns
  const hiddenSheetColumns = sheetColumns.filter(columnId => !sheetViewVisibleColumns.includes(columnId))

  if(hiddenSheetColumns.length > 0) {
    return (
      <ContextMenuItem 
        text="Show">
        {hiddenSheetColumns.map(columnId => {
          const column = allSheetColumns[columnId]
          return (
            <ContextMenuItem
              key={column.id}
              text={column.name}
              onClick={() => handleColumnShow(column.id)}/>
          )
        })}
      </ContextMenuItem>
    )
  }
  return null
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
export interface ISheetColumnContextMenuProps {
  sheetId: ISheet['id']
  columnIndex: number
  closeContextMenu(): void
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetColumnContextMenu
