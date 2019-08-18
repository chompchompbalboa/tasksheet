//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { MouseEvent, useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { FILE_SHEET, FILE_SHEET_VIEW } from '@app/assets/icons'

import { ThunkDispatch } from '@app/state/types'
import { ClipboardUpdates, File, FileUpdates } from '@app/state/folder/types'
import { 
  updateClipboard as updateClipboardAction, 
  updateFile as updateFileAction,
} from '@app/state/folder/actions'

import AutosizeInput from 'react-input-autosize'
import FileContextMenu from '@app/bundles/ContextMenu/FileContextMenu'
import Icon from '@/components/Icon'

//-----------------------------------------------------------------------------
// Redux
//-----------------------------------------------------------------------------
const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  updateClipboard: (updates: ClipboardUpdates) => dispatch(updateClipboardAction(updates)),
  updateFile: (fileId: string, updates: FileUpdates) => dispatch(updateFileAction(fileId, updates))
})

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const FoldersFolderFile = ({
  activeFileId,
  file,
  handleFileOpen,
  updateActiveFileId,
  updateClipboard,
  updateFile
}: FoldersFolderFileProps) => {
  
  const container = useRef(null)
  useEffect(() => {
    if(activeFileId === file.id) {
      addEventListener('mouseup', checkForClickOutside)
    }
    else {
      removeEventListener('mouseup', checkForClickOutside)
    }
    return () => {
      removeEventListener('mouseup', checkForClickOutside)
    }
  }, [ activeFileId ])
  const checkForClickOutside = (e: Event) => {
    if(!container.current.contains(e.target)) {
      updateActiveFileId(null)
    }
  }
  
  const [ isContextMenuVisible, setIsContextMenuVisible ] = useState(false)
  const [ contextMenuTop, setContextMenuTop ] = useState(null)
  const [ contextMenuLeft, setContextMenuLeft ] = useState(null)
  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault()
    setIsContextMenuVisible(true)
    setContextMenuTop(e.clientY)
    setContextMenuLeft(e.clientX)
  }

  const [ isRenaming, setIsRenaming ] = useState(file.name === null)
  const [ fileName, setFileName ] = useState(file.name)
  const handleAutosizeInputBlur = () => {
    if(fileName !== null) {
      setIsRenaming(false)
      updateFile(file.id, { name: fileName })
    }
  }

  const blurAutosizeInputOnEnter = (e: KeyboardEvent) => {
    if(e.key === "Enter") {
      handleAutosizeInputBlur()
    }
  }
  useEffect(() => {
    if(isRenaming) {
      addEventListener('keypress', blurAutosizeInputOnEnter)
    }
    else {
      removeEventListener('keypress', blurAutosizeInputOnEnter)
    }
    return () => removeEventListener('keypress', blurAutosizeInputOnEnter)
  })

  return (
    <>
      <Container
        ref={container}
        isHighlighted={file.id === activeFileId}
        onClick={() => updateActiveFileId(file.id)}
        onContextMenu={e => handleContextMenu(e)}
        onDoubleClick={() => handleFileOpen(file.id)}>
        <IconContainer
          isFile>
          <Icon icon={file.type === 'SHEET' ? FILE_SHEET : FILE_SHEET_VIEW} size="0.8rem"/>
        </IconContainer>
        {!isRenaming
          ? <NameContainer>
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
          updateClipboard={updateClipboard}
          setIsRenaming={setIsRenaming}/>
      }
    </>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface FoldersFolderFileProps {
  activeFileId: string
  file: File
  handleFileOpen(nextActiveTabId: string): void
  updateActiveFileId(nextActiveFileId: string): void
  updateClipboard(updates: ClipboardUpdates): void
  updateFile(fileId: string, updates: FileUpdates): void
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
interface ContainerProps {
  isHighlighted?: boolean
}

const Container = styled.div`
  justify-content: flex-start;
  cursor: default;
  width: 100%;
  padding: 0.125rem 0 0.125rem 0.325rem;
  display: flex;
  align-items: center;
  background-color: ${ ({ isHighlighted }: ContainerProps ) => isHighlighted ? 'rgb(235, 235, 235)' : 'transparent' };
  color: rgb(20, 20, 20);
  &:hover {
    background-color: rgb(235, 235, 235);
  }
`

const NameContainer = styled.div`
  padding: 0.05rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

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
export default connect(
  null,
  mapDispatchToProps
)(FoldersFolderFile)
