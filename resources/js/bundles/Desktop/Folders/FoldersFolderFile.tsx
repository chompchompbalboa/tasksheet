//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { MouseEvent, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { IAppState } from '@/state'
import { 
  IFile,
  IFolderClipboardUpdates, 
} from '@/state/folder/types'
import { 
  deleteFile,
  updateActiveFileId,
  updateClipboard, 
} from '@/state/folder/actions'

import FileContextMenu from '@desktop/ContextMenu/FileContextMenu'
import FoldersFolderFileInfo from '@desktop/Folders/FoldersFolderFileInfo'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const FoldersFolderFile = ({
  file,
  handleFileOpen,
  level
}: IFoldersFolderFile) => {
  
  // Redux
  const dispatch = useDispatch()
  const activeFileId = useSelector((state: IAppState) => state.folder.activeFileId)
  const activeFolderPath = useSelector((state: IAppState) => state.folder.activeFolderPath)
  const activeFolderPathOnFileClick = level === 0 ? [] : [ ...activeFolderPath.slice(0, level - 1), file.folderId ]
  
  // State
  const [ isRenaming, setIsRenaming ] = useState(file.name === null)
  const [ isContextMenuVisible, setIsContextMenuVisible ] = useState(false)
  const [ contextMenuTop, setContextMenuTop ] = useState(null)
  const [ contextMenuLeft, setContextMenuLeft ] = useState(null)
  
  // Handle Container Mouse Down
  const handleContainerClick = () => {
    if(activeFileId === file.id) {
      handleFileOpen(file.id)
    }
    else {
      dispatch(updateActiveFileId(file.id, activeFolderPathOnFileClick))
    }
  }
  
  // Handle Context Menu
  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault()
    setIsContextMenuVisible(true)
    setContextMenuTop(e.clientY)
    setContextMenuLeft(e.clientX)
  }
  
  return (
    <>
      <Container
        isHighlighted={activeFileId === file.id}
        isPreventedFromSelecting={file.isPreventedFromSelecting}
        isRenaming={isRenaming}
        onContextMenu={e => handleContextMenu(e)}
        onClick={isRenaming ? null : handleContainerClick}>
      <FoldersFolderFileInfo
        file={file}
        isRenaming={isRenaming}
        setIsRenaming={setIsRenaming}/>
      </Container>
      {isContextMenuVisible && 
        <FileContextMenu
          fileId={file.id}
          closeContextMenu={() => setIsContextMenuVisible(false)}
          contextMenuLeft={contextMenuLeft}
          contextMenuTop={contextMenuTop}
          deleteFile={(fileId: IFile['id']) => dispatch(deleteFile(file.id))}
          handleFileOpen={handleFileOpen}
          role={file.role}
          setIsRenaming={setIsRenaming}
          updateClipboard={(updates: IFolderClipboardUpdates) => dispatch(updateClipboard(updates))}/>
      }
    </>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface IFoldersFolderFile {
  file: IFile
  handleFileOpen(nextActiveTabId: string): void
  level: number
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  cursor: ${ ({ isPreventedFromSelecting }: ContainerProps ) => isPreventedFromSelecting ? 'not-allowed' : 'default' };
  width: 100%;
  background-color: ${ ({ isHighlighted }: ContainerProps ) => isHighlighted ? 'rgb(235, 235, 235)' : 'transparent' };
  color: rgb(20, 20, 20);
  user-select: none;
  &:hover {
    background-color: ${ ({ isRenaming }: ContainerProps ) => isRenaming ? 'transparent' : 'rgb(235, 235, 235)' };
  }
`
interface ContainerProps {
  isHighlighted: boolean
  isRenaming: boolean
  isPreventedFromSelecting: boolean
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default FoldersFolderFile
