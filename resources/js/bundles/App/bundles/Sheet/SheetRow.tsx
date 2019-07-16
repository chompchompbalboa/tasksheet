//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { AppState } from '@app/state'
import { selectSheetCells, selectSheetColumns } from '@app/state/sheet/selectors'
import { Cells, Columns, Row } from '@app/state/sheet/types'

import SheetCell from '@app/bundles/Sheet/SheetCell'

//-----------------------------------------------------------------------------
// Redux
//-----------------------------------------------------------------------------
const mapStateToProps = (state: AppState, props: SheetRowProps) => ({
  cells: selectSheetCells(state, props.sheetId),
  columns: selectSheetColumns(state, props.sheetId)
})

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetRow = ({
  cells,
  columns,
  row,
  sheetId
}: SheetRowProps) => {

  return (
    <Container>
      {columns !== {} && Object.keys(columns).map(columnId => {
        const cell = cells[row.cells.find(cellId => cells[cellId].columnId === columnId)]
        return (
          <SheetCell 
            key={cell.id}
            cell={cell}
            sheetId={sheetId}/>
        )
      })}
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetRowProps {
  cells?: Cells
  columns?: Columns
  row: Row
  sheetId: string
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.tr`
  position: relative;
  height: 100%;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default connect(
  mapStateToProps
)(SheetRow)
