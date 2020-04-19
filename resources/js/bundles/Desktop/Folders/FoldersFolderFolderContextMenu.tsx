//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { IAppState } from '@/state'

import { 
  createFolder,
  deleteFolder,
  pasteFromClipboard,
  updateClipboard
} from '@/state/folder/actions' 
import { updateModal } from '@/state/modal/actions'
import { createSheet } from '@/state/sheet/actions' 

import ContextMenu from '@desktop/ContextMenu/ContextMenu'
import ContextMenuDivider from '@desktop/ContextMenu/ContextMenuDivider'
import ContextMenuItem from '@desktop/ContextMenu/ContextMenuItem'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const FolderContextMenu = ({
  folderId,
  closeContextMenu,
  contextMenuLeft,
  contextMenuTop,
  setIsRenaming
}: FolderContextMenuProps) => {

  // Redux
  const dispatch = useDispatch()
  const folderClipboard = useSelector((state: IAppState) => state.folder.clipboard)

  // Close On Click
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
        onClick={() => closeOnClick(() => dispatch(updateClipboard({ 
          itemId: folderId, 
          folderOrFile: 'FOLDER', 
          cutOrCopy: 'CUT' 
        })))}/>
      {folderClipboard.itemId !== null &&
        <ContextMenuItem
          text="Paste"
          onClick={() => closeOnClick(() => dispatch(pasteFromClipboard(folderId)))}/>
      }
      <ContextMenuDivider />
      <ContextMenuItem 
        text="New Sheet"
        onClick={() => closeOnClick(() => dispatch(createSheet(folderId)))}/>
      <ContextMenuItem 
        text="Upload CSV"
        onClick={() => closeOnClick(() => dispatch(updateModal({ 
          activeModal: 'CREATE_SHEET_FROM_CSV', 
          createSheetFolderId: folderId 
        })))}/>
      <ContextMenuDivider />
      <ContextMenuItem 
        text="New Folder"
        onClick={() => closeOnClick(() => dispatch(createFolder(folderId)))}/>
      <ContextMenuDivider />
      <ContextMenuItem 
        text="Rename"
        onClick={() => closeOnClick(() => setIsRenaming(true))}/>
      <ContextMenuDivider />
      <ContextMenuItem 
        isLastItem
        text="Delete" 
        onClick={() => closeOnClick(() => dispatch(deleteFolder(folderId)))}/>
    </ContextMenu>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface FolderContextMenuProps {
  folderId: string
  closeContextMenu(): void
  contextMenuLeft: number
  contextMenuTop: number
  setIsRenaming?(isRenaming: boolean): void
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default FolderContextMenu
