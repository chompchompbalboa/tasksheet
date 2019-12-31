//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { IAppState } from '@/state'
import { IFiles, IFolders } from '@/state/folder/types'

import AutosizeInput from 'react-input-autosize'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const FoldersHeader = ({
  activeFolderPath,
  files,
  folders,
  isSavingNewFile,
  onFileSave
}: FoldersHeaderProps) => {

  const activeItem = folders[activeFolderPath[activeFolderPath.length - 1]]

  const userColorPrimary = useSelector((state: IAppState) => state.user.color.primary)

  const styledInput = useRef(null)
  const [ name, setName ] = useState(activeItem.name)

  useEffect(() => {
    !isSavingNewFile && setName(activeItem.name)
  }, [ activeFolderPath ])

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
        disabled={!isSavingNewFile}
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
          saveButtonBackgroundColor={userColorPrimary}
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
  activeFolderPath: string[]
  files: IFiles
  folders: IFolders
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
  font-size: 0.9rem;
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
    background-color: ${ ({ saveButtonBackgroundColor }: SaveButtonProps ) => saveButtonBackgroundColor };
    color: rgb(240, 240, 240);
  }
`
interface SaveButtonProps {
  saveButtonBackgroundColor: string
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default FoldersHeader
