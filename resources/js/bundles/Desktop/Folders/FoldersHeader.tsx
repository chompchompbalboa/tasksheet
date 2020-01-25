//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { IAppState } from '@/state'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const FoldersHeader = () => {
  
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
      {activeFile && activeFile.name || activeFolder.name}
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  font-size: 1rem;
  font-weight: bold;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default FoldersHeader
