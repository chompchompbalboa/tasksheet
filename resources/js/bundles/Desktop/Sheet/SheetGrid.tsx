//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { ReactText, forwardRef, memo, MouseEvent, useLayoutEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { areEqual, VariableSizeGrid as Grid } from 'react-window'
import styled from 'styled-components'

import { IAppState } from '@/state'

import Autosizer from 'react-virtualized-auto-sizer'
import SheetCell from '@desktop/Sheet/SheetCell'
import SheetBreakCell from '@desktop/Sheet/SheetBreakCell'
import SheetHeaders from '@desktop/Sheet/SheetHeaders'
import SheetRowLeader from '@desktop/Sheet/SheetRowLeader'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetGrid = memo(({
  sheetId,
  handleContextMenu,
}: SheetGridProps) => {

  // Redux
  const allSheetColumns = useSelector((state: IAppState) => state.sheet.allSheetColumns)
  const sheetActiveSheetViewId = useSelector((state: IAppState) => state.sheet.allSheets && state.sheet.allSheets[sheetId] && state.sheet.allSheets[sheetId].activeSheetViewId)
  const sheetViewVisibleColumns = useSelector((state: IAppState) => state.sheet.allSheetViews && state.sheet.allSheetViews[sheetActiveSheetViewId] && state.sheet.allSheetViews[sheetActiveSheetViewId].visibleColumns)
  const sheetVisibleRows = useSelector((state: IAppState) => state.sheet.allSheets && state.sheet.allSheets[sheetId] && state.sheet.allSheets[sheetId].visibleRows)
  const sheetVisibleRowLeaders = useSelector((state: IAppState) => state.sheet.allSheets && state.sheet.allSheets[sheetId] && state.sheet.allSheets[sheetId].visibleRowLeaders)

  const grid = useRef()
  const gridContainerRef = useRef()
  useLayoutEffect(() => {
    if(grid && grid.current) { 
    // @ts-ignore
      grid.current.resetAfterColumnIndex(0)
    // @ts-ignore
      grid.current.resetAfterRowIndex(0)
    }
  }, [ allSheetColumns, sheetViewVisibleColumns ])

  const GridWrapper = forwardRef(({ children, ...rest }, ref) => (
    <GridContainer
      //@ts-ignore ref={ref}
      ref={ref} {...rest}>
      <SheetHeaders
        sheetId={sheetId}
        gridContainerRef={gridContainerRef}
        handleContextMenu={handleContextMenu}/>
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
    const columnId = sheetViewVisibleColumns[columnIndex - 1]
    const rowId = sheetVisibleRows[rowIndex]
    if(columnIndex !== 0 && columnId !== 'COLUMN_BREAK' && rowId !== 'ROW_BREAK') {
      return (
        <SheetCell
          sheetId={sheetId}
          columnId={columnId}
          rowId={rowId}
          style={style}
          cellType={allSheetColumns[columnId].cellType}/>
      )
    }
    if(columnIndex === 0) {
      return (
        <SheetRowLeader 
          sheetId={sheetId}
          rowId={rowId}
          handleContextMenu={handleContextMenu}
          isRowBreak={rowId === 'ROW_BREAK'}
          style={style}
          text={sheetVisibleRowLeaders[rowIndex]}/>
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
          outerRef={gridContainerRef}
          innerElementType={GridWrapper}
          width={width}
          height={height}
          columnWidth={columnIndex => columnIndex === 0 ? 35 : (sheetViewVisibleColumns[columnIndex - 1] === 'COLUMN_BREAK' ? 10 : allSheetColumns[sheetViewVisibleColumns[columnIndex - 1]].width)}
          columnCount={sheetViewVisibleColumns.length + 1}
          rowHeight={rowIndex => 24}
          rowCount={sheetVisibleRows.length}
          overscanColumnCount={sheetViewVisibleColumns.length}
          overscanRowCount={2}>
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
  isActiveFile?: boolean
  handleContextMenu(e: MouseEvent, type: string, id: string): void
  sheetId: string
}

interface CellProps {
  columnIndex: number
  rowIndex: number
  style: {
    width?: ReactText
  }
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
  -webkit-overflow-scrolling: touch;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetGrid
