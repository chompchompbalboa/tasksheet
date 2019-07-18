//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { TAB_CLOSE } from '@app/assets/icons'

import { AppState } from '@app/state'
import { ThunkDispatch } from '@app/state/types'
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

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
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
  return (
    <Container
      isActiveTab={isActiveTab}>
      <Content>
        {file && 
          <>
            <Name
              onClick={() => updateActiveTabId(file.id)}>
              {file.name}
            </Name>
            <CloseTab
              onClick={() => closeTab(file.id)}>
              <Icon
                icon={TAB_CLOSE}/>
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
  height: 100%;
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
  justify-content: flex-start;
  align-items: center;
`

const Name = styled.div`
  width: 100%;
  white-space: nowrap;
  text-overflow: ellipsis;
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

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Tab)
