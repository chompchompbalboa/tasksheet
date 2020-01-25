//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { IAppState } from '@/state'

import FoldersPropertiesFolderPermissions from '@desktop/Folders/FoldersPropertiesFolderPermissions'
import FoldersPropertiesFilePermissions from '@desktop/Folders/FoldersPropertiesFilePermissions'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const FoldersProperties = () => {
  
  // Redux
  const activeFolderPath = useSelector((state: IAppState) => state.folder.activeFolderPath)
  const activeFileId = useSelector((state: IAppState) => state.folder.activeFileId)
  const allFolders = useSelector((state: IAppState) => state.folder.allFolders)
  const allFiles = useSelector((state: IAppState) => state.folder.allFiles)
  
  // Variables
  const activeFolder = allFolders[activeFolderPath[activeFolderPath.length - 1]]
  const activeFile = activeFileId && allFiles[activeFileId]
  
  return (
    <Container>
      <Wrapper>
        <FolderName>
          {activeFile && activeFile.name || activeFolder.name}
        </FolderName>
        <Properties>
          {activeFile
            ? <FoldersPropertiesFilePermissions fileId={activeFile.id}/>
            : <FoldersPropertiesFolderPermissions folderId={activeFolder.id}/>
          }
        </Properties>
      </Wrapper>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  flex-grow: 1;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Wrapper = styled.div`
  width: 65%;
`

const FolderName = styled.div`
  font-weight: bold;
  font-size: 1rem;
  text-align: center;
`

const Properties = styled.div`
  padding-top: 0.5rem;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default FoldersProperties
