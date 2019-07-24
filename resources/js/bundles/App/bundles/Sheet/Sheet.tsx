//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { forwardRef, memo, useEffect, useState } from 'react'
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
import { Columns, Filters, Rows, SheetFromServer, Sorts, VisibleColumns, VisibleRows } from '@app/state/sheet/types'
import { 
  selectSheetColumns, 
  selectSheetFilters,
  selectSheetRows,
  selectSheetSorts,
  selectSheetVisibleColumns,
  selectSheetVisibleRows
} from '@app/state/sheet/selectors'
import { selectActiveTabId } from '@app/state/tab/selectors'
import { 
  selectUserColorSecondary,
  selectUserLayoutSheetActionsHeight,
  selectUserLayoutSidebarWidth,
  selectUserLayoutTabsHeight
} from '@app/state/user/selectors'

import LoadingTimer from '@/components/LoadingTimer'
import SheetActions from '@app/bundles/Sheet/SheetActions'
import SheetCell from '@app/bundles/Sheet/SheetCell'
import SheetHeader from '@app/bundles/Sheet/SheetHeader'

//-----------------------------------------------------------------------------
// Redux
//-----------------------------------------------------------------------------
const mapStateToProps = (state: AppState, props: SheetComponentProps) => ({
  activeTabId: selectActiveTabId(state),
  columns: selectSheetColumns(state, props.id),
  filters: selectSheetFilters(state, props.id),
  rows: selectSheetRows(state, props.id),
  sorts: selectSheetSorts(state, props.id),
  visibleRows: selectSheetVisibleRows(state, props.id),
  visibleColumns: selectSheetVisibleColumns(state, props.id),
  userColorSecondary: selectUserColorSecondary(state),
  userLayoutSheetActionsHeight: selectUserLayoutSheetActionsHeight(state),
  userLayoutSidebarWidth: selectUserLayoutSidebarWidth(state),
  userLayoutTabsHeight: selectUserLayoutTabsHeight(state)
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
  id,
  loadSheet,
  rows,
  sorts,
  visibleRows,
  visibleColumns,
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
  
  const calculateGridWidth = () => window.innerWidth - (userLayoutSidebarWidth * window.innerWidth)
  const calculateGridHeight = () => window.innerHeight - (userLayoutTabsHeight * window.innerHeight) - (userLayoutSheetActionsHeight * window.innerHeight)
  const [ gridWidth, setGridWidth ] = useState(calculateGridWidth())
  const [ gridHeight, setGridHeight ] = useState(calculateGridHeight())
  const handleResize = () => {
    setGridWidth(calculateGridWidth())
    setGridHeight(calculateGridHeight())
  }
  useEffect(() => {
    addEventListener('resize', () => handleResize())
    return () => {
      removeEventListener('resize', () => handleResize())
    }
  }, [])

  const GridWrapper = forwardRef(({ children, ...rest }, ref) => (
    <GridContainer
      //@ts-ignore ref={ref}
      ref={ref} {...rest}>
      <SheetHeaders>
      {visibleColumns.map(columnId => (
        <SheetHeader
          key={columnId}
          column={columns[columnId]}/>))}
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
  }: CellProps) => (
    <SheetCell
      cell={rows[visibleRows[rowIndex]].cells[columnIndex]}
      highlightColor={userColorSecondary}
      sheetId={id}
      updateSheetCell={updateSheetCell}
      type={columns[visibleColumns[columnIndex]].type}
      style={style}/>
  )

  return (
    <Container>
      <SheetContainer>
        <SheetActions
          sheetId={id}
          columns={columns}
          filters={filters}
          sheetActionsHeight={userLayoutSheetActionsHeight}
          sorts={sorts}/>
        {!hasLoaded 
          ?  <LoadingTimer />
          :  <Grid
                innerElementType={GridWrapper}
                width={gridWidth}
                height={gridHeight}
                columnWidth={columnIndex => columns[visibleColumns[columnIndex]].width}
                columnCount={visibleColumns.length}
                rowHeight={index => 24}
                rowCount={visibleRows.length}
                overscanColumnCount={visibleColumns.length}
                overscanRowCount={12}>
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
  filters?: Filters
  id: string
  loadSheet?(sheet: SheetFromServer): Promise<void>
  rows?: Rows
  sorts?: Sorts
  visibleColumns?: VisibleColumns
  visibleRows?: VisibleRows
  updateSheetCell?(sheetId: string, cellId: string, updates: SheetCellUpdates): void
  userColorSecondary?: string
  userLayoutSheetActionsHeight?: number
  userLayoutSidebarWidth?: number
  userLayoutTabsHeight?: number
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
`

const GridContainer = styled.div`
  width: 100%;
  height: 100%;
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
