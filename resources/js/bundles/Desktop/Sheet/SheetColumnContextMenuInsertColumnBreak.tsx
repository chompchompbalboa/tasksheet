//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useDispatch } from 'react-redux'

import { useSheetEditingPermissions } from '@/hooks'

import { ISheet} from '@/state/sheet/types'
import { createMessengerMessage } from '@/state/messenger/actions'
import { createSheetColumnBreak } from '@/state/sheet/actions'

import ContextMenuItem from '@desktop/ContextMenu/ContextMenuItem'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
export const SheetColumnContextMenuInsertColumnBreak = ({
  sheetId,
  columnIndex,
  closeContextMenu
}: ISheetColumnContextMenuInsertColumnBreakProps) => {
  
  // Redux
  const dispatch = useDispatch()

  // Permissions
  const {
    userHasPermissionToEditSheet,
    userHasPermissionToEditSheetErrorMessage
  } = useSheetEditingPermissions(sheetId)

  // Handle Create Column Break
  const handleCreateColumnBreak = () => {
    closeContextMenu()
    if(!userHasPermissionToEditSheet) {
      dispatch(createMessengerMessage(userHasPermissionToEditSheetErrorMessage))
    }
    else {
      dispatch(createSheetColumnBreak(sheetId, columnIndex))
    }
  }

  return (
    <ContextMenuItem 
      testId="SheetColumnContextMenuInsertColumnBreak"
      text="Insert Column Break" 
      onClick={handleCreateColumnBreak}/>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
export interface ISheetColumnContextMenuInsertColumnBreakProps {
  sheetId: ISheet['id']
  columnIndex: number
  closeContextMenu(): void
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetColumnContextMenuInsertColumnBreak
