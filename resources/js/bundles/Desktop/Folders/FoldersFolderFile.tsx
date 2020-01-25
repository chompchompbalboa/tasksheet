//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { MouseEvent, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { SHEET, SHEET_VIEW } from '@/assets/icons'

import { IAppState } from '@/state'
import { 
  IFile,
  IFolderClipboardUpdates, 
} from '@/state/folder/types'
import { 
  deleteFile,
  updateActiveFileId,
  updateClipboard, 
  updateFile,
} from '@/state/folder/actions'

import AutosizeInput from 'react-input-autosize'
import FileContextMenu from '@desktop/ContextMenu/FileContextMenu'
import Icon from '@/components/Icon'
//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const FoldersFolderFile = ({
  file,
  handleFileOpen
}: IFoldersFolderFile) => {
  
  // Redux
  const dispatch = useDispatch()
  const activeFileId = useSelector((state: IAppState) => state.folder.activeFileId)
  
  // State
  const [ isContextMenuVisible, setIsContextMenuVisible ] = useState(false)
  const [ contextMenuTop, setContextMenuTop ] = useState(null)
  const [ contextMenuLeft, setContextMenuLeft ] = useState(null)
  const [ isRenaming, setIsRenaming ] = useState(file.name === null)
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
  
  // Handle Context Menu
  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault()
    setIsContextMenuVisible(true)
    setContextMenuTop(e.clientY)
    setContextMenuLeft(e.clientX)
  }

  // Handle Keypress While Input Is Focused
  const handleKeypressWhileInputIsFocused = (e: KeyboardEvent) => {
    if(e.key === "Enter") {
      handleAutosizeInputBlur()
    }
  }

  return (
    <>
      <Container
        isHighlighted={activeFileId === file.id}
        isPreventedFromSelecting={file.isPreventedFromSelecting}
        isRenaming={isRenaming}
        onContextMenu={e => handleContextMenu(e)}
        onClick={() => dispatch(updateActiveFileId(file.id))}
        onDoubleClick={() => { if(!file.isPreventedFromSelecting) { handleFileOpen(file.id) }}}>
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
      {isContextMenuVisible && 
        <FileContextMenu
          fileId={file.id}
          closeContextMenu={() => setIsContextMenuVisible(false)}
          contextMenuLeft={contextMenuLeft}
          contextMenuTop={contextMenuTop}
          deleteFile={(fileId: IFile['id']) => dispatch(deleteFile(file.id))}
          updateClipboard={(updates: IFolderClipboardUpdates) => dispatch(updateClipboard(updates))}
          setIsRenaming={setIsRenaming}/>
      }
    </>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface IFoldersFolderFile {
  file: IFile
  handleFileOpen(nextActiveTabId: string): void
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  justify-content: flex-start;
  cursor: ${ ({ isPreventedFromSelecting }: ContainerProps ) => isPreventedFromSelecting ? 'not-allowed' : 'default' };
  width: 100%;
  padding: 0.125rem 0 0.125rem 0.325rem;
  display: flex;
  align-items: center;
  background-color: ${ ({ isHighlighted }: ContainerProps ) => isHighlighted ? 'rgb(235, 235, 235)' : 'transparent' };
  color: rgb(20, 20, 20);
  &:hover {
    background-color: ${ ({ isRenaming }: ContainerProps ) => isRenaming ? 'transparent' : 'rgb(235, 235, 235)' };
  }
`
interface ContainerProps {
  isHighlighted: boolean
  isRenaming: boolean
  isPreventedFromSelecting: boolean
}

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
export default FoldersFolderFile
