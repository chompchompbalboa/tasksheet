//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useDispatch } from 'react-redux'

import ContextMenu from '@app/bundles/ContextMenu/ContextMenu'
import ContextMenuDivider from '@app/bundles/ContextMenu/ContextMenuDivider'
import ContextMenuItem from '@app/bundles/ContextMenu/ContextMenuItem'

import { ISheet, ISheetRow } from '@app/state/sheet/types'
import { 
  deleteSheetRow
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
        onClick={() => closeOnClick(() => dispatch(deleteSheetRow(sheetId, rowId)))}/>
      <ContextMenuDivider />
    </ContextMenu>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetRowContextMenuProps {
  sheetId: ISheet['id']
  rowId: ISheetRow['id']
  closeContextMenu(): void
  contextMenuLeft: number
  contextMenuTop: number
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetRowContextMenu
