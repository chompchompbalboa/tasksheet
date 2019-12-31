//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'

import { IFiles, IFolders } from '@/state/folder/types'

import FoldersFolderFile from '@desktop/Folders/FoldersFolderFile'
import FoldersFolderFolder from '@desktop/Folders/FoldersFolderFolder'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const FoldersFolder = ({
  activeFolderPath,
  files,
  folderId,
  folders,
  handleFileOpen,
  level,
  rootFolderIds,
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
              handleFileOpen={handleFileOpen}
              file={fileItem}/>
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
  activeFolderPath: string[]
  files: IFiles
  folderId: string
  folders: IFolders
  handleFileOpen(nextActiveTabId: string): void
  level: number
  rootFolderIds: string[]
  updateActiveFolderPath(level: number, nextActiveFolderId: string): void
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  height: 100%;
  width: 13rem;
  border-right: 1px solid rgb(175, 175, 175);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

const ItemsContainer = styled.div`
  width: 100%;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default FoldersFolder
