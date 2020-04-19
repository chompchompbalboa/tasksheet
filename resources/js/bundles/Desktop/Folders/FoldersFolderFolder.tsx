//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { MouseEvent, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { SUBITEM_ARROW } from '@/assets/icons'

import { IAppState } from '@/state'
import { IFolder } from '@/state/folder/types'

import { 
  updateActiveFolderPath,
  updateFolder 
} from '@/state/folder/actions' 

import AutosizeInput from 'react-input-autosize'
import FoldersFolderFolderContextMenu from '@desktop/Folders/FoldersFolderFolderContextMenu'
import Icon from '@/components/Icon'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const FoldersFolderFolder = ({
  folderId,
  level
}: FoldersFolderFolderProps) => {

  // Redux
  const dispatch = useDispatch()
  const activeFolderPath = useSelector((state: IAppState) => state.folder.activeFolderPath)
  const folder = useSelector((state: IAppState) => state.folder.allFolders && state.folder.allFolders[folderId])
  
  // State
  const [ contextMenuTop, setContextMenuTop ] = useState(null)
  const [ contextMenuLeft, setContextMenuLeft ] = useState(null)
  const [ folderName, setFolderName ] = useState(folder.name)
  const [ isContextMenuVisible, setIsContextMenuVisible ] = useState(false)
  const [ isRenaming, setIsRenaming ] = useState(folder.name === null)
  
  // Add event listeners when folder is renaming
  useEffect(() => {
    if(isRenaming) { addEventListener('keypress', blurAutosizeInputOnEnter) }
    else { removeEventListener('keypress', blurAutosizeInputOnEnter) }
    return () => removeEventListener('keypress', blurAutosizeInputOnEnter)
  }, [ folderName, isRenaming ])

  // Blur Autosize Input On Enter
  const blurAutosizeInputOnEnter = (e: KeyboardEvent) => {
    if(e.key === "Enter") {
      handleAutosizeInputBlur()
    }
  }
  
  // Handle Autosize Input Blur
  const handleAutosizeInputBlur = () => {
    if(folderName !== null) {
      dispatch(updateFolder(folderId, { name: folderName }))
    }
    setIsRenaming(false)
  }
  
  // Handle Context Menu
  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault()
    if((folder && ['OWNER', 'EDITOR'].includes(folder.role)) || folderId === 'ROOT') {
      setIsContextMenuVisible(true)
      setContextMenuTop(e.clientY)
      setContextMenuLeft(e.clientX)
    }
  }

  return (
    <>
      <Container
        isHighlighted={activeFolderPath.includes(folder.id)}
        isRenaming={isRenaming}
        onClick={!isRenaming ? () => dispatch(updateActiveFolderPath(level, folder.id)) : null}
        onContextMenu={e => handleContextMenu(e)}>
        {!isRenaming
          ? <NameContainer>
              {folder.name}
            </NameContainer>
          : <AutosizeInput
              autoFocus
              placeholder="Name..."
              onChange={e => setFolderName(e.target.value)}
              onBlur={handleAutosizeInputBlur}
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
        <FoldersFolderFolderContextMenu
          folderId={folderId}
          closeContextMenu={() => setIsContextMenuVisible(false)}
          contextMenuLeft={contextMenuLeft}
          contextMenuTop={contextMenuTop}
          setIsRenaming={setIsRenaming}/>
      }
    </>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface FoldersFolderFolderProps {
  folderId: IFolder['id']
  level: number
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
export default FoldersFolderFolder
