//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { AppState } from '@app/state'
import { selectActiveTab, selectTabs } from '@app/state/tab/selectors'
import { selectUserLayoutSidebarWidth } from '@app/state/user/selectors'

import File from '@app/bundles/File/File'
import Tab from '@app/bundles/Tabs/Tab'

//-----------------------------------------------------------------------------
// Redux
//-----------------------------------------------------------------------------
const mapStateToProps = (state: AppState) => ({
  activeTab: selectActiveTab(state),
  tabs: selectTabs(state),
  userLayoutSidebarWidth: selectUserLayoutSidebarWidth(state)
})

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const Tabs = ({ 
  activeTab,
  tabs,
  userLayoutSidebarWidth
}: TabsProps) => {
  return (
    <Container sidebarWidth={userLayoutSidebarWidth}>
      <TabsContainer>
        {tabs.map((fileId, index) => (
          <Tab
            key={fileId}
            fileId={fileId}
            isActiveTab={activeTab === index}/>
        ))}
      </TabsContainer>
      {tabs.map((fileId, index) => (
        <FileContainer
            key={fileId}
            isActiveTab={activeTab === index}>
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
  activeTab: number
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
