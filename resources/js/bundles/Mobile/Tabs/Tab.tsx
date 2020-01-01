//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { IAppState } from '@/state'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const Tab = ({
  fileId,
  isActiveTab,
  handleTabClick
}: TabProps) => {

  const file = useSelector((state: IAppState) => state.folder.files && state.folder.files[fileId])
  const userColorPrimary = useSelector((state: IAppState) => state.user.color.primary)
  
  return (
    <Container
      isActiveTab={isActiveTab}
      onClick={() => handleTabClick(fileId)}
      userColorPrimary={userColorPrimary}>
      <Content>
        <NameContainer>
          <Name>
            {file ? file.name : 'Loading...'}
          </Name>
        </NameContainer>
      </Content>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface TabProps {
  closeTab?(fileId: string): void
  fileId: string
  isActiveTab: boolean
  handleTabClick?(nextActiveTabId: string): void
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  cursor: default;
  width: 100%;
  background-color: ${ ({ isActiveTab, userColorPrimary }: ContainerProps) => isActiveTab ? userColorPrimary : 'white'};
  color: ${ ({ isActiveTab }: ContainerProps) => isActiveTab ? 'white' : 'black' };
`
interface ContainerProps {
  isActiveTab: boolean
  userColorPrimary: string
}

const Content = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`

const NameContainer = styled.div`
  overflow: hidden;
  height: 100%;
  width: calc(100% - 1.1rem);
  padding: 0.5rem;
  display: flex;
  align-items: center;
`

const Name = styled.div`
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: opacity 0.25s;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default Tab
