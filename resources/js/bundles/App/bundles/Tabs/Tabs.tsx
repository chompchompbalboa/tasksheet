//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { FOLDER, ORGANIZATION, SHEET, USER } from '@app/assets/icons'

import { AppState } from '@app/state'
import { ThunkDispatch } from '@app/state/types'
import { 
  closeTab as closeTabAction,
  openFileInNewTab as openFileInNewTabAction,
  updateActiveTabId as updateActiveTabIdAction 
} from '@app/state/tab/actions'
import { selectActiveTabId, selectTabs } from '@app/state/tab/selectors'

import File from '@app/bundles/File/File'
import Folders from '@app/bundles/Folders/Folders'
import Icon from '@/components/Icon'
import Tab from '@app/bundles/Tabs/Tab'
import User from '@app/bundles/User/User'

//-----------------------------------------------------------------------------
// Redux
//-----------------------------------------------------------------------------
const mapStateToProps = (state: AppState) => ({
  activeTabId: selectActiveTabId(state),
  tabs: selectTabs(state)
})

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  closeTab: (fileId: string) => dispatch(closeTabAction(fileId)),
  openFileInNewTab: (nextActiveTabId: string) => dispatch(openFileInNewTabAction(nextActiveTabId)),
  updateActiveTabId: (nextActiveTabId: string) => dispatch(updateActiveTabIdAction(nextActiveTabId))
})

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const Tabs = ({ 
  activeTabId,
  closeTab,
  openFileInNewTab,
  tabs,
  updateActiveTabId
}: TabsProps) => {

  const [ localActiveTabId, setLocalActiveTabId ] = useState(activeTabId)
  const [ localTabs, setLocalTabs ] = useState(tabs)
  
  useEffect(() => {
    setLocalActiveTabId(activeTabId || 'FOLDERS')
  }, [ activeTabId ])

  useLayoutEffect(() => {
    setLocalTabs(tabs)
  }, [ tabs ])

  const handleFileOpen = (nextActiveTabId: string) => {
    setLocalActiveTabId(nextActiveTabId)
    tabs.includes(nextActiveTabId)
      ? window.setTimeout(() => updateActiveTabId(nextActiveTabId), 10)
      : !['FOLDERS', 'USER', 'SHEET_SETTINGS', 'ORGANIZATION'].includes(nextActiveTabId)
        ? (
            setLocalTabs([ ...localTabs, nextActiveTabId]),
            setTimeout(() => openFileInNewTab(nextActiveTabId), 10)
          )
        : setLocalActiveTabId(nextActiveTabId)
  }

  return (
    <Container>
      <TabsContainer>
        {localTabs.map((fileId) => (
          <Tab
            key={fileId}
            fileId={fileId}
            isActiveTab={localActiveTabId === fileId}
            closeTab={closeTab}
            handleTabClick={handleFileOpen}/>))
        }
        <MiniTab
          isActiveTab={localActiveTabId === 'FOLDERS'}
          onClick={() => handleFileOpen('FOLDERS')}>
          <Icon
            icon={FOLDER}
            size="1rem"/>
        </MiniTab>
        <MiniTab
          isActiveTab={localActiveTabId === 'SHEET_SETTINGS'}
          onClick={() => handleFileOpen('SHEET_SETTINGS')}>
          <Icon
            icon={SHEET}
            size="0.88rem"/>
        </MiniTab>
        <MiniTab
          isActiveTab={localActiveTabId === 'USER'}
          onClick={() => handleFileOpen('USER')}>
          <Icon
            icon={USER}
            size="1rem"/>
        </MiniTab>
        <MiniTab
          isActiveTab={localActiveTabId === 'ORGANIZATION'}
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
            isActiveTab={localActiveTabId === fileId}>
            <File
              fileId={fileId}/>
          </FileContainer>))
        }
        <Folders
          handleFileOpen={handleFileOpen}
          isActiveTab={localActiveTabId === 'FOLDERS'}/>
        <User
          isActiveTab={localActiveTabId === 'USER'}/>
      </FilesContainer>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface TabsProps {
  activeTabId: string
  closeTab?(fileId: string): void
  openFileInNewTab?(nextActiveTabId: string): void
  tabs: string[]
  updateActiveTabId?(nextActiveTabId: string): void
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
