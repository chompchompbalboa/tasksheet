//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { memo, useLayoutEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { areEqual, VariableSizeList as List } from 'react-window'
import styled from 'styled-components'

import { IAppState } from '@/state'
import { ISheet } from '@/state/sheet/types'

import Autosizer from 'react-virtualized-auto-sizer'
import SheetRow from '@mobile/Sheet/SheetRow'
import SheetRowBreak from '@mobile/Sheet/SheetRowBreak'


//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
export const SheetList = memo(({
  sheetId
}: ISheetListProps) => {

  // Refs
  const list = useRef()

  // Redux
  const sheetActiveSheetViewId = useSelector((state: IAppState) => state.sheet.allSheets && state.sheet.allSheets[sheetId] && state.sheet.allSheets[sheetId].activeSheetViewId)
  const sheetViewVisibleColumns = useSelector((state: IAppState) => state.sheet.allSheetViews && state.sheet.allSheetViews[sheetActiveSheetViewId] && state.sheet.allSheetViews[sheetActiveSheetViewId].visibleColumns)
  const sheetVisibleRows = useSelector((state: IAppState) => state.sheet.allSheets && state.sheet.allSheets[sheetId] && state.sheet.allSheets[sheetId].visibleRows)

  useLayoutEffect(() => {
    if(list && list.current) { 
    // @ts-ignore
      list.current.resetAfterIndex(0)
    }
  }, [ sheetActiveSheetViewId ])

  // Get Row Height
  const getRowHeight = (index: number) => {
    if(sheetViewVisibleColumns) {
      const rowId = sheetVisibleRows[index]
      if(rowId === 'ROW_BREAK') {
        return 20
      }
      else {
        let rowHeight = 0
        sheetViewVisibleColumns.forEach(visibleColumnId => {
          if(visibleColumnId === 'COLUMN_BREAK') {
            rowHeight += 3
          }
          else {
            rowHeight += 30
          }
        })
        return rowHeight + 20
      }
    }
    return 0
  }

  // Row
  const Row = ({ 
    index, 
    style
  }: IRowProps) => {
    const rowId = sheetVisibleRows[index]
    if(rowId !== 'ROW_BREAK') {
      return (
        <SheetRow
          sheetId={sheetId}
          rowId={rowId}
          style={style}
          visibleColumns={sheetViewVisibleColumns}/>
      )
    }
    return (
      <SheetRowBreak
        style={style}/>
    )
  }

  return (
    <Container>
      <Autosizer>
        {({ width, height }) => (
          <List
            ref={list}
            width={width}
            height={height}
            itemCount={sheetVisibleRows ? sheetVisibleRows.length : 0}
            itemSize={getRowHeight}>
            {Row}
          </List>
        )}
      </Autosizer>
    </Container>
  )
}, areEqual)

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
export interface ISheetListProps {
  sheetId: ISheet['id']
}

interface IRowProps {
  index: number,
  style: any
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetList
