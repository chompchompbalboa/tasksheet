//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { TAB_CLOSE } from '@app/assets/icons'

import { AppState } from '@app/state'
import { selectFile } from '@app/state/folder/selectors'
import { File as TFile } from '@app/state/folder/types'
import { 
  closeTab as closeTabAction,
  updateActiveTabId as updateActiveTabIdAction 
} from '@app/state/tab/actions'

import Icon from '@/components/Icon'

//-----------------------------------------------------------------------------
// Redux
//-----------------------------------------------------------------------------
const mapStateToProps = (state: AppState, props: TabProps) => ({
  file: selectFile(props.fileId, state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  closeTab: (fileId: string) => dispatch(closeTabAction(fileId)),
  updateActiveTabId: (nextActiveTabId: string) => dispatch(updateActiveTabIdAction(nextActiveTabId))
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
  console.log(isActiveTab)
  return (
    <Container
      isActiveTab={isActiveTab}>
      <Content>
        <Name
          onClick={() => updateActiveTabId(file.id)}>
          {file.name}
        </Name>
        <CloseTab
          onClick={() => closeTab(file.id)}>
          <Icon
            icon={TAB_CLOSE}/>
        </CloseTab>
      </Content>
      {isActiveTab &&
        <HideBottomBorder />}
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface TabProps {
  closeTab?(fileId: string): void
  file?: TFile,
  fileId: string
  isActiveTab: boolean
  updateActiveTabId?(nextActiveTabId: string): void
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  cursor: ${ ({ isActiveTab }: ContainerProps) => isActiveTab ? 'default' : 'pointer'};
  height: 100%;
  width: 12.5%;
  background-color: ${ ({ isActiveTab }: ContainerProps) => isActiveTab ? 'rgb(255, 255, 255)' : 'rgb(245, 245, 245)'};
  border: 1px solid rgb(180, 180, 180);
  border-left: none;
  border-bottom: none;
  border-radius: 5px 5px 0 0;
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
  justify-content: flex-start;
  align-items: center;
`

const Name = styled.div`
  width: 100%;
`

const CloseTab = styled.div`
  cursor: pointer;
  width: 1rem;
  height: 1rem;
  color: rgb(80, 80, 80);
  &:hover {
    color: rgb(200, 0, 0);
  }
`

const HideBottomBorder = styled.div`
  position: relative;
  top: -2px;
  left: 0;
  width: 100%;
  height: 4px;
  background-color: rgb(255, 255, 255);
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Tab)
