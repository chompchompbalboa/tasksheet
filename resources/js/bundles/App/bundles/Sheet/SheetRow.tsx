//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { AppState } from '@app/state'
import { ThunkDispatch } from '@app/state/types'
import { Row } from '@app/state/sheet/types'

import SheetCell from '@app/bundles/Sheet/SheetCell'

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
const SheetRow = ({
  row: {
    cells
  },
  sheetId
}: SheetRowProps) => {

  return (
    <Container>
      {cells.map(cellId => (
        <SheetCell 
          key={cellId}
          cellId={cellId}
          sheetId={sheetId}/>
      ))}
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetRowProps {
  row: Row
  sheetId: string
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.tr`
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SheetRow)
