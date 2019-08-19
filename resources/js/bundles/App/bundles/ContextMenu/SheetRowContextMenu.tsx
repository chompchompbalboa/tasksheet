//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useDispatch } from 'react-redux'

import ContextMenu from '@app/bundles/ContextMenu/ContextMenu'
import ContextMenuDivider from '@app/bundles/ContextMenu/ContextMenuDivider'
import ContextMenuItem from '@app/bundles/ContextMenu/ContextMenuItem'

import { Sheet, SheetRow } from '@app/state/sheet/types'
import { 
  deleteSheetRow as deleteSheetRowAction
} from '@app/state/sheet/actions'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetRowContextMenu = ({
  sheetId,
  rowId,
  closeContextMenu,
  contextMenuLeft,
  contextMenuTop,
}: SheetRowContextMenuProps) => {
  
  const dispatch = useDispatch()
  const deleteSheetRow = () => dispatch(deleteSheetRowAction(sheetId, rowId))

  const closeOnClick = (andCallThis: (...args: any) => void) => {
    closeContextMenu()
    andCallThis()
  }

  return (
    <ContextMenu
      closeContextMenu={closeContextMenu}
      contextMenuTop={contextMenuTop}
      contextMenuLeft={contextMenuLeft}>
      <ContextMenuItem 
        text="Delete Row"
        onClick={() => closeOnClick(() => deleteSheetRow())}/>
      <ContextMenuDivider />
    </ContextMenu>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetRowContextMenuProps {
  sheetId: Sheet['id']
  rowId: SheetRow['id']
  closeContextMenu(): void
  contextMenuLeft: number
  contextMenuTop: number
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetRowContextMenu
