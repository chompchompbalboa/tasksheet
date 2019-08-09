//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'

import { Sheet, SheetActiveUpdates, SheetUpdates, SheetColumn, SheetColumns, SheetColumnUpdates } from '@app/state/sheet/types'

import SheetColumnContextMenu from '@app/bundles/ContextMenu/SheetColumnContextMenu'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetContextMenus = ({
  sheetId,
  isContextMenuVisible,
  columns,
  contextMenuType,
  contextMenuId,
  contextMenuTop,
  contextMenuLeft,
  closeContextMenu,
  sheetVisibleColumns,
  updateSheet,
  updateSheetActive,
  updateSheetColumn
}: SheetContextMenusProps) => {
  return (
  <Container>
    {isContextMenuVisible && contextMenuType === 'COLUMN' &&
      <SheetColumnContextMenu
        sheetId={sheetId}
        columnId={contextMenuId}
        columns={columns}
        contextMenuTop={contextMenuTop}
        contextMenuLeft={contextMenuLeft}
        closeContextMenu={() => closeContextMenu()}
        sheetVisibleColumns={sheetVisibleColumns}
        updateSheet={updateSheet}
        updateSheetActive={updateSheetActive}
        updateSheetColumn={updateSheetColumn}/>}
  </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetContextMenusProps {
  sheetId: Sheet['id']
  isContextMenuVisible: boolean
  columns: SheetColumns
  contextMenuType: string
  contextMenuId: string
  contextMenuTop: number
  contextMenuLeft: number
  closeContextMenu(): void
  sheetVisibleColumns: SheetColumn['id'][]
  updateSheet(sheetId: string, updates: SheetUpdates): void
  updateSheetActive(updates: SheetActiveUpdates): void
  updateSheetColumn(columnId: string, updates: SheetColumnUpdates): void
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div``

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetContextMenus
