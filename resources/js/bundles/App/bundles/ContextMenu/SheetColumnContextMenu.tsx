//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'

import { SheetColumnUpdates } from '@app/state/sheet/types'

import ContextMenu from '@app/bundles/ContextMenu/ContextMenu'
import ContextMenuDivider from '@app/bundles/ContextMenu/ContextMenuDivider'
import ContextMenuItem from '@app/bundles/ContextMenu/ContextMenuItem'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetColumnContextMenu = ({
  columnId,
  closeContextMenu,
  contextMenuLeft,
  contextMenuTop,
  updateSheetColumn
}: SheetColumnContextMenuProps) => {

  const closeOnClick = (andCallThis: (...args: any) => void) => {
    closeContextMenu()
    setTimeout(() => andCallThis(), 10)
  }

  return (
    <ContextMenu
      closeContextMenu={closeContextMenu}
      contextMenuTop={contextMenuTop}
      contextMenuLeft={contextMenuLeft}>
      <ContextMenuItem text="Insert Column Before" />
      <ContextMenuItem text="Insert Column After" />
      <ContextMenuItem text="Move" />
      <ContextMenuDivider />
      <ContextMenuItem text="Rename"/>
      <ContextMenuItem text="Type">
        <ContextMenuItem text="String" onClick={() => closeOnClick(() => updateSheetColumn(columnId, { type: 'STRING'}))}/>
        <ContextMenuItem text="Number" onClick={() => closeOnClick(() => updateSheetColumn(columnId, { type: 'NUMBER'}))}/>
        <ContextMenuItem text="Checkbox" onClick={() => closeOnClick(() => updateSheetColumn(columnId, { type: 'BOOLEAN'}))}/>
        <ContextMenuItem text="Date" onClick={() => closeOnClick(() => updateSheetColumn(columnId, { type: 'DATETIME'}))}/>
      </ContextMenuItem>
      <ContextMenuDivider />
      <ContextMenuItem text="Delete">
      </ContextMenuItem>
    </ContextMenu>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetColumnContextMenuProps {
  columnId: string
  closeContextMenu(): void
  contextMenuLeft: number
  contextMenuTop: number
  updateSheetColumn(columnId: string, updates: SheetColumnUpdates): void
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetColumnContextMenu
