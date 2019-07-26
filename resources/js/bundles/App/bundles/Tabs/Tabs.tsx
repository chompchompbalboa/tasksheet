//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { FOLDER } from '@app/assets/icons'

import { AppState } from '@app/state'
import { ThunkDispatch } from '@app/state/types'
import { 
  closeTab as closeTabAction,
  updateActiveTabId as updateActiveTabIdAction 
} from '@app/state/tab/actions'
import { selectActiveTabId, selectTabs } from '@app/state/tab/selectors'
import {  selectUserLayoutTabsHeight } from '@app/state/user/selectors'

import File from '@app/bundles/File/File'
import Icon from '@/components/Icon'
import Tab from '@app/bundles/Tabs/Tab'

//-----------------------------------------------------------------------------
// Redux
//-----------------------------------------------------------------------------
const mapStateToProps = (state: AppState) => ({
  activeTabId: selectActiveTabId(state),
  tabs: selectTabs(state),
  userLayoutTabsHeight: selectUserLayoutTabsHeight(state)
})

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  closeTab: (fileId: string) => dispatch(closeTabAction(fileId)),
  updateActiveTabId: (nextActiveTabId: string) => dispatch(updateActiveTabIdAction(nextActiveTabId))
})

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const Tabs = ({ 
  activeTabId,
  closeTab,
  tabs,
  updateActiveTabId,
  userLayoutTabsHeight,
}: TabsProps) => {
  return (
    <Container>
      <TabsContainer
        tabsHeight={userLayoutTabsHeight}>
        {tabs.length > 0 
          ? tabs.map((fileId) => (
            <Tab
              key={fileId}
              fileId={fileId}
              isActiveTab={activeTabId === fileId}
              closeTab={closeTab}
              updateActiveTabId={updateActiveTabId}/>))
          : <Tab
              fileId={null}
              isActiveTab />
        }
        <FoldersTab
          isActiveTab={activeTabId === 'FOLDERS'}
          onClick={() => updateActiveTabId('FOLDERS')}>
          <Icon
            icon={FOLDER}/>
        </FoldersTab>
      </TabsContainer>
      <FilesContainer
        tabsHeight={userLayoutTabsHeight}>
        {tabs.length > 0 
          ? tabs.map((fileId) => (
            <FileContainer
              key={fileId}
              isActiveTab={activeTabId === fileId}>
              <File
                fileId={fileId}/>
            </FileContainer>))
          : <File
               fileId={null}/>
        }
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
  tabs: string[]
  updateActiveTabId?(nextActiveTabId: string): void
  userLayoutTabsHeight: number
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  z-index: 1;
  position: fixed;
  top: 0;
  left: 2px;
  width: calc(100% - 2px);
`

const TabsContainer = styled.div`
  z-index: 2;
  position: relative;
  width: 100%;
  display: flex;
  height: ${ ({ tabsHeight }: TabsContainerProps) => (tabsHeight * 100) + 'vh'};
  align-items: flex-end;
`
interface TabsContainerProps {
  tabsHeight: number
}

const FoldersTab = styled.div`
  cursor: default;
  margin-left: 2px;
  height: calc(100% - 1.5px);
  padding: 0 0.5rem;
  background-color: rgb(250, 250, 250);
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
  height: calc(100vh - ${ ({ tabsHeight }: FilesContainerProps) => (tabsHeight * 100) + 'vh'});
  background-color: white;
  box-shadow: -1px 0px 10px 0px rgba(0,0,0,0.5);
`
interface FilesContainerProps {
  tabsHeight: number
}

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
