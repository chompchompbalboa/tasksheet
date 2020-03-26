//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useDispatch } from 'react-redux'

import { useSheetEditingPermissions } from '@/hooks'

import { ISheet } from '@/state/sheet/types'
import { createMessengerMessage } from '@/state/messenger/actions'
import { hideSheetColumns } from '@/state/sheet/actions'

import ContextMenuItem from '@desktop/ContextMenu/ContextMenuItem'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
export const SheetColumnContextMenuHideColumns = ({
  sheetId,
  closeContextMenu
}: ISheetColumnContextMenuHideColumnsProps) => {
  
  // Redux
  const dispatch = useDispatch()


  // Permissions
  const {
    userHasPermissionToEditSheet,
    userHasPermissionToEditSheetErrorMessage
  } = useSheetEditingPermissions(sheetId)
  
  // Handle hiding a column
  const handleColumnHide = () => {
    closeContextMenu()
    if(!userHasPermissionToEditSheet) {
      dispatch(createMessengerMessage(userHasPermissionToEditSheetErrorMessage))
    }
    else {
      dispatch(hideSheetColumns(sheetId))
    }
  }

  return (
    <ContextMenuItem 
      testId="SheetColumnContextMenuHideColumns"
      text="Hide" 
      onClick={handleColumnHide}/>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
export interface ISheetColumnContextMenuHideColumnsProps {
  sheetId: ISheet['id']
  closeContextMenu(): void
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetColumnContextMenuHideColumns
