//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'

import { FILE_SHEET, FILE_SHEET_VIEW } from '@app/assets/icons'

import { File } from '@app/state/folder/types'

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

  return (
    <Container
      ref={container}
      isHighlighted={file.id === activeFileId}
      onClick={() => updateActiveFileId(file.id)}
      onDoubleClick={() => handleFileOpen(file.id)}>
      <IconContainer
        isFile>
        <Icon icon={file.type === 'SHEET' ? FILE_SHEET : FILE_SHEET_VIEW} size="0.85rem"/>
      </IconContainer>
      <NameContainer>
        {file.name}
      </NameContainer>
    </Container>
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

const NameContainer = styled.div``

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
