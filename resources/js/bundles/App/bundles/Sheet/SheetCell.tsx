//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { AppState } from '@app/state'
import { Cell } from '@app/state/sheet/types'

import { selectSheetCell } from '@app/state/sheet/selectors'

//-----------------------------------------------------------------------------
// Redux
//-----------------------------------------------------------------------------
const mapStateToProps = (state: AppState, props: SheetCellProps) => ({
  cell: selectSheetCell(state, props.sheetId, props.cellId)
})

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetCell = ({
  cell: {
    value
  }
}: SheetCellProps) => {

  return (
    <Container>
      {value}
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetCellProps {
  cellId: string
  cell?: Cell
  sheetId: string
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.td`
  padding: 0.15rem 0 0.15rem 0.25rem;
  border: 0.5px dashed black;
  border-left: none;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default connect(
  mapStateToProps
)(SheetCell)
