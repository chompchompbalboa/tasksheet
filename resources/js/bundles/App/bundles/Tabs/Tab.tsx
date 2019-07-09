//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { AppState } from '@app/state'
import { selectFile } from '@app/state/folder/selectors'
import { File as TFile } from '@app/state/folder/types'
import { updateActiveTabId as updateActiveTabIdAction } from '@app/state/tab/actions'

//-----------------------------------------------------------------------------
// Redux
//-----------------------------------------------------------------------------
const mapStateToProps = (state: AppState, props: TabProps) => ({
  file: selectFile(props.fileId, state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  updateActiveTabId: (nextActiveTabId: string) => dispatch(updateActiveTabIdAction(nextActiveTabId))
})

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const Tab = ({
  file,
  isActiveTab,
  updateActiveTabId
}: TabProps) => {
  console.log(isActiveTab)
  return (
    <Container
      isActiveTab={isActiveTab}
      onClick={() => updateActiveTabId(file.id)}>
      <Content>
        {file.name}
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
  file?: TFile,
  fileId: string
  isActiveTab: boolean
  updateActiveTabId?(nextActiveTabId: string): void
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  cursor: ${ ({ isActiveTab }: ContainerProps) => isActiveTab ? 'auto' : 'pointer'};
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
  display: flex;
  justify-content: flex-start;
  align-items: center;
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
