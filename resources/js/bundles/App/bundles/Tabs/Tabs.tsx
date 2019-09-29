//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { FOLDER, ORGANIZATION, SHEET, USER } from '@app/assets/icons'

import { IAppState } from '@app/state'
import { ThunkDispatch } from '@app/state/types'
import { 
  closeTab as closeTabAction,
  openFileInNewTab as openFileInNewTabAction,
  updateActiveTab as updateActiveTabAction 
} from '@app/state/tab/actions'
import { selectActiveTab, selectTabs } from '@app/state/tab/selectors'

import File from '@app/bundles/File/File'
import Folders from '@app/bundles/Folders/Folders'
import Icon from '@/components/Icon'
import Organization from '@app/bundles/Organization/Organization'
import SheetSettings from '@app/bundles/Sheet/SheetSettings'
import Tab from '@app/bundles/Tabs/Tab'
import User from '@app/bundles/User/User'

//-----------------------------------------------------------------------------
// Redux
//-----------------------------------------------------------------------------
const mapStateToProps = (state: IAppState) => ({
  activeTab: selectActiveTab(state),
  tabs: selectTabs(state)
})

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  closeTab: (fileId: string) => dispatch(closeTabAction(fileId)),
  openFileInNewTab: (nextActiveTab: string) => dispatch(openFileInNewTabAction(nextActiveTab)),
  updateActiveTab: (nextActiveTab: string) => dispatch(updateActiveTabAction(nextActiveTab))
})

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const Tabs = ({ 
  activeTab,
  closeTab,
  openFileInNewTab,
  tabs,
  updateActiveTab
}: TabsProps) => {

  const [ localActiveTab, setLocalActiveTab ] = useState(activeTab)
  const [ localTabs, setLocalTabs ] = useState(tabs)
  
  useEffect(() => {
    setLocalActiveTab(activeTab || 'FOLDERS')
  }, [ activeTab ])

  useLayoutEffect(() => {
    setLocalTabs(tabs)
  }, [ tabs ])

  const handleFileOpen = (nextActiveTab: string) => {
    setLocalActiveTab(nextActiveTab)
    tabs.includes(nextActiveTab)
      ? setTimeout(() => updateActiveTab(nextActiveTab), 10)
      : !['FOLDERS', 'USER', 'SHEET_SETTINGS', 'ORGANIZATION'].includes(nextActiveTab)
        ? (
            setLocalTabs([ ...localTabs, nextActiveTab]),
            setTimeout(() => openFileInNewTab(nextActiveTab), 10)
          )
        : (
            setLocalActiveTab(nextActiveTab),
            setTimeout(() => updateActiveTab(nextActiveTab), 10)
          )
  }

  return (
    <Container>
      <TabsContainer>
        {localTabs.map((fileId) => (
          <Tab
            key={fileId}
            fileId={fileId}
            isActiveTab={localActiveTab === fileId}
            closeTab={closeTab}
            handleTabClick={handleFileOpen}/>))
        }
        <MiniTab
          isActiveTab={localActiveTab === 'FOLDERS'}
          onClick={() => handleFileOpen('FOLDERS')}>
          <Icon
            icon={FOLDER}
            size="1rem"/>
        </MiniTab>
        <MiniTab
          isActiveTab={localActiveTab === 'SHEET_SETTINGS'}
          onClick={() => handleFileOpen('SHEET_SETTINGS')}>
          <Icon
            icon={SHEET}
            size="0.88rem"/>
        </MiniTab>
        <MiniTab
          isActiveTab={localActiveTab === 'USER'}
          onClick={() => handleFileOpen('USER')}>
          <Icon
            icon={USER}
            size="1rem"/>
        </MiniTab>
        <MiniTab
          isActiveTab={localActiveTab === 'ORGANIZATION'}
          onClick={() => handleFileOpen('ORGANIZATION')}>
          <Icon
            icon={ORGANIZATION}
            size="1rem"/>
        </MiniTab>
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
        <Folders
          handleFileOpen={handleFileOpen}
          isActiveTab={localActiveTab === 'FOLDERS'}/>
        {localActiveTab === 'SHEET_SETTINGS' && <SheetSettings />}
        {localActiveTab === 'USER' && <User />}
        {localActiveTab === 'ORGANIZATION' && <Organization />}
      </FilesContainer>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface TabsProps {
  activeTab: string
  closeTab?(fileId: string): void
  openFileInNewTab?(nextActiveTab: string): void
  tabs: string[]
  updateActiveTab?(nextActiveTab: string): void
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  z-index: 1;
  position: fixed;
  top: 0;
  left: 2px;
  width: 100%;
  height: 100%;
`

const TabsContainer = styled.div`
  z-index: 2;
  position: relative;
  width: 100%;
  display: flex;
  align-items: flex-end;
`

const MiniTab = styled.div`
  cursor: default;
  margin-top: 0.2rem;
  height: 1.4rem;
  padding: 0.4rem;
  margin-right: 1px;
  background-color: rgb(240,240,240);
  color: rgb(80, 80, 80);
  border-radius: 6px 6px 0 0;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: ${ ({ isActiveTab }: MiniTabProps) => isActiveTab ? '1' : '0.75'};
`
interface MiniTabProps {
  isActiveTab: boolean
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
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Tabs)
