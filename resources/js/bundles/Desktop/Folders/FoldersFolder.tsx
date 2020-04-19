//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { MouseEvent, useState } from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'

import { IAppState } from '@/state'

import FoldersFolderContextMenu from '@desktop/Folders/FoldersFolderContextMenu'
import FoldersFolderFile from '@desktop/Folders/FoldersFolderFile'
import FoldersFolderFolder from '@desktop/Folders/FoldersFolderFolder'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const FoldersFolder = ({
  folderId,
  handleFileOpen,
  level
}: FoldersFolderProps) => {

  // Redux
  const allFolders = useSelector((state: IAppState) => state.folder.allFolders)
  const userFolderIds = useSelector((state: IAppState) => state.folder.userFolderIds)
  const userFileIds = useSelector((state: IAppState) => state.folder.userFileIds)

  // State
  const [ isContextMenuVisible, setIsContextMenuVisible ] = useState(false)
  const [ contextMenuTop, setContextMenuTop ] = useState(null)
  const [ contextMenuLeft, setContextMenuLeft ] = useState(null)

  // Local Variables
  const folder = allFolders[folderId]
  const folderIds: string[] = folderId !== "ROOT" ? folder.folders : userFolderIds
  const fileIds: string[] = folderId !== "ROOT" ? folder.files : userFileIds
  
  // Handle Context Menu
  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault()
    if((folder && ['OWNER', 'EDITOR'].includes(folder.role)) || folderId === 'ROOT') {
      setIsContextMenuVisible(true)
      setContextMenuTop(e.clientY)
      setContextMenuLeft(e.clientX)
    }
  }

  return (
    <Container>
      <ItemsContainer>
        {folderIds.map(folderId => {
          return (
            <FoldersFolderFolder
              key={folderId}
              folderId={folderId}
              level={level}/>
          )
        })}
        {fileIds.map(fileId => {
          return (
            <FoldersFolderFile
              key={fileId}
              fileId={fileId}
              handleFileOpen={handleFileOpen}
              level={level}/>
          )
        })}
      </ItemsContainer>
      <ContextMenuContainer
        onContextMenu={e => handleContextMenu(e)}>
        {isContextMenuVisible && 
            <FoldersFolderContextMenu
              folderId={folderId}
              closeContextMenu={() => setIsContextMenuVisible(false)}
              contextMenuLeft={contextMenuLeft}
              contextMenuTop={contextMenuTop}/>
        }
      </ContextMenuContainer>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface FoldersFolderProps {
  folderId: string
  handleFileOpen(nextActiveTabId: string): void
  level: number
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  width: 13rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-right: 1px solid rgb(175, 175, 175);
`

const ItemsContainer = styled.div`
  width: 100%;
`

const ContextMenuContainer = styled.div`
  min-height: 5rem;
  flex-grow: 1;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default FoldersFolder
