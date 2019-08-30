//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'

import { ClipboardUpdates } from '@app/state/folder/types'

import ContextMenu from '@app/bundles/ContextMenu/ContextMenu'
import ContextMenuDivider from '@app/bundles/ContextMenu/ContextMenuDivider'
import ContextMenuItem from '@app/bundles/ContextMenu/ContextMenuItem'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const FileContextMenu = ({
  deleteFile,
  fileId,
  closeContextMenu,
  contextMenuLeft,
  contextMenuTop,
  setIsRenaming,
  updateClipboard
}: FileContextMenuProps) => {

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
        isFirstItem
        text="Open" />
      <ContextMenuDivider />
      <ContextMenuItem 
        text="Cut"
        onClick={() => closeOnClick(() => updateClipboard({ itemId: fileId, folderOrFile: 'FILE', cutOrCopy: 'CUT' }))}/>
      <ContextMenuItem text="Copy"/>
      <ContextMenuDivider />
      <ContextMenuItem 
        text="Rename"
        onClick={() => closeOnClick(() => setIsRenaming(true))}/>
      <ContextMenuDivider />
      <ContextMenuItem 
        isLastItem
        text="Delete"
        onClick={() => closeOnClick(() => deleteFile(fileId))}/>
    </ContextMenu>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface FileContextMenuProps {
  fileId: string
  closeContextMenu(): void
  contextMenuLeft: number
  contextMenuTop: number
  deleteFile(fileId: string): void
  setIsRenaming(isRenaming: boolean): void
  updateClipboard(updates: ClipboardUpdates): void
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default FileContextMenu
