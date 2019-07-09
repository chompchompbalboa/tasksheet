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
const mapStateToProps = (state: AppState, props: FileProps) => ({
  file: selectFile(props.fileId, state)
})

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const File = ({
  file
}: FileProps) => {
  return (
    <Container>
      {file.name}
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface FileProps {
  file?: TFile
  fileId: string
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default connect(
  mapStateToProps
)(File)
