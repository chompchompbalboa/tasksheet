//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { memo } from 'react'
import { useSelector } from 'react-redux'
import { areEqual, VariableSizeList as List } from 'react-window'
import styled from 'styled-components'

import { IAppState } from '@/state'
import { ISheet } from '@/state/sheet/types'

import Autosizer from 'react-virtualized-auto-sizer'
import SheetListRow from '@mobile/Sheet/SheetListRow'
import SheetListRowBreak from '@mobile/Sheet/SheetListRowBreak'


//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
export const SheetList = memo(({
  sheetId
}: ISheetListProps) => {

  // Redux
  const sheetActiveSheetViewId = useSelector((state: IAppState) => state.sheet.allSheets && state.sheet.allSheets[sheetId] && state.sheet.allSheets[sheetId].activeSheetViewId)
  const sheetViewVisibleColumns = useSelector((state: IAppState) => state.sheet.allSheetViews && state.sheet.allSheetViews[sheetActiveSheetViewId] && state.sheet.allSheetViews[sheetActiveSheetViewId].visibleColumns)
  const sheetVisibleRows = useSelector((state: IAppState) => state.sheet.allSheets && state.sheet.allSheets[sheetId] && state.sheet.allSheets[sheetId].visibleRows)

  // Row
  const Row = ({ 
    index, 
    style
  }: IRowProps) => {
    const rowId = sheetVisibleRows[index]
    if(rowId !== 'ROW_BREAK') {
      return (
        <SheetListRow
          sheetId={sheetId}
          rowId={rowId}
          style={style}/>
      )
    }
    return (
      <SheetListRowBreak
        style={style}/>
    )
  }

  return (
    <Container>
      <Autosizer>
        {({ width, height }) => (
          <List
            width={width}
            height={height}
            itemCount={sheetVisibleRows ? sheetVisibleRows.length : 0}
            itemSize={sheetViewVisibleColumns ? () => sheetViewVisibleColumns.length * 20 : () => 0}>
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
