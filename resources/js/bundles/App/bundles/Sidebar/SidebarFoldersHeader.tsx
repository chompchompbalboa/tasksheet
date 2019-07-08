//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useRef, useState} from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { AppState } from '@app/state'
import { updateActiveFolderId as updateActiveFolderIdAction } from '../../state/folder/actions'
import { selectActiveFolderPath, selectFolders } from '@app/state/folder/selectors'
import { Folder, Folders } from '@app/state/folder/types'

//-----------------------------------------------------------------------------
// Redux
//-----------------------------------------------------------------------------
const mapStateToProps = (state: AppState) => ({
  activeFolderPath: selectActiveFolderPath(state),
  folders: selectFolders(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  // @ts-ignore thunk-action
  updateActiveFolderId: (nextActiveFolderId: string) => dispatch(updateActiveFolderIdAction(nextActiveFolderId))
})

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
export const SidebarFoldersHeader = ({
  activeFolder,
  activeFolderPath,
  folders,
  updateActiveFolderId
}: SidebarFoldersHeaderProps) => {

  const dropdown = useRef(null)
  const [ isDropdownVisible, setIsDropdownVisible ] = useState(false)

  useEffect(() => {
    if(isDropdownVisible) {
      window.addEventListener('click', handleClick)
    }
    return () => {
      window.removeEventListener('click', handleClick)
    }
  }, [ isDropdownVisible ])

  const handleClick = (e: Event) => {
    if(!dropdown.current.contains(e.target)) {
      setIsDropdownVisible(false)
    }
  }

  const handleDropdownLinkClick = (nextActiveFolderId: string) => {
    setIsDropdownVisible(false)
    updateActiveFolderId(nextActiveFolderId)
  }

  const dropdownFolders = [ null, ...activeFolderPath ]

  return (
    <Container>
      <Name
        isHome={typeof activeFolder === 'undefined'}
        onClick={() => setIsDropdownVisible(true)}>
        {activeFolder ? activeFolder.name : 'Home'}
      </Name>
      <Dropdown
        ref={dropdown}
        isDropdownVisible={isDropdownVisible && typeof activeFolder !== 'undefined'}>
        {dropdownFolders.map(folderId => (
          <DropdownLink
            key={folderId}
            onClick={() => handleDropdownLinkClick(folderId)}>
            {folderId !== null ? folders[folderId].name : 'Home'}
          </DropdownLink>
        ))}
      </Dropdown>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
export type SidebarFoldersHeaderProps = {
  activeFolder: Folder
  activeFolderPath: string[]
  folders: Folders
  updateActiveFolderId(nextActiveFolderId: string): void
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  position: relative;
  cursor: pointer;
  padding: 0.2rem 0.5rem;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: white;
  white-space: nowrap;
  text-overflow: ellipsis;
`

const Name = styled.h3`
  margin-left: 0.125rem;
  cursor: ${ ({ isHome }: NameProps) => isHome ? 'auto' : 'pointer' };
  &:hover {
    text-decoration: ${ ({ isHome }: NameProps) => isHome ? 'none' : 'underline' };
  }
`
interface NameProps {
  isHome: boolean
}

const Dropdown = styled.div`
  display: ${ ({ isDropdownVisible }: DropdownProps ) => isDropdownVisible ? 'block' : 'none'};
  position: absolute;
  top: 100%;
  left: 0;
  margin-left: 0.4rem;
  background-color: white;
  min-width: 10rem;
  color: black;
  border-radius: 3px;
  font-weight: bold;
  box-shadow: 1px 1px 4px rgb(100, 100, 100);
`
interface DropdownProps {
  isDropdownVisible: boolean
}

const DropdownLink = styled.div`
  width: 100%;
  cursor: pointer;
  padding: 0.2rem 0.5rem;
  &:hover {
    background-color: rgb(220, 220, 220);
  }
`

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SidebarFoldersHeader)
