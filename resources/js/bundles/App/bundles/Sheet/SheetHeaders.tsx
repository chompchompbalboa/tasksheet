//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { MouseEvent, RefObject } from 'react'
import styled from 'styled-components'

import { ISheet, ISheetColumn, IAllSheetColumns } from '@app/state/sheet/types'

import SheetHeader from '@app/bundles/Sheet/SheetHeader'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetHeaders = ({
  sheetId,
  gridContainerRef,
  columns,
  handleContextMenu,
  sheetViewVisibleColumns
}: SheetHeadersProps) => {
  
  const columnBreakHeader: ISheetColumn = {
    id: 'COLUMN_BREAK',
    sheetId: '',
    name: 'Break',
    width: 10,
    cellType: null,
    defaultValue: null,
    trackCellChanges: false,
    showCellChanges: false,
    allCellValues: null
  }
  
  const isNextColumnAColumnBreak = (index: number) => {
    return sheetViewVisibleColumns[index + 1] && sheetViewVisibleColumns[index + 1] === 'COLUMN_BREAK'
  } 

  return (
    <Container>
      <SheetRowLeaderHeader>
        <SheetRowLeaderHeaderText>
          +
        </SheetRowLeaderHeaderText>
      </SheetRowLeaderHeader>
      {sheetViewVisibleColumns.map((columnId: string, index: number) => (
        <SheetHeader
          key={index}
          sheetId={sheetId}
          column={columnId !== 'COLUMN_BREAK' ? columns[columnId] : columnBreakHeader}
          gridContainerRef={gridContainerRef}
          handleContextMenu={handleContextMenu}
          isLast={index === sheetViewVisibleColumns.length - 1}
          isNextColumnAColumnBreak={isNextColumnAColumnBreak(index)}
          visibleColumnsIndex={index}/>))}
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetHeadersProps {
  sheetId: ISheet['id']
  columns: IAllSheetColumns
  gridContainerRef: RefObject<HTMLDivElement>
  handleContextMenu(e: MouseEvent, type: string, id: string, index?: number): void
  sheetViewVisibleColumns: ISheetColumn['id'][]
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  z-index: 1000;
  position: sticky;
  top: 0;
  left: 0;
  height: 1.6rem;
`

const SheetRowLeaderHeader = styled.div`
  z-index: 10;
  position: relative;
  cursor: default;
  display: inline-flex;
  user-select: none;
  width: 35px;
  height: 100%;
  text-align: left;
  background-color: rgb(250, 250, 250);
  box-shadow: inset 0 -1px 0px 0px rgba(180,180,180,1);
  border-right: 1px solid rgb(230, 230, 230);
  &:hover {
    background-color: rgb(243, 243, 243);
  }
`

const SheetRowLeaderHeaderText = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0.25rem 0 0.25rem 0.125rem;
  width: 100%;
  white-space: nowrap;
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  font-weight: bold;
  color: transparent;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetHeaders
