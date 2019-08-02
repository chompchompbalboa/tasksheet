//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'

import SheetColumnContextMenu from '@app/bundles/ContextMenu/SheetColumnContextMenu'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetContextMenus = ({
  isContextMenuVisible,
  contextMenuType,
  contextMenuId,
  contextMenuTop,
  contextMenuLeft,
  closeContextMenu
}: SheetContextMenusProps) => {
  return (
  <Container>
    {isContextMenuVisible && contextMenuType === 'COLUMN' &&
      <SheetColumnContextMenu
        columnId={contextMenuId}
        contextMenuTop={contextMenuTop}
        contextMenuLeft={contextMenuLeft}
        closeContextMenu={() => closeContextMenu()}/>}
  </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetContextMenusProps {
  isContextMenuVisible: boolean
  contextMenuType: string
  contextMenuId: string
  contextMenuTop: number
  contextMenuLeft: number
  closeContextMenu(): void
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div``

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetContextMenus
