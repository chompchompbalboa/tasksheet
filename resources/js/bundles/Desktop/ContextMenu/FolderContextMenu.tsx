//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'

import { IFolderClipboardUpdates } from '@/state/folder/types'
import { IModalUpdates } from '@/state/modal/types'

import ContextMenu from '@desktop/ContextMenu/ContextMenu'
import ContextMenuDivider from '@desktop/ContextMenu/ContextMenuDivider'
import ContextMenuItem from '@desktop/ContextMenu/ContextMenuItem'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const FolderContextMenu = ({
  createFolder,
  createSheet,
  deleteFolder,
  folderId,
  closeContextMenu,
  contextMenuLeft,
  contextMenuTop,
  pasteFromClipboard,
  updateModal,
  updateClipboard,
  setIsRenaming
}: FolderContextMenuProps) => {

  const closeOnClick = (thenCallThis: (...args: any) => void) => {
    closeContextMenu()
    thenCallThis()
  }

  return (
    <ContextMenu
      testId="FolderContextMenu"
      closeContextMenu={closeContextMenu}
      contextMenuTop={contextMenuTop}
      contextMenuLeft={contextMenuLeft}>
      <ContextMenuItem
        isFirstItem
        text="Cut"
        onClick={() => closeOnClick(() => updateClipboard({ itemId: folderId, folderOrFile: 'FOLDER', cutOrCopy: 'CUT' }))}/>
      <ContextMenuItem
        text="Paste"
        onClick={() => closeOnClick(() => pasteFromClipboard(folderId))}/>
      <ContextMenuDivider />
      <ContextMenuItem 
        text="New Sheet"
        onClick={() => closeOnClick(() => createSheet(folderId))}/>
      <ContextMenuItem 
        text="Upload CSV"
        onClick={() => closeOnClick(() => updateModal({ activeModal: 'CREATE_SHEET_FROM_CSV', createSheetFolderId: folderId }))}/>
      <ContextMenuDivider />
      <ContextMenuItem 
        text="New Folder"
        onClick={() => closeOnClick(() => createFolder(folderId))}/>
      <ContextMenuDivider />
      <ContextMenuItem 
        text="Rename"
        onClick={() => closeOnClick(() => setIsRenaming(true))}/>
      <ContextMenuDivider />
      <ContextMenuItem 
        isLastItem
        text="Delete" 
        onClick={() => closeOnClick(() => deleteFolder(folderId))}/>
    </ContextMenu>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface FolderContextMenuProps {
  createFolder(folderId: string): void
  createSheet(folderId: string): void
  deleteFolder(folderId: string): void
  folderId: string
  closeContextMenu(): void
  contextMenuLeft: number
  contextMenuTop: number
  pasteFromClipboard(folderId: string): void
  setIsRenaming(isRenaming: boolean): void
  updateModal(updates: IModalUpdates): void
  updateClipboard(updates: IFolderClipboardUpdates): void
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default FolderContextMenu
