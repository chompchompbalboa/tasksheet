//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { forwardRef, memo, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import Autosizer from 'react-virtualized-auto-sizer'
import { areEqual, VariableSizeGrid as Grid } from 'react-window'
import styled from 'styled-components'

import { query } from '@app/api'

import { AppState } from '@app/state'
import { ThunkDispatch } from '@app/state/types'
import { 
  loadSheet as loadSheetAction,
  updateSheetCell as updateSheetCellAction, SheetCellUpdates
} from '@app/state/sheet/actions'
import { Columns, SheetFilters, SheetGroups, Rows, SheetFromServer, SheetSorts, VisibleColumns, VisibleRows } from '@app/state/sheet/types'
import { 
  selectSheetColumns, 
  selectSheetFilters,
  selectSheetGroups,
  selectSheetRows,
  selectSheetSorts,
  selectSheetVisibleColumns,
  selectSheetVisibleRows
} from '@app/state/sheet/selectors'
import { selectActiveTabId } from '@app/state/tab/selectors'
import { 
  selectUserColorSecondary
} from '@app/state/user/selectors'

import LoadingTimer from '@/components/LoadingTimer'
import SheetActions from '@app/bundles/Sheet/SheetActions'
import SheetCell from '@app/bundles/Sheet/SheetCell'
import SheetGroupCell from '@app/bundles/Sheet/SheetGroupCell'
import SheetHeader from '@app/bundles/Sheet/SheetHeader'

//-----------------------------------------------------------------------------
// Redux
//-----------------------------------------------------------------------------
const mapStateToProps = (state: AppState, props: SheetComponentProps) => ({
  activeTabId: selectActiveTabId(state),
  columns: selectSheetColumns(state, props.id),
  filters: selectSheetFilters(state, props.id),
  groups: selectSheetGroups(state, props.id),
  rows: selectSheetRows(state, props.id),
  sorts: selectSheetSorts(state, props.id),
  visibleRows: selectSheetVisibleRows(state, props.id),
  visibleColumns: selectSheetVisibleColumns(state, props.id),
  userColorSecondary: selectUserColorSecondary(state)
})

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  loadSheet: (sheet: SheetFromServer) => dispatch(loadSheetAction(sheet)),
  updateSheetCell: (sheetId: string, cellId: string, updates: SheetCellUpdates) => dispatch(updateSheetCellAction(sheetId, cellId, updates))
})

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetComponent = memo(({
  activeTabId,
  columns,
  fileId,
  filters,
  groups,
  id,
  loadSheet,
  rows,
  sorts,
  visibleRows,
  visibleColumns,
  updateSheetCell,
  userColorSecondary
}: SheetComponentProps) => {
  
  const isActiveFile = fileId === activeTabId

  const [ hasLoaded, setHasLoaded ] = useState(false)
  useEffect(() => {
    if(!hasLoaded && isActiveFile) {
      query.getSheet(id).then(sheet => {
        loadSheet(sheet).then(() => {
          setHasLoaded(true)
        })
      })
    }
  }, [ activeTabId ])

  const GridWrapper = forwardRef(({ children, ...rest }, ref) => (
    <GridContainer
      //@ts-ignore ref={ref}
      ref={ref} {...rest}>
      <SheetHeaders>
      {visibleColumns.map((columnId, index) => (
        <SheetHeader
          key={columnId}
          column={columns[columnId]}
          isLast={index === visibleColumns.length - 1}/>))}
      </SheetHeaders>
      <GridItems>
        {children}
      </GridItems>
    </GridContainer> 
  ))

  const Cell = ({ 
    columnIndex, 
    rowIndex, 
    style 
  }: CellProps) => {
    const rowId = visibleRows[rowIndex]
    if(rowId !== 'GROUP_HEADER') {
      return (
        <SheetCell
          cell={rows[visibleRows[rowIndex]].cells[columnIndex]}
          highlightColor={userColorSecondary}
          sheetId={id}
          updateSheetCell={updateSheetCell}
          type={columns[visibleColumns[columnIndex]].type}
          style={style}/>
      )
    }
    return (
      <SheetGroupCell
        style={style}/>
    )
}

  return (
    <Container>
      <SheetContainer>
        <SheetActions
          sheetId={id}
          columns={columns}
          filters={filters}
          groups={groups}
          openSaveMenu={(fileType, id) => console.log(fileType, id)}
          sorts={sorts}/>
        {!hasLoaded
          ? isActiveFile ? <LoadingTimer fromId={id}/> : null
          : <Autosizer>
              {({ width, height }) => (
                <Grid
                  innerElementType={GridWrapper}
                  width={width}
                  height={height}
                  columnWidth={columnIndex => columns[visibleColumns[columnIndex]].width}
                  columnCount={visibleColumns.length}
                  rowHeight={index => 24}
                  rowCount={visibleRows.length}
                  overscanColumnCount={visibleColumns.length}
                  overscanRowCount={3}>
                  {Cell}
                </Grid>
              )}
            </Autosizer>
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
  filters?: SheetFilters
  groups?: SheetGroups
  id: string
  loadSheet?(sheet: SheetFromServer): Promise<void>
  rows?: Rows
  sorts?: SheetSorts
  visibleColumns?: VisibleColumns
  visibleRows?: VisibleRows
  updateSheetCell?(sheetId: string, cellId: string, updates: SheetCellUpdates): void
  userColorSecondary?: string
}

interface CellProps {
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
  background-color: rgb(230, 230, 230);
`

const GridContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: white;
`

const SheetHeaders = styled.div`
  z-index: 1000;
  position: sticky;
  top: 0;
  left: 0;
  height: 3.5vh;
`

const GridItems = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SheetComponent)
