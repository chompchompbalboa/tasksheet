//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { FOLDER } from '@app/assets/icons'

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
    setLocalActiveTabId(activeTabId)
  }, [ activeTabId ])

  useEffect(() => {
    setLocalTabs(tabs)
  }, [ tabs ])

  const handleFileOpen = (nextActiveTabId: string) => {
    setLocalActiveTabId(nextActiveTabId)
    tabs.includes(nextActiveTabId)
      ? window.setTimeout(() => updateActiveTabId(nextActiveTabId), 10)
      : nextActiveTabId !== 'FOLDERS' 
        ? (
            setLocalTabs([ ...localTabs, nextActiveTabId]),
            setTimeout(() => openFileInNewTab(nextActiveTabId), 10)
          )
        : setLocalActiveTabId('FOLDERS')
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
            handleTabClick={handleFileOpen}/>))}
        <FoldersTab
          isActiveTab={localActiveTabId === 'FOLDERS'}
          onClick={() => handleFileOpen('FOLDERS')}>
          <Icon
            icon={FOLDER}
            size="1rem"/>
        </FoldersTab>
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
          isActiveTab={localActiveTabId === 'FOLDERS' || localTabs.length === 0}/>
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

const FoldersTab = styled.div`
  cursor: default;
  padding: 0.2rem 0.4rem;
  background-color: white;
  color: rgb(80, 80, 80);
  border-radius: 3px 3px 0 0;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: ${ ({ isActiveTab }: FoldersTabProps) => isActiveTab ? '1' : '0.75'};
`
interface FoldersTabProps {
  isActiveTab: boolean
}

const FilesContainer = styled.div`
  z-index: 1;
  position: relative;
  width: 100%;
  height: 100%;
  background-color: white;
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
