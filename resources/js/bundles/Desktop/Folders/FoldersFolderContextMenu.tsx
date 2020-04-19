//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { IAppState } from '@/state'

import { 
  createFolder,
  pasteFromClipboard
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
  contextMenuTop
}: FolderContextMenuProps) => {

  // Redux
  const dispatch = useDispatch()
  const folderClipboard = useSelector((state: IAppState) => state.folder.clipboard)
  const userId = useSelector((state: IAppState) => state.user.id)

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
      {folderClipboard.itemId !== null &&
        <>
          <ContextMenuItem
            text="Paste"
            onClick={folderId === 'ROOT'
              ? () => closeOnClick(() => dispatch(pasteFromClipboard(null)))
              : () => closeOnClick(() => dispatch(pasteFromClipboard(folderId)))
            }/>
          <ContextMenuDivider />
        </>
      }
      <ContextMenuItem 
        text="New Sheet"
        onClick={folderId === 'ROOT'
          ? () => closeOnClick(() => dispatch(createSheet(null, null, false, userId)))
          : () => closeOnClick(() => dispatch(createSheet(folderId)))
        }/>
      {folderId !== 'ROOT' &&
        <>
          <ContextMenuItem 
            text="Upload CSV"
            onClick={() => closeOnClick(() => dispatch(updateModal({ 
              activeModal: 'CREATE_SHEET_FROM_CSV', 
              createSheetFolderId: folderId 
            })))}/>
          <ContextMenuDivider />
        </>
      }
      <ContextMenuItem 
        text="New Folder"
        onClick={() => closeOnClick(() => dispatch(createFolder(folderId === 'ROOT' ? null : folderId)))}/>
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
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default FolderContextMenu
