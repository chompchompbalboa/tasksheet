//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { AppState } from '@app/state'
import { selectFile } from '@app/state/folder/selectors'
import { File as TFile } from '@app/state/folder/types'

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
  file,
  isActiveTab
}: TabProps) => {
  console.log(isActiveTab)
  return (
    <Container>
      {file.name}
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
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  height: 1.5rem;
  width: 15%;
  background-color: rgb(200, 200, 200);
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default connect(
  mapStateToProps
)(Tab)
