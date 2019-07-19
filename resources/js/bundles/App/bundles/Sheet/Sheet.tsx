//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { memo, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { areEqual, VariableSizeGrid as Grid } from 'react-window'
import styled from 'styled-components'

import { query } from '@app/api'

import { AppState } from '@app/state'
import { ThunkDispatch } from '@app/state/types'
import { 
  loadSheet as loadSheetAction,
  updateSheetCell as updateSheetCellAction, SheetCellUpdates
} from '@app/state/sheet/actions'
import { Columns, Rows, Sheet } from '@app/state/sheet/types'
import { 
  selectSheetColumns, 
  selectSheetRows
} from '@app/state/sheet/selectors'
import { selectActiveTabId } from '@app/state/tab/selectors'
import { 
  selectUserColorSecondary,
  selectUserLayoutSheetActionsHeight,
  selectUserLayoutSidebarWidth,
  selectUserLayoutTabsHeight
} from '@app/state/user/selectors'

import SheetActions from '@app/bundles/Sheet/SheetActions'
import SheetCell from '@app/bundles/Sheet/SheetCell'

//-----------------------------------------------------------------------------
// Redux
//-----------------------------------------------------------------------------
const mapStateToProps = (state: AppState, props: SheetComponentProps) => ({
  activeTabId: selectActiveTabId(state),
  columns: selectSheetColumns(state, props.id),
  rows: selectSheetRows(state, props.id),
  userColorSecondary: selectUserColorSecondary(state),
  userLayoutSheetActionsHeight: selectUserLayoutSheetActionsHeight(state),
  userLayoutSidebarWidth: selectUserLayoutSidebarWidth(state),
  userLayoutTabsHeight: selectUserLayoutTabsHeight(state)
})

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  loadSheet: (sheet: Sheet) => dispatch(loadSheetAction(sheet)),
  updateSheetCell: (sheetId: string, cellId: string, updates: SheetCellUpdates) => dispatch(updateSheetCellAction(sheetId, cellId, updates))
})

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetComponent = memo(({
  activeTabId,
  columns,
  fileId,
  id,
  loadSheet,
  rows,
  updateSheetCell,
  userColorSecondary,
  userLayoutSheetActionsHeight,
  userLayoutSidebarWidth,
  userLayoutTabsHeight
}: SheetComponentProps) => {

  const [ hasLoaded, setHasLoaded ] = useState(false)

  useEffect(() => {
    if(!hasLoaded && fileId === activeTabId) {
      query.getSheet(id).then(sheet => {
        loadSheet(sheet).then(() => {
          setHasLoaded(true)
        })
      })
    }
  }, [ activeTabId ])

  const Cell = ({ 
    columnIndex, 
    rowIndex, 
    style 
  }: CellRenderProps) => (
    <SheetCell
      cell={rows[rowIndex].cells[columnIndex]}
      highlightColor={userColorSecondary}
      sheetId={id}
      updateSheetCell={updateSheetCell}
      type={columns[columnIndex].type}
      style={style}/>
  )

  return (
    <Container>
      <SheetContainer>
        <SheetActions
          sheetActionsHeight={userLayoutSheetActionsHeight}/>
        {!hasLoaded 
          ? 'Loading...'
          :  <Grid
                width={window.innerWidth - (userLayoutSidebarWidth * window.innerWidth)}
                height={window.innerHeight - (userLayoutTabsHeight * window.innerHeight) - (userLayoutSheetActionsHeight * window.innerHeight)}
                columnWidth={index => 100}
                columnCount={columns.length}
                rowHeight={index => 20}
                rowCount={rows.length}
                overscanColumnCount={2}
                overscanRowCount={15}>
                {Cell}
              </Grid>
        }
        </SheetContainer>
    </Container>
  )
}, areEqual)

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetComponentProps {
  activeTabId?: string
  columns?: Columns
  fileId: string
  id: string
  loadSheet?(sheet: Sheet): Promise<void>
  rows?: Rows
  updateSheetCell?(sheetId: string, cellId: string, updates: SheetCellUpdates): void
  userColorSecondary?: string
  userLayoutSheetActionsHeight?: number
  userLayoutSidebarWidth?: number
  userLayoutTabsHeight?: number
}

interface CellRenderProps {
  columnIndex: number
  rowIndex: number
  style: {}
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`

const SheetContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`

const Sheet = styled.table`
  position: relative;
  width: 100%;
  height: 1px;
  border-collapse: collapse;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SheetComponent)
