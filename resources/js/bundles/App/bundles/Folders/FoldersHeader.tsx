//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { Files, Folders } from '@app/state/folder/types'

import AutosizeInput from 'react-input-autosize'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const FoldersHeader = ({
  activeFileId,
  activeFolderPath,
  files,
  folders,
  isSavingNewFile,
  onFileSave
}: FoldersHeaderProps) => {

  const activeItem = activeFileId !== null ? files[activeFileId] : folders[activeFolderPath[activeFolderPath.length - 1]]

  const styledInput = useRef(null)
  const [ name, setName ] = useState(activeItem ? activeItem.name : 'Home')

  useEffect(() => {
    !isSavingNewFile && setName(activeItem ? activeItem.name : 'Home')
  }, [ activeFileId, activeFolderPath ])

  useEffect(() => {
    isSavingNewFile && setName('')
  }, [ isSavingNewFile ])

  const handleSaveButtonClick = () => {
    onFileSave(name)
  }

  return (
    <Container>
      <StyledInput
        ref={styledInput}
        disabled={!isSavingNewFile && typeof activeItem === 'undefined'}
        placeholder="Name...          "
        placeholderIsMinWidth
        onChange={e => setName(e.target.value)}
        onFocus={() => styledInput.current.select()}
        value={name}
        inputStyle={{
          marginRight: '0.5rem',
          padding: '0.125rem',
          height: '100%',
          minWidth: '4rem',
          border: isSavingNewFile ? '1px solid rgb(220, 220, 220)' : 'none',
          borderRadius: '5px',
          backgroundColor: isSavingNewFile ? 'white' : 'transparent',
          color: 'black',
          outline: 'none',
          fontFamily: 'inherit',
          fontSize: 'inherit',
          fontWeight: 'inherit'}}/>
      {isSavingNewFile && 
        <SaveButton
          onClick={() => handleSaveButtonClick()}>
          Save
        </SaveButton>
      }
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface FoldersHeaderProps {
  activeFileId: string
  activeFolderPath: string[]
  files: Files
  folders: Folders
  isSavingNewFile: boolean
  onFileSave: (newFileName: string) => void
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  height: 100%;
  background-color: rgb(240, 240, 240);
  display: flex;
  align-items: center;
`

const StyledInput = styled(AutosizeInput)`
  outline: none;
  background-color: transparent;
  font-size: 1rem;
  border-radius: 3px;
`

const SaveButton = styled.div`
  cursor: pointer;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  border-radius: 3px;
  background-color: rgb(210, 210, 210);
  color: rgb(80, 80, 80);
  transition: all 0.05s;
  &:hover {
    background-color: rgb(0, 120, 0);
    color: rgb(240, 240, 240);
  }
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default FoldersHeader
