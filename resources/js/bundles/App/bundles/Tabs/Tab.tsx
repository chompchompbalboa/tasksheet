//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { TAB_CLOSE } from '@app/assets/icons'

import { AppState } from '@app/state'
import { selectFile } from '@app/state/folder/selectors'
import { File as TFile } from '@app/state/folder/types'

import Icon from '@/components/Icon'

//-----------------------------------------------------------------------------
// Redux
//-----------------------------------------------------------------------------
const mapStateToProps = (state: AppState, props: TabProps) => ({
  file: selectFile(props.fileId, state)
})

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const Tab = ({
  closeTab,
  file,
  isActiveTab,
  handleTabClick
}: TabProps) => {
  return (
    <Container
      isActiveTab={isActiveTab}>
      <Content>
        <NameContainer>
          <Name
            isVisible={typeof file !== 'undefined'}
            onClick={() => handleTabClick(file.id)}>
            {file ? file.name : 'Loading...'}
          </Name>
        </NameContainer>
        <CloseTab
          onClick={() => closeTab(file.id)}>
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
  file?: TFile
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
  border-radius: 1px 1px 0 0;
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
  width: 90%;
  padding: 0.275rem;
  padding-left: 0.5rem;
  display: flex;
  align-items: center;
`

const Name = styled.div`
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.78rem;
  transition: opacity 0.25s;
  opacity: ${ ({ isVisible }: NameProps) => isVisible ? '1' : '0'};
`
interface NameProps {
  isVisible: boolean
}

const CloseTab = styled.div`
  cursor: pointer;
  padding-right: 0.15rem;
  height: 100%;
  width: 10%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgb(80, 80, 80);
  &:hover {
    color: rgb(200, 0, 0);
  }
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default connect(
  mapStateToProps
)(Tab)
