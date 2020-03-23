//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { useSheetEditingPermissions } from '@/hooks'

import { IAppState } from '@/state'
import { ISheet, ISheetRow } from '@/state/sheet/types'
import { 
  createMessengerMessage
} from '@/state/messenger/actions'
import { 
  deleteSheetRows
} from '@/state/sheet/actions'

import ContextMenuItem from '@desktop/ContextMenu/ContextMenuItem'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
export const SheetRowContextMenu = ({
  sheetId,
  sheetRowId,
  closeOnClick,
}: ISheetRowContextMenuProps) => {

  // Redux
  const dispatch = useDispatch()
  const sheetSelectionRangeStartRowId = useSelector((state: IAppState) => state.sheet.allSheets && state.sheet.allSheets[sheetId] && state.sheet.allSheets[sheetId].selections && state.sheet.allSheets[sheetId].selections.rangeStartRowId )
  const sheetSelectionRangeEndRowId = useSelector((state: IAppState) => state.sheet.allSheets && state.sheet.allSheets[sheetId] && state.sheet.allSheets[sheetId].selections && state.sheet.allSheets[sheetId].selections.rangeEndRowId )
  
  // Permissions
  const { 
    userHasPermissionToEditSheet,
    userHasPermissionToEditSheetErrorMessage
  } = useSheetEditingPermissions(sheetId)

  // Handle Delete
  const handleDelete = () => {
    if(!userHasPermissionToEditSheet) {
      dispatch(createMessengerMessage(userHasPermissionToEditSheetErrorMessage))
    }
    else {
      closeOnClick(() => dispatch(deleteSheetRows(sheetId, sheetRowId)))
    }
  }
  
  // Are Multiple Rows Selected?
  const isMultipleRowsSelected = sheetSelectionRangeEndRowId !== null && sheetSelectionRangeStartRowId !== sheetSelectionRangeEndRowId
  
  return (
    <ContextMenuItem 
      testId="SheetRowContextMenuDeleteRows"
      text={"Delete " + (isMultipleRowsSelected ? "rows" : "row")}
      onClick={handleDelete}/>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
export interface ISheetRowContextMenuProps {
  sheetId: ISheet['id']
  sheetRowId: ISheetRow['id']
  closeOnClick(...args: any): void
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetRowContextMenu
