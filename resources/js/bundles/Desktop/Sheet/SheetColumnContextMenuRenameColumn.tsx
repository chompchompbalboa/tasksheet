//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useDispatch } from 'react-redux'

import { useSheetEditingPermissions } from '@/hooks'

import { 
  ISheet,
  ISheetColumn
} from '@/state/sheet/types'
import { createMessengerMessage } from '@/state/messenger/actions'
import { 
  updateSheetColumn
} from '@/state/sheet/actions'

import ContextMenuItem from '@desktop/ContextMenu/ContextMenuItem'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
export const SheetColumnContextMenuRenameColumn = ({
  sheetId,
  columnId,
  closeContextMenu
}: ISheetColumnContextMenuRenameColumnProps) => {
  
  // Redux
  const dispatch = useDispatch()

  // Permissions
  const {
    userHasPermissionToEditSheet,
    userHasPermissionToEditSheetErrorMessage
  } = useSheetEditingPermissions(sheetId)
  
  // Handle Column Rename
  const handleColumnRename = () => {
    closeContextMenu()
    if(!userHasPermissionToEditSheet) {
      dispatch(createMessengerMessage(userHasPermissionToEditSheetErrorMessage))
    }
    else {
      dispatch(updateSheetColumn(columnId, { isRenaming: true }, null, true))
    }
  }

  return (
    <ContextMenuItem 
      testId="SheetColumnContextMenuRenameColumn"
      text="Rename"
      onClick={handleColumnRename}/>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
export interface ISheetColumnContextMenuRenameColumnProps {
  sheetId: ISheet['id']
  columnId: ISheetColumn['id']
  closeContextMenu(): void
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetColumnContextMenuRenameColumn
