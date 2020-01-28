//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { SHEET, SHEET_VIEW } from '@/assets/icons'

import { 
  IFile,
} from '@/state/folder/types'
import { 
  updateFile
} from '@/state/folder/actions'

import AutosizeInput from 'react-input-autosize'
import Icon from '@/components/Icon'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const FoldersFolderFileInfo = ({
  file,
  isRenaming,
  level
}: IFoldersFolderFileInfo) => {
  
  // Redux
  const dispatch = useDispatch()
  
  // State
  const [ fileName, setFileName ] = useState(file.name)
  
  // Listen for keypress while the input is active
  useEffect(() => {
    if(isRenaming) {
      addEventListener('keypress', handleKeypressWhileInputIsFocused)
    }
    else {
      removeEventListener('keypress', handleKeypressWhileInputIsFocused)
    }
    return () => removeEventListener('keypress', handleKeypressWhileInputIsFocused)
  })
  
  // Handle Autosize Input Blur
  const handleAutosizeInputBlur = () => {
    if(fileName !== null) {
      dispatch(updateFile(file.id, { name: fileName }))
    }
  }
  
  // Handle Keypress While Input Is Focused
  const handleKeypressWhileInputIsFocused = (e: KeyboardEvent) => {
    if(e.key === "Enter") {
      handleAutosizeInputBlur()
    }
  }

  return (
    <Container>
      <IconContainer
        isFile>
        <Icon icon={file.type === 'SHEET' ? SHEET : SHEET_VIEW} size='0.95rem'/>
      </IconContainer>
      {!isRenaming
        ? <NameContainer
            isPreventedFromSelecting={file.isPreventedFromSelecting}>
            {file.name}
          </NameContainer>
        : <AutosizeInput
            autoFocus
            placeholder="Name..."
            onChange={e => setFileName(e.target.value)}
            onBlur={() => handleAutosizeInputBlur()}
            value={fileName === null ? "" : fileName}
            inputStyle={{
              margin: '0',
              padding: '0.05rem',
              paddingLeft: '1px',
              width: '100%',
              height: '100%',
              border: 'none',
              borderRadius: '5px',
              backgroundColor: 'transparent',
              color: 'black',
              outline: 'none',
              fontFamily: 'inherit',
              fontSize: 'inherit',
              fontWeight: 'inherit'}}/>
      }
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface IFoldersFolderFileInfo {
  file: IFile
  isRenaming: boolean
  level: number
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 0.125rem 0 0.125rem 0.325rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`

const NameContainer = styled.div`
  padding: 0.05rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${ ({ isPreventedFromSelecting }: NameContainerProps ) => isPreventedFromSelecting ? 'rgb(150, 150, 150)' : null};
`
interface NameContainerProps {
  isPreventedFromSelecting: boolean
}

const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: ${ ({ isFile }: IconProps) => isFile ? '0.4rem' : '0' };
  margin-left: ${ ({ isFile }: IconProps) => isFile ? '0.2rem' : '0' };
`
interface IconProps {
  isFile?: boolean
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default FoldersFolderFileInfo
