//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'

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
}: SheetColumnContextMenuProps) => {

  return (
    <ContextMenu
      closeContextMenu={closeContextMenu}
      contextMenuTop={contextMenuTop}
      contextMenuLeft={contextMenuLeft}>
      <ContextMenuItem text="Type">
        <ContextMenuItem text="String"/>
        <ContextMenuItem text="Number"/>
        <ContextMenuItem text="Checkbox"/>
        <ContextMenuItem text="Date"/>
      </ContextMenuItem>
      <ContextMenuDivider />
      <ContextMenuItem text="Move" />
      <ContextMenuItem text="Insert Column Before" />
      <ContextMenuItem text="Insert Column After" />
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
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetColumnContextMenu
