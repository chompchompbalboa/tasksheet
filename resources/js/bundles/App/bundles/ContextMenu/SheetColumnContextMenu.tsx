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
  closeContextMenu,
  contextMenuLeft,
  contextMenuTop,
}: SheetColumnContextMenuProps) => {

  return (
    <ContextMenu
      closeContextMenu={closeContextMenu}
      contextMenuTop={contextMenuTop}
      contextMenuLeft={contextMenuLeft}>
      <ContextMenuItem text="Split" />
      <ContextMenuItem text="Split Unique Values" />
      <ContextMenuItem text="Quick Split">
        <ContextMenuItem text="Equals"/>
        <ContextMenuItem text="Greater Than"/>
        <ContextMenuItem text="Less Than"/>
        <ContextMenuItem text="Between"/>
      </ContextMenuItem>
      <ContextMenuDivider />
      <ContextMenuItem text="Sort A to Z" />
      <ContextMenuItem text="Sort Z to A" />
      <ContextMenuDivider />
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
  closeContextMenu(): void
  contextMenuLeft: number
  contextMenuTop: number
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetColumnContextMenu
