//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { CHEVRON_DOWN } from '@/assets/icons'

import { IAppState } from '@/state'
import {
  openFileInNewTab,
  updateActiveTab 
} from '@/state/tab/actions'

import Icon from '@/components/Icon'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const TabsFiles = () => {

  // Refs
  const filesDropdown = useRef(null)

  // Redux
  const dispatch = useDispatch()
  const activeTab = useSelector((state: IAppState) => state.tab.activeTab)
  const activeFile = useSelector((state: IAppState) => state.folder.files && state.folder.files[activeTab] )
  const allFiles = useSelector((state: IAppState) => state.folder.files )
  const fileIds = useSelector((state: IAppState) => state.tab.tabs)
  const userColorPrimary = useSelector((state: IAppState) => state.user.color.primary)

  // Local state
  const [ isFilesDropdownVisible, setIsFilesDropdownVisible ] = useState(false)
  const [ localActiveFileId, setLocalActiveFileId ] = useState(activeFile.id)
  const [ localFileIds, setLocalFileIds ] = useState(fileIds)

  // Add mousedown listener to close the files dropdown on click outside
  useEffect(() => {
    isFilesDropdownVisible
      ? addEventListener('mousedown', closeFilesDropdownOnClickOutside)
      : removeEventListener('mousedown', closeFilesDropdownOnClickOutside)
    return () => removeEventListener('mousedown', closeFilesDropdownOnClickOutside)
  }, [ isFilesDropdownVisible ])

  // Close Tabs Dropdown on Click Outside
  const closeFilesDropdownOnClickOutside = (e: any) => {
    if(!filesDropdown.current.contains(e.target)) {
      setIsFilesDropdownVisible(false)
    }
  }

  // Handle file open
  const handleFileOpen = (nextActiveFileId: string) => {
    setLocalActiveFileId(nextActiveFileId)
    setIsFilesDropdownVisible(false)
    fileIds.includes(nextActiveFileId)
      ? setTimeout(() => dispatch(updateActiveTab(nextActiveFileId)), 10)
      : !['FOLDERS', 'SETTINGS'].includes(nextActiveFileId)
        ? (
            setLocalFileIds([ ...localFileIds, nextActiveFileId]),
            setTimeout(() => dispatch(openFileInNewTab(nextActiveFileId)), 10)
          )
        : (
            setLocalActiveFileId(nextActiveFileId),
            setTimeout(() => dispatch(updateActiveTab(nextActiveFileId)), 10)
          )
  }

  // Render
  return (
    <Container>
      <ActiveFile
        onClick={() => setIsFilesDropdownVisible(true)}>
        <ActiveFileName>
          {activeFile.name}
        </ActiveFileName>
        <Icon icon={CHEVRON_DOWN}/>
      </ActiveFile>
      <FilesDropdown
        ref={filesDropdown}
        isVisible={isFilesDropdownVisible}>
        {localFileIds.map((fileId) => (
          <File
            key={fileId}
            isActiveFile={localActiveFileId === fileId}
            onClick={() => handleFileOpen(fileId)}
            userColorPrimary={userColorPrimary}>
            {allFiles[fileId].name}
          </File>
        ))}
      </FilesDropdown>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  position: relative;
  width: calc(50% - 1px);
  border-right: 1px solid rgb(220, 220, 220);
`

const ActiveFile = styled.div`
  width: 100%;
  padding: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const ActiveFileName = styled.div`
  width: 85%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const FilesDropdown = styled.div`
  display: ${ ({ isVisible }: IFilesDropdown) => isVisible ? 'block' : 'none' };
  position: absolute;
  top: 100%;
  left: 0;
  width: 100vw;
  background-color: white;
`
interface IFilesDropdown {
  isVisible: boolean
}

const File = styled.div`
  width: 100%;
  padding: 0.5rem;
  background-color: ${ ({ isActiveFile, userColorPrimary }: IFile ) => isActiveFile ? userColorPrimary : 'transparent' };
  color: ${ ({ isActiveFile }: IFile ) => isActiveFile ? 'white' : 'inherit' };
  white-space: nowrap;
`
interface IFile {
  isActiveFile: boolean
  userColorPrimary: string
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default TabsFiles
