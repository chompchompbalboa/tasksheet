//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { AppState } from '@app/state'
import { selectSheetColumns } from '@app/state/sheet/selectors'
import { Columns } from '@app/state/sheet/types'

import SheetColumn from '@app/bundles/Sheet/SheetColumn'

//-----------------------------------------------------------------------------
// Redux
//-----------------------------------------------------------------------------
const mapStateToProps = (state: AppState, props: SheetColumnsProps) => ({
  columns: selectSheetColumns(state, props.sheetId)
})

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetColumns = ({
  columns
}: SheetColumnsProps) => {
  return (
    <Container>
      <TableRow>
        {columns !== {} && Object.keys(columns).map(columnId => {
          const column = columns[columnId]
          return (
            <SheetColumn 
              key={columnId}
              column={column}/>
        )})}
      </TableRow>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetColumnsProps {
  sheetId: string
  columns?: Columns
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.thead`
  position: relative;
  z-index: 10;
  width: 100%;
`

const TableRow = styled.tr`
  position: relative;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default connect(
  mapStateToProps
)(SheetColumns)
