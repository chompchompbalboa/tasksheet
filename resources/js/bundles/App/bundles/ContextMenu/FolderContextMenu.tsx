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
const FolderContextMenu = ({
  createFolder,
  folderId,
  closeContextMenu,
  contextMenuLeft,
  contextMenuTop,
  pasteFromClipboard,
  updateClipboard,
  setIsRenaming
}: FolderContextMenuProps) => {

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
        text="Cut"
        onClick={() => closeOnClick(() => updateClipboard({ itemId: folderId, folderOrFile: 'FOLDER', cutOrCopy: 'CUT' }))}/>
      <ContextMenuItem text="Copy" />
      <ContextMenuItem 
        text="Paste"
        onClick={() => closeOnClick(() => pasteFromClipboard(folderId))}/>
      <ContextMenuDivider />
      <ContextMenuItem 
        text="New Folder"
        onClick={() => closeOnClick(() => createFolder(folderId))}/>
      <ContextMenuDivider />
      <ContextMenuItem 
        text="Rename"
        onClick={() => closeOnClick(() => setIsRenaming(true))}/>
      <ContextMenuDivider />
      <ContextMenuItem text="Delete" />
    </ContextMenu>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface FolderContextMenuProps {
  createFolder(folderId: string): void
  folderId: string
  closeContextMenu(): void
  contextMenuLeft: number
  contextMenuTop: number
  pasteFromClipboard(folderId: string): void
  setIsRenaming(isRenaming: boolean): void
  updateClipboard(updates: ClipboardUpdates): void
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default FolderContextMenu