//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { MouseEvent, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { SUBITEM_ARROW } from '@app/assets/icons'

import { ThunkDispatch } from '@app/state/types'
import { Folder } from '@app/state/folder/types'
import { 
  createFolder as createFolderAction,
  updateFolder as updateFolderAction, FolderUpdates
} from '@app/state/folder/actions' 

import AutosizeInput from 'react-input-autosize'
import FolderContextMenu from '@app/bundles/ContextMenu/FolderContextMenu'
import Icon from '@/components/Icon'

//-----------------------------------------------------------------------------
// Redux
//-----------------------------------------------------------------------------
const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  createFolder: (folderId: string) => dispatch(createFolderAction(folderId)),
  updateFolder: (folderId: string, updates: FolderUpdates) => dispatch(updateFolderAction(folderId, updates))
})

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const FoldersFolderFolder = ({
  activeFolderPath,
  createFolder,
  folder,
  level,
  updateActiveFolderPath,
  updateFolder
}: FoldersFolderFolderProps) => {
  
  const [ isContextMenuVisible, setIsContextMenuVisible ] = useState(false)
  const [ contextMenuTop, setContextMenuTop ] = useState(null)
  const [ contextMenuLeft, setContextMenuLeft ] = useState(null)
  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault()
    setIsContextMenuVisible(true)
    setContextMenuTop(e.clientY)
    setContextMenuLeft(e.clientX)
    updateActiveFolderPath(level, folder.id)
  }

  const [ isRenaming, setIsRenaming ] = useState(folder.name === null)
  const [ folderName, setFolderName ] = useState(folder.name)
  const handleAutosizeInputBlur = () => {
    if(folderName !== null) {
      setIsRenaming(false)
      updateFolder(folder.id, { name: folderName })
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
        isHighlighted={activeFolderPath.includes(folder.id)}
        isRenaming={isRenaming}
        onClick={!isRenaming ? () => updateActiveFolderPath(level, folder.id) : null}
        onContextMenu={e => handleContextMenu(e)}>
        {!isRenaming
          ? <NameContainer>
              {folder.name}
            </NameContainer>
          : <AutosizeInput
              autoFocus
              placeholder="Name..."
              onChange={e => setFolderName(e.target.value)}
              onBlur={() => handleAutosizeInputBlur()}
              value={folderName === null ? "" : folderName}
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
        <IconContainer>
          <Icon icon={SUBITEM_ARROW} size="0.85rem"/>
        </IconContainer>
      </Container>
      {isContextMenuVisible && 
        <FolderContextMenu
          folderId={folder.id}
          closeContextMenu={() => setIsContextMenuVisible(false)}
          contextMenuLeft={contextMenuLeft}
          contextMenuTop={contextMenuTop}
          createFolder={createFolder}
          setIsRenaming={setIsRenaming}/>
      }
    </>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface FoldersFolderFolderProps {
  activeFolderPath: string[]
  createFolder?(folderId: string): void
  folder: Folder
  level: number
  updateActiveFolderPath(level: number, nextActiveFolderId: string): void
  updateFolder?(folderId: string, updates: FolderUpdates): void
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------

const Container = styled.div`
  justify-content: space-between;
  cursor: default;
  width: 100%;
  padding: 0.125rem 0 0.125rem 0.325rem;
  display: flex;
  align-items: center;
  background-color: ${ ({ isHighlighted }: ContainerProps ) => isHighlighted ? 'rgb(220, 220, 220)' : 'transparent' };
  &:hover {
    background-color: ${ ({ isRenaming }: ContainerProps ) => isRenaming ? 'transparent' : 'rgb(220, 220, 220)' };
  }
`
interface ContainerProps {
  isHighlighted: boolean
  isRenaming: boolean
}

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
export default connect(
  null,
  mapDispatchToProps
)(FoldersFolderFolder)
