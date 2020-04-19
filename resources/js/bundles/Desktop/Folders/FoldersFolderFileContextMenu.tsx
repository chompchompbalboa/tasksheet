//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'

import { IFilePermission, IFolderClipboardUpdates } from '@/state/folder/types'

import ContextMenu from '@desktop/ContextMenu/ContextMenu'
import ContextMenuDivider from '@desktop/ContextMenu/ContextMenuDivider'
import ContextMenuItem from '@desktop/ContextMenu/ContextMenuItem'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const FileContextMenu = ({
  deleteFile,
  fileId,
  closeContextMenu,
  contextMenuLeft,
  contextMenuTop,
  handleFileOpen,
  role,
  setIsRenaming,
  updateClipboard
}: FileContextMenuProps) => {

  const closeOnClick = (andCallThis: (...args: any) => void) => {
    closeContextMenu()
    andCallThis()
  }

  return (
    <ContextMenu
      testId="FileContextMenu"
      closeContextMenu={closeContextMenu}
      contextMenuTop={contextMenuTop}
      contextMenuLeft={contextMenuLeft}>
      <ContextMenuItem 
        isFirstItem
        text="Open"
        onClick={() => handleFileOpen(fileId)}/>
      {['OWNER', 'ADMINISTRATOR'].includes(role) &&
        <>
          <ContextMenuDivider />
          <ContextMenuItem 
            text="Cut"
            onClick={() => closeOnClick(() => updateClipboard({ itemId: fileId, folderOrFile: 'FILE', cutOrCopy: 'CUT' }))}/>
          <ContextMenuItem 
            text="Rename"
            onClick={() => closeOnClick(() => setIsRenaming(true))}/>
        </>
      }
      {['OWNER'].includes(role) &&
        <>
          <ContextMenuDivider />
          <ContextMenuItem 
            isLastItem
            text="Delete"
            onClick={() => closeOnClick(() => deleteFile(fileId))}/>
        </>
      }
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
  handleFileOpen(nextActiveTabId: string): void
  contextMenuTop: number
  deleteFile(fileId: string): void
  role: IFilePermission['role']
  setIsRenaming(isRenaming: boolean): void
  updateClipboard(updates: IFolderClipboardUpdates): void
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default FileContextMenu
