//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'

import { IFolderClipboardUpdates } from '@app/state/folder/types'
import { IModalUpdates } from '@app/state/modal/types'

import ContextMenu from '@app/bundles/ContextMenu/ContextMenu'
import ContextMenuDivider from '@app/bundles/ContextMenu/ContextMenuDivider'
import ContextMenuItem from '@app/bundles/ContextMenu/ContextMenuItem'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const FolderContextMenu = ({
  createFolder,
  createSheet,
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
      <ContextMenuItem text="Copy" />
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
        text="Delete" />
    </ContextMenu>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface FolderContextMenuProps {
  createFolder(folderId: string): void
  createSheet(folderId: string): void
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
