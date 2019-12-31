//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'

import { ISheet } from '@/state/sheet/types'

import SheetColumnContextMenu from '@desktop/Sheet/SheetColumnContextMenu'
import SheetRowContextMenu from '@desktop/Sheet/SheetRowContextMenu'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetContextMenus = ({
  sheetId,
  isContextMenuVisible,
  contextMenuType,
  contextMenuIndex,
  contextMenuId,
  contextMenuTop,
  contextMenuLeft,
  contextMenuRight,
  closeContextMenu
}: SheetContextMenusProps) => {
  return (
  <Container>
    {isContextMenuVisible && contextMenuType === 'COLUMN' &&
      <SheetColumnContextMenu
        sheetId={sheetId}
        columnIndex={contextMenuIndex}
        columnId={contextMenuId}
        contextMenuTop={contextMenuTop}
        contextMenuLeft={contextMenuLeft}
        contextMenuRight={contextMenuRight}
        closeContextMenu={() => closeContextMenu()}/>}
    {isContextMenuVisible && contextMenuType === 'ROW' &&
      <SheetRowContextMenu
        sheetId={sheetId}
        rowId={contextMenuId}
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
  sheetId: ISheet['id']
  isContextMenuVisible: boolean
  contextMenuType: string
  contextMenuId: string
  contextMenuIndex?: number
  contextMenuTop: number
  contextMenuLeft: number
  contextMenuRight: number
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
