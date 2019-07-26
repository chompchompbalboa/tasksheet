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
  updateActiveTabId
}: TabProps) => {
  return (
    <Container
      isActiveTab={isActiveTab}>
      <Content>
        {file && 
          <>
            <NameContainer>
              <Name
                onClick={() => updateActiveTabId(file.id)}>
                {file.name}
              </Name>
            </NameContainer>
            <CloseTab
              onClick={() => closeTab(file.id)}>
              <Icon
                icon={TAB_CLOSE}
                size="1rem"/>
            </CloseTab>
          </>
        }
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
  updateActiveTabId?(nextActiveTabId: string): void
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  cursor: default;
  height: calc(100% - 1.5px);
  width: 12.5%;
  opacity: ${ ({ isActiveTab }: ContainerProps) => isActiveTab ? '1' : '0.75'};
  background-color: rgb(250, 250, 250);
  border: 1px solid rgb(180, 180, 180);
  border-left: none;
  border-bottom: none;
  border-radius: 3px 3px 0 0;
  box-shadow: -1px -5px 5px 0px rgba(0,0,0,0.5);
`
interface ContainerProps {
  isActiveTab: boolean
}

const Content = styled.div`
  width: 100%;
  height: 100%;
  padding-left: 0.5rem;
  padding-right: 0.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Name = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.85rem;
`

const NameContainer = styled.div`
  overflow: hidden;
  width: 90%;
`

const CloseTab = styled.div`
  cursor: pointer;
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
