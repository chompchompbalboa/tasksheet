//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { MouseEvent, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { FILE_SHEET, FILE_SHEET_VIEW } from '@app/assets/icons'

import { File } from '@app/state/folder/types'

import FileContextMenu from '@app/bundles/ContextMenu/FileContextMenu'
import Icon from '@/components/Icon'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const FoldersFolderFile = ({
  activeFileId,
  file,
  handleFileOpen,
  updateActiveFileId,
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
          <Icon icon={file.type === 'SHEET' ? FILE_SHEET : FILE_SHEET_VIEW} size="0.85rem"/>
        </IconContainer>
        <NameContainer>
          {file.name}
        </NameContainer>
      </Container>
      {isContextMenuVisible && 
        <FileContextMenu
          closeContextMenu={() => setIsContextMenuVisible(false)}
          contextMenuLeft={contextMenuLeft}
          contextMenuTop={contextMenuTop}/>
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
  background-color: ${ ({ isHighlighted }: ContainerProps ) => isHighlighted ? 'rgb(220, 220, 220)' : 'transparent' };
  &:hover {
    background-color: rgb(220, 220, 220);
  }
`

const NameContainer = styled.div`
  padding: 0.05rem;
`

const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: ${ ({ isFile }: IconProps) => isFile ? '0.25rem' : '0' };
  color: rgb(50, 50, 50);
`
interface IconProps {
  isFile?: boolean
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default FoldersFolderFile
