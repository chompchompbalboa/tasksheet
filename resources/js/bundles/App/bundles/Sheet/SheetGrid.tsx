//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { forwardRef, memo, MouseEvent, useRef } from 'react'
import { areEqual, VariableSizeGrid as Grid } from 'react-window'
import styled from 'styled-components'

import { 
  SheetColumn, SheetColumns, SheetColumnUpdates,
  SheetCellUpdates, 
  SheetRow, SheetRows 
} from '@app/state/sheet/types'

import Autosizer from 'react-virtualized-auto-sizer'
import SheetCell from '@app/bundles/Sheet/SheetCell'
import SheetGroupCell from '@app/bundles/Sheet/SheetGroupCell'
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
  updateSheetCell,
  updateSheetColumn,
  sheetVisibleColumns,
  sheetVisibleRows,
}: SheetGridProps) => {

  const grid = useRef()

  const rerenderAfterUpdateSheetColumn = (columnId: string, updates: SheetColumnUpdates) => {
    updateSheetColumn(columnId, updates)
    // @ts-ignore
    grid.current.resetAfterColumnIndex(0)
  }

  const GridWrapper = forwardRef(({ children, ...rest }, ref) => (
    <GridContainer
      //@ts-ignore ref={ref}
      ref={ref} {...rest}>
      <SheetHeaders
        columns={columns}
        handleContextMenu={handleContextMenu}
        sheetVisibleColumns={sheetVisibleColumns}
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
    const rowId = sheetVisibleRows[rowIndex]
    if(rowId !== 'GROUP_HEADER') {
      return (
        <SheetCell
          cellId={rows[sheetVisibleRows[rowIndex]].cells[columnIndex]}
          highlightColor={highlightColor}
          row={rows[sheetVisibleRows[rowIndex]]}
          sheetId={sheetId}
          style={style}
          type={columns[sheetVisibleColumns[columnIndex]].type}
          updateSheetCell={updateSheetCell}/>
      )
    }
    return (
      <SheetGroupCell
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
          columnWidth={columnIndex => columns[sheetVisibleColumns[columnIndex]].width}
          columnCount={sheetVisibleColumns.length}
          rowHeight={index => 24}
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
  updateSheetCell(cellId: string, updates: SheetCellUpdates): void
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
