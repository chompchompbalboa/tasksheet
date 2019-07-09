//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { AppState } from '@app/state'
import { selectActiveTabId, selectTabs } from '@app/state/tab/selectors'
import { selectUserLayoutSidebarWidth } from '@app/state/user/selectors'

import File from '@app/bundles/File/File'
import Tab from '@app/bundles/Tabs/Tab'

//-----------------------------------------------------------------------------
// Redux
//-----------------------------------------------------------------------------
const mapStateToProps = (state: AppState) => ({
  activeTabId: selectActiveTabId(state),
  tabs: selectTabs(state),
  userLayoutSidebarWidth: selectUserLayoutSidebarWidth(state)
})

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const Tabs = ({ 
  activeTabId,
  tabs,
  userLayoutSidebarWidth
}: TabsProps) => {
  return (
    <Container sidebarWidth={userLayoutSidebarWidth}>
      <TabsContainer>
        {tabs.map((fileId) => (
          <Tab
            key={fileId}
            fileId={fileId}
            isActiveTab={activeTabId === fileId}/>
        ))}
      </TabsContainer>
      {tabs.map((fileId) => (
        <FileContainer
          key={fileId}
          isActiveTab={activeTabId === fileId}>
          <File
            fileId={fileId}/>
        </FileContainer>
      ))}
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface TabsProps {
  activeTabId: string
  tabs: string[]
  userLayoutSidebarWidth: number
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  position: fixed;
  top: 0;
  left: ${ ({ sidebarWidth }: ContainerProps) => (sidebarWidth * 100) + 'vw'};
  width: calc(100vw - ${ ({ sidebarWidth }: ContainerProps) => (sidebarWidth * 100) + 'vw'});
`
interface ContainerProps {
  sidebarWidth: number
}

const TabsContainer = styled.div`
  width: 100%;
  display: flex;
  height: 1.75rem;
  border-bottom: 1px solid rgb(180, 180, 180);
  background-color: rgb(245, 245, 245);
`

const FileContainer = styled.div`
  display: ${ ({ isActiveTab }: FileContainerProps) => isActiveTab ? 'block' : 'none' };
  width: 100%;
`
interface FileContainerProps {
  isActiveTab: boolean
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default connect(
  mapStateToProps
)(Tabs)
