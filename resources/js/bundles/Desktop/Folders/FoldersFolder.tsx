//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'

import { IAppState } from '@/state'

import { updateActiveFolderPath } from '@/state/folder/actions'

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
  const dispatch = useDispatch()
  const activeFolderPath = useSelector((state: IAppState) => state.folder.activeFolderPath)
  const allFolders = useSelector((state: IAppState) => state.folder.allFolders)
  const allFiles = useSelector((state: IAppState) => state.folder.allFiles)
  const rootFolderIds = useSelector((state: IAppState) => state.folder.rootFolderIds)
  const userFileIds = useSelector((state: IAppState) => state.folder.userFileIds)

  const folder = allFolders[folderId]
  const folderIds: string[] = folderId !== "ROOT" ? folder.folders : rootFolderIds
  const fileIds: string[] = folderId !== "ROOT" ? folder.files : userFileIds
  
  return (
    <Container>
      <ItemsContainer>
        {folderIds.map(folderId => {
          const folderItem = allFolders[folderId]
          return (
            <FoldersFolderFolder
              key={folderId}
              activeFolderPath={activeFolderPath}
              folder={folderItem}
              level={level}
              updateActiveFolderPath={(level: number, nextActiveFolderId: string) => dispatch(updateActiveFolderPath(level, nextActiveFolderId))}/>
          )
        })}
        {fileIds.map(fileId => {
          const fileItem = allFiles[fileId]
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
  folderId: string
  handleFileOpen(nextActiveTabId: string): void
  level: number
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
  min-height: 100%;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default FoldersFolder
