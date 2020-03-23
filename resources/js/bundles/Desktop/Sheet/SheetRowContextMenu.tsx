//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'

import { ISheet, ISheetRow } from '@/state/sheet/types'

import ContextMenu from '@desktop/ContextMenu/ContextMenu'
import ContextMenuDivider from '@desktop/ContextMenu/ContextMenuDivider'
import SheetRowContextMenuCreateRows from '@desktop/Sheet/SheetRowContextMenuCreateRows'
import SheetRowContextMenuDeleteRows from '@desktop/Sheet/SheetRowContextMenuDeleteRows'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
export const SheetRowContextMenu = ({
  sheetId,
  rowId,
  closeContextMenu,
  contextMenuLeft,
  contextMenuTop,
}: ISheetRowContextMenuProps) => {

  // Close the context menu before handling a click
  const closeOnClick = (thenCallThis: (...args: any) => void) => {
    closeContextMenu()
    thenCallThis()
  }
  
  return (
    <ContextMenu
      testId="SheetRowContextMenu"
      closeContextMenu={closeContextMenu}
      contextMenuTop={contextMenuTop}
      contextMenuLeft={contextMenuLeft}>
      <SheetRowContextMenuCreateRows
        testId="SheetRowContextMenuCreateRowsAbove"
        sheetId={sheetId}
        sheetRowId={rowId}
        aboveOrBelow='ABOVE'
        closeOnClick={closeOnClick}/>
      <SheetRowContextMenuCreateRows
        testId="SheetRowContextMenuCreateRowsBelow"
        sheetId={sheetId}
        sheetRowId={rowId}
        aboveOrBelow='BELOW'
        closeOnClick={closeOnClick}/>
      <ContextMenuDivider />
      <SheetRowContextMenuDeleteRows 
        sheetId={sheetId}
        sheetRowId={rowId}
        closeOnClick={closeOnClick}/>
    </ContextMenu>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
export interface ISheetRowContextMenuProps {
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
