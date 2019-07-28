//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useState } from 'react'
import styled from 'styled-components'

import { Files, Folders } from '@app/state/folder/types'
//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const FoldersHeader = ({
  activeFileId,
  activeFolderId,
  files,
  folders
}: FoldersHeaderProps) => {

  const activeItem = activeFileId !== null ? files[activeFileId] : folders[activeFolderId]

  const [ name, setName ] = useState(activeItem && activeItem.name)
  return (
    <Container>
      {activeItem && 
        <StyledInput
          onChange={e => setName(e.target.value)}
          value={name}/>}
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface FoldersHeaderProps {
  activeFileId: string
  activeFolderId: string
  files: Files
  folders: Folders
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  height: 100%;
  background-color: rgb(240, 240, 240);
`

const StyledInput = styled.input`
  outline: none;
  background-color: transparent;
  font-size: 1rem;
  border-radius: 3x;
`
//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default FoldersHeader
