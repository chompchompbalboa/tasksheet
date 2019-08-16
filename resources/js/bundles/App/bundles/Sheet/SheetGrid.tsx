//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { forwardRef, memo, MouseEvent, useEffect, useRef } from 'react'
import { areEqual, VariableSizeGrid as Grid } from 'react-window'
import styled from 'styled-components'

import { 
  SheetActiveUpdates, 
  SheetColumn, SheetColumns, SheetColumnUpdates,
  SheetCellUpdates, 
  SheetRow, SheetRows 
} from '@app/state/sheet/types'

import Autosizer from 'react-virtualized-auto-sizer'
import SheetCell from '@app/bundles/Sheet/SheetCell'
import SheetBreakCell from '@app/bundles/Sheet/SheetBreakCell'
import SheetHeaders from '@app/bundles/Sheet/SheetHeaders'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetGrid = memo(({
  columns,
  handleContextMenu,
  highlightColor,
  rows,
  sheetId,
  updateSheetActive,
  updateSheetCell,
  updateSheetColumn,
  sheetVisibleColumns,
  sheetVisibleRows,
}: SheetGridProps) => {

  const grid = useRef()
  useEffect(() => {
    if(grid && grid.current) { 
    // @ts-ignore
      grid.current.resetAfterColumnIndex(0)
    // @ts-ignore
      grid.current.resetAfterRowIndex(0)
    }
  }, [ columns, sheetVisibleColumns ])

  const rerenderAfterUpdateSheetColumn = (columnId: string, updates: SheetColumnUpdates) => {
    updateSheetColumn(columnId, updates)
    // @ts-ignore
      grid.current.resetAfterColumnIndex(0)
    // @ts-ignore
      grid.current.resetAfterRowIndex(0)
  }

  const GridWrapper = forwardRef(({ children, ...rest }, ref) => (
    <GridContainer
      //@ts-ignore ref={ref}
      ref={ref} {...rest}>
      <SheetHeaders
        columns={columns}
        handleContextMenu={handleContextMenu}
        sheetVisibleColumns={sheetVisibleColumns}
        updateSheetActive={updateSheetActive}
        updateSheetColumn={(columnId: string, updates: SheetColumnUpdates) => rerenderAfterUpdateSheetColumn(columnId, updates)}/>
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
    const columnId = sheetVisibleColumns[columnIndex]
    const rowId = sheetVisibleRows[rowIndex]
    if(columnId !== 'COLUMN_BREAK' && rowId !== 'ROW_BREAK') {
      return (
        <SheetCell
          cellId={rows[rowId].cells[columnId]}
          highlightColor={highlightColor}
          sheetId={sheetId}
          style={style}
          type={columns[columnId].type}
          updateSheetCell={updateSheetCell}/>
      )
    }
    return (
      <SheetBreakCell
        style={style}/>
    )
  }
  
  return (
    <Autosizer>
      {({ width, height }) => (
        <Grid
          ref={grid}
          innerElementType={GridWrapper}
          width={width}
          height={height}
          columnWidth={columnIndex => sheetVisibleColumns[columnIndex] === 'COLUMN_BREAK' ? 10 : columns[sheetVisibleColumns[columnIndex]].width}
          columnCount={sheetVisibleColumns.length}
          rowHeight={rowIndex => 24}
          rowCount={sheetVisibleRows.length}
          overscanColumnCount={sheetVisibleColumns.length}
          overscanRowCount={3}>
          {Cell}
        </Grid>
      )}
    </Autosizer>
  )
}, areEqual)

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetGridProps {
  columns: SheetColumns
  handleContextMenu(e: MouseEvent, type: string, id: string): void
  highlightColor: string
  rows: SheetRows
  sheetId: string
  updateSheetActive(updates: SheetActiveUpdates): void
  updateSheetCell(cellId: string, updates: SheetCellUpdates, undoUpdates: SheetCellUpdates): void
  updateSheetColumn(columnId: string, updates: SheetColumnUpdates): void
  sheetVisibleColumns: SheetColumn['id'][]
  sheetVisibleRows: SheetRow['id'][]
}

interface CellProps {
  columnIndex: number
  rowIndex: number
  style: {}
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const GridContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: white;
`

const GridItems = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetGrid
