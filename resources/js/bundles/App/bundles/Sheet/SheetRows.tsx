//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { AppState } from '@app/state'
import { selectSheetRows } from '@app/state/sheet/selectors'
import { Rows } from '@app/state/sheet/types'

import SheetRow from '@app/bundles/sheet/SheetRow'

//-----------------------------------------------------------------------------
// Redux
//-----------------------------------------------------------------------------
const mapStateToProps = (state: AppState, props: SheetRowsProps) => ({
  rows: selectSheetRows(state, props.sheetId)
})

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetRows = ({
  rows,
  sheetId
}: SheetRowsProps) => {

  return (
    <Container>
      {rows !== {} && Object.keys(rows).map(rowId => {
        const row = rows[rowId]
        return (
          <SheetRow
            key={rowId}
            row={row}
            sheetId={sheetId}/>
        )
      })}
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetRowsProps {
  sheetId: string
  rows?: Rows
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.tbody`
  z-index: 5;
  width: 100%;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default connect(
  mapStateToProps
)(SheetRows)
