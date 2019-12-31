//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { TAB_CLOSE } from '@/assets/icons'

import { IAppState } from '@/state'

import Icon from '@/components/Icon'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const Tab = ({
  closeTab,
  fileId,
  isActiveTab,
  handleTabClick
}: TabProps) => {

  const file = useSelector((state: IAppState) => state.folder.files && state.folder.files[fileId] )
  
  return (
    <Container
      isActiveTab={isActiveTab}>
      <Content>
        <NameContainer>
          <Name
            isActiveTab={isActiveTab}
            isVisible={typeof file !== 'undefined'}
            onClick={() => handleTabClick(fileId)}>
            {file ? file.name : 'Loading...'}
          </Name>
        </NameContainer>
        <CloseTab
          onClick={() => closeTab(fileId)}>
          <Icon
            icon={TAB_CLOSE}
            size="1rem"/>
        </CloseTab>
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
  width: 12.5%;
  margin-top: 1px;
  margin-right: 1px;
  opacity: ${ ({ isActiveTab }: ContainerProps) => isActiveTab ? '1' : '0.75'};
  background-color: rgb(250, 250, 250);
  border-left: none;
  border-bottom: none;
  border-radius: 4px 4px 0 0;
  @media (max-width: 480px) {
    width: 25%;
  }
`
interface ContainerProps {
  isActiveTab: boolean
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
  padding: 0.265rem;
  padding-left: 0.5rem;
  display: flex;
  align-items: center;
`

const Name = styled.div`
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.75rem;
  color: rgb(75, 75, 75);
  transition: opacity 0.25s;
  opacity: ${ ({ isVisible }: NameProps) => isVisible ? '1' : '0'};
`
interface NameProps {
  isActiveTab: boolean
  isVisible: boolean
}

const CloseTab = styled.div`
  width: 1.1rem;
  cursor: pointer;
  padding-right: 0.2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgb(100, 100, 100);
  &:hover {
    color: rgb(200, 0, 0);
  }
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default Tab
