//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { AppState } from '@app/state'
import { ThunkDispatch } from '@app/state/types'
import { Column } from '@app/state/sheet/types'

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
const SheetColumn = ({
  column: {
    name,
    width
  }
}: SheetColumnProps) => {

  return (
    <Container
      containerWidth={width}>
      {name}
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetColumnProps {
  column: Column
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.th`
  z-index: 50;
  position: sticky;
  top: 2rem;
  width: ${ ({ containerWidth }: ContainerProps ) => containerWidth + 'px'};
  padding: 0.15rem 0 0.15rem 0.25rem;
  text-align: left;
  background-color: rgb(250, 250, 250);
  box-shadow: 0px 1px 0px 0px rgba(0,0,0,1);
`
interface ContainerProps {
  containerWidth: number
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SheetColumn)
