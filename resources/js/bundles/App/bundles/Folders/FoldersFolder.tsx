//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'

import { FILE_SHEET, SUBITEM_ARROW } from '@app/assets/icons'

import { Files, Folders } from '@app/state/folder/types'

import Icon from '@/components/Icon'

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
      {folderIds.map(folderId => {
        const folderItem = folders[folderId]
        return (
          <Folder
            key={folderId}
            isHighlighted={activeFolderPath.includes(folderItem.id)}
            onClick={() => updateActiveFolderPath(level, folderItem.id)}>
            <FolderItemName>
              {folderItem.name}
            </FolderItemName>
            <FolderItemIcon>
              <Icon icon={SUBITEM_ARROW} />
            </FolderItemIcon>
          </Folder>
        )
      })}
      {fileIds.map(fileId => {
        const fileItem = files[fileId]
        return (
          <File
            key={fileId}
            onClick={() => handleFileOpen(fileItem.id)}>
            <FolderItemIcon
              isFile>
              <Icon icon={FILE_SHEET} size="0.85rem"/>
            </FolderItemIcon>
            <FolderItemName>
              {fileItem.name}
            </FolderItemName>
          </File>
        )
      })}
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface FoldersFolderProps {
  activeFolderPath: string[]
  files: Files
  folderId: string
  folders: Folders
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
  border-right: 1px solid rgb(220, 220, 220);
`

const FolderItem = styled.div`
  cursor: default;
  width: 100%;
  padding: 0.125rem 0 0.125rem 0.25rem;
  display: flex;
  align-items: center;
  &:hover {
    background-color: rgb(220, 220, 220);
  }
`

const Folder = styled(FolderItem)`
  justify-content: space-between;
  background-color: ${ ({ isHighlighted }: FolderProps ) => isHighlighted ? 'rgb(220, 220, 220)' : 'transparent' };
`
interface FolderProps {
  isHighlighted: boolean
}

const File = styled(FolderItem)`
  justify-content: flex-start;
`

const FolderItemName = styled.div``

const FolderItemIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: ${ ({ isFile }: FolderItemIconProps) => isFile ? '0.25rem' : '0' };
  color: rgb(50, 50, 50);
`
interface FolderItemIconProps {
  isFile?: boolean
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default FoldersFolder
