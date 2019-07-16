//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'


import { AppState } from '@app/state'
import { ThunkDispatch } from '@app/state/types'

//-----------------------------------------------------------------------------
// Redux
//-----------------------------------------------------------------------------
const mapStateToProps = (state: AppState) => ({
})

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
})

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActions = ({
}: SheetActionsProps) => {

  return (
    <Container>
      &nbsp;
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetActionsProps {
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  z-index: 10;
  width: 100%;
  position: sticky;
  top: 0;
  height: 2rem;
  background-color: rgb(250, 250, 250);
  border-bottom: 1px solid black;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SheetActions)
