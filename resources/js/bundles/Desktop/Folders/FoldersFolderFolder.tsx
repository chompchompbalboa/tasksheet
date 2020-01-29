//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { MouseEvent, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { SUBITEM_ARROW } from '@/assets/icons'

import { IThunkDispatch } from '@/state/types'
import { 
  IFolder, IFolderUpdates,
  IFolderClipboardUpdates 
} from '@/state/folder/types'
import { 
  createFolder as createFolderAction,
  deleteFolder as deleteFolderAction,
  pasteFromClipboard as pasteFromClipboardAction,
  updateClipboard as updateClipboardAction,  
  updateFolder as updateFolderAction,
} from '@/state/folder/actions' 
import { IModalUpdates } from '@/state/modal/types'
import { updateModal as updateModalAction } from '@/state/modal/actions'
import { createSheet as createSheetAction } from '@/state/sheet/actions' 

import AutosizeInput from 'react-input-autosize'
import FolderContextMenu from '@desktop/ContextMenu/FolderContextMenu'
import Icon from '@/components/Icon'

//-----------------------------------------------------------------------------
// Redux
//-----------------------------------------------------------------------------
const mapDispatchToProps = (dispatch: IThunkDispatch) => ({
  createFolder: (folderId: string) => dispatch(createFolderAction(folderId)),
  createSheet: (folderId: string) => dispatch(createSheetAction(folderId)),
  deleteFolder: (folderId: string) => dispatch(deleteFolderAction(folderId)),
  pasteFromClipboard: (folderId: string) => dispatch(pasteFromClipboardAction(folderId)),
  updateModal: (updates: IModalUpdates) => dispatch(updateModalAction(updates)),
  updateClipboard: (updates: IFolderClipboardUpdates) => dispatch(updateClipboardAction(updates)),
  updateFolder: (folderId: string, updates: IFolderUpdates) => dispatch(updateFolderAction(folderId, updates))
})

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const FoldersFolderFolder = ({
  activeFolderPath,
  createFolder,
  createSheet,
  deleteFolder,
  folder,
  level,
  pasteFromClipboard,
  updateActiveFolderPath,
  updateModal,
  updateClipboard,
  updateFolder
}: FoldersFolderFolderProps) => {
  
  const [ contextMenuTop, setContextMenuTop ] = useState(null)
  const [ contextMenuLeft, setContextMenuLeft ] = useState(null)
  const [ folderName, setFolderName ] = useState(folder.name)
  const [ isContextMenuVisible, setIsContextMenuVisible ] = useState(false)
  const [ isRenaming, setIsRenaming ] = useState(folder.name === null)
  
  useEffect(() => {
    if(isRenaming) {
      addEventListener('keypress', blurAutosizeInputOnEnter)
    }
    else {
      removeEventListener('keypress', blurAutosizeInputOnEnter)
    }
    return () => removeEventListener('keypress', blurAutosizeInputOnEnter)
  })
  
  const handleAutosizeInputBlur = () => {
    if(folderName !== null) {
      updateFolder(folder.id, { name: folderName })
    }
    setIsRenaming(false)
  }
  
  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault()
    setIsContextMenuVisible(true)
    setContextMenuTop(e.clientY)
    setContextMenuLeft(e.clientX)
  }

  const blurAutosizeInputOnEnter = (e: KeyboardEvent) => {
    if(e.key === "Enter") {
      handleAutosizeInputBlur()
    }
  }

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
          <Icon icon={SUBITEM_ARROW} size="0.8rem"/>
        </IconContainer>
      </Container>
      {isContextMenuVisible && 
        <FolderContextMenu
          folderId={folder.id}
          closeContextMenu={() => setIsContextMenuVisible(false)}
          contextMenuLeft={contextMenuLeft}
          contextMenuTop={contextMenuTop}
          createFolder={createFolder}
          createSheet={createSheet}
          deleteFolder={deleteFolder}
          pasteFromClipboard={pasteFromClipboard}
          role={folder.role}
          setIsRenaming={setIsRenaming}
          updateModal={updateModal}
          updateClipboard={updateClipboard}/>
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
  createSheet?(folderId: string): void
  deleteFolder?(folderId: string): void
  folder: IFolder
  level: number
  pasteFromClipboard(folderId: string): void
  updateActiveFolderPath(level: number, nextActiveFolderId: string): void
  updateModal(updates: IModalUpdates): void
  updateClipboard(updates: IFolderClipboardUpdates): void
  updateFolder?(folderId: string, updates: IFolderUpdates): void
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
  background-color: ${ ({ isHighlighted }: ContainerProps ) => isHighlighted ? 'rgb(235, 235, 235)' : 'transparent' };
  color: rgb(20, 20, 20);
  &:hover {
    background-color: ${ ({ isRenaming }: ContainerProps ) => isRenaming ? 'transparent' : 'rgb(235, 235, 235)' };
  }
`
interface ContainerProps {
  isHighlighted: boolean
  isRenaming: boolean
}

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
  margin-right: ${ ({ isFile }: IconProps) => isFile ? '0.25rem' : '0' };
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
