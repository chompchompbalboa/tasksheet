//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { IAppState } from '@/state'

import FoldersPropertiesPermissions from '@desktop/Folders/FoldersPropertiesPermissions'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const FoldersProperties = () => {
  
  // Redux
  const activeFolderPath = useSelector((state: IAppState) => state.folder.activeFolderPath)
  const allFolders = useSelector((state: IAppState) => state.folder.allFolders)
  
  // Variables
  const activeFolder = allFolders[activeFolderPath[activeFolderPath.length - 1]]
  
  return (
    <Container>
      <Wrapper>
        <FolderName>
          {activeFolder.name}
        </FolderName>
        <Properties>
          <FoldersPropertiesPermissions
            folderPermissions={activeFolder.permissions}/>
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
