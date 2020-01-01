//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { CHEVRON_DOWN } from '@/assets/icons'

import { IAppState } from '@/state'
import {
  closeTab,
  openFileInNewTab,
  updateActiveTab 
} from '@/state/tab/actions'

import File from '@mobile/File/File'
import Icon from '@/components/Icon'
import Tab from '@mobile/Tabs/Tab'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const Tabs = () => {

  // Refs
  const tabsDropdown = useRef(null)

  // Redux
  const dispatch = useDispatch()
  const activeTab = useSelector((state: IAppState) => state.tab.activeTab)
  const activeTabFile = useSelector((state: IAppState) => state.folder.files && state.folder.files[activeTab] )
  const tabs = useSelector((state: IAppState) => state.tab.tabs)

  // Local state
  const [ isTabsDropdownVisible, setIsTabsDropdownVisible ] = useState(false)
  const [ localActiveTab, setLocalActiveTab ] = useState(activeTab)
  const [ localTabs, setLocalTabs ] = useState(tabs)
  
  // Effects
  useEffect(() => {
    setLocalActiveTab(activeTab || 'FOLDERS')
  }, [ activeTab ])

  useEffect(() => {
    isTabsDropdownVisible
      ? addEventListener('mousedown', closeTabsDropodownOnClickOutside)
      : removeEventListener('mousedown', closeTabsDropodownOnClickOutside)
    return () => removeEventListener('mousedown', closeTabsDropodownOnClickOutside)
  }, [ isTabsDropdownVisible ])

  useLayoutEffect(() => {
    setLocalTabs(tabs)
  }, [ tabs ])

  // Close Tabs Dropdown on Click Outside
  const closeTabsDropodownOnClickOutside = (e: any) => {
    if(!tabsDropdown.current.contains(e.target)) {
      setIsTabsDropdownVisible(false)
    }
  }

  // Handle file open
  const handleFileOpen = (nextActiveTab: string) => {
    setLocalActiveTab(nextActiveTab)
    setIsTabsDropdownVisible(false)
    tabs.includes(nextActiveTab)
      ? setTimeout(() => dispatch(updateActiveTab(nextActiveTab)), 10)
      : !['FOLDERS', 'SETTINGS'].includes(nextActiveTab)
        ? (
            setLocalTabs([ ...localTabs, nextActiveTab]),
            setTimeout(() => dispatch(openFileInNewTab(nextActiveTab)), 10)
          )
        : (
            setLocalActiveTab(nextActiveTab),
            setTimeout(() => dispatch(updateActiveTab(nextActiveTab)), 10)
          )
  }

  // Render
  return (
    <Container>
      <TabsContainer>
        <ActiveTab
          onClick={() => setIsTabsDropdownVisible(true)}>
          <ActiveTabName>
            {activeTabFile.name}
          </ActiveTabName>
          <Icon icon={CHEVRON_DOWN}/>
        </ActiveTab>
        <TabsDropdown
          ref={tabsDropdown}
          isVisible={isTabsDropdownVisible}>
          {localTabs.map((fileId) => (
            <Tab
              key={fileId}
              fileId={fileId}
              isActiveTab={localActiveTab === fileId}
              closeTab={fileId => dispatch(closeTab(fileId))}
              handleTabClick={handleFileOpen}/>))
          }
        </TabsDropdown>
      </TabsContainer>
      <FilesContainer>
        {localTabs.map((fileId) => (
          <FileContainer
            key={fileId}
            isActiveTab={localActiveTab === fileId}>
            <File
              fileId={fileId}/>
          </FileContainer>))
        }
      </FilesContainer>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  z-index: 1;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`

const TabsContainer = styled.div`
  z-index: 2;
  position: relative;
  width: 100%;
  background-color: white;
  color: black;
`

const ActiveTab = styled.div`
  width: 100%;
  padding: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const ActiveTabName = styled.div`
  display: flex;
  align-items: center;
`

const TabsDropdown = styled.div`
  display: ${ ({ isVisible }: ITabsDropdown) => isVisible ? 'block' : 'none' };
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
`
interface ITabsDropdown {
  isVisible: boolean
}

const FilesContainer = styled.div`
  z-index: 1;
  position: relative;
  width: 100%;
  height: 100%;
  background-color: rgb(240,240,240);
  box-shadow: -1px 0px 10px 0px rgba(0,0,0,0.5);
`

const FileContainer = styled.div`
  position: relative;
  display: ${ ({ isActiveTab }: FileContainerProps) => isActiveTab ? 'block' : 'none' };
  width: 100%;
  height: 100%;
`
interface FileContainerProps {
  isActiveTab: boolean
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default Tabs
