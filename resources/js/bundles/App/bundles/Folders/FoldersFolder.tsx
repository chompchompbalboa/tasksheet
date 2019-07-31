//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'

import { Files, Folders } from '@app/state/folder/types'

import FoldersFolderFile from '@app/bundles/Folders/FoldersFolderFile'
import FoldersFolderFolder from '@app/bundles/Folders/FoldersFolderFolder'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const FoldersFolder = ({
  activeFileId,
  activeFolderPath,
  files,
  folderId,
  folders,
  handleFileOpen,
  level,
  rootFolderIds,
  updateActiveFileId,
  updateActiveFolderPath
}: FoldersFolderProps) => {


  const folder = folders[folderId]
  const folderIds: string[] = folderId !== "ROOT" ? folder.folders : rootFolderIds
  const fileIds: string[] = folderId !== "ROOT" ? folder.files : []
  return (
    <Container>
      <ItemsContainer>
        {folderIds.map(folderId => {
          const folderItem = folders[folderId]
          return (
            <FoldersFolderFolder
              key={folderId}
              activeFolderPath={activeFolderPath}
              folder={folderItem}
              level={level}
              updateActiveFolderPath={updateActiveFolderPath}/>
          )
        })}
        {fileIds.map(fileId => {
          const fileItem = files[fileId]
          return (
            <FoldersFolderFile
              key={fileId}
              activeFileId={activeFileId}
              handleFileOpen={handleFileOpen}
              file={fileItem}
              updateActiveFileId={updateActiveFileId}/>
          )
        })}
      </ItemsContainer>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface FoldersFolderProps {
  activeFileId: string
  activeFolderPath: string[]
  files: Files
  folderId: string
  folders: Folders
  handleFileOpen(nextActiveTabId: string): void
  level: number
  rootFolderIds: string[]
  updateActiveFileId(nextActiveFileId: string): void
  updateActiveFolderPath(level: number, nextActiveFolderId: string): void
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  height: 100%;
  width: 13rem;
  border-right: 1px solid rgb(220, 220, 220);
  display: flex;
  flex-direction: column;
`

const ItemsContainer = styled.div`
  width: 100%;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default FoldersFolder
