//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { MouseEvent } from 'react'
import styled from 'styled-components'

import { ISheet, ISheetColumn, IAllSheetColumns } from '@app/state/sheet/types'

import SheetHeader from '@app/bundles/Sheet/SheetHeader'
import SheetRowLeader from '@app/bundles/Sheet/SheetRowLeader'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetHeaders = ({
  sheetId,
  columns,
  handleContextMenu,
  sheetVisibleColumns
}: SheetHeadersProps) => {
  
  const columnBreakHeader: ISheetColumn = {
    id: 'COLUMN_BREAK',
    sheetId: '',
    name: 'Break',
    width: 10,
    typeId: null
  }
  
  const isNextColumnAColumnBreak = (index: number) => {
    return sheetVisibleColumns[index + 1] && sheetVisibleColumns[index + 1] === 'COLUMN_BREAK'
  } 

  return (
    <Container>
      <SheetRowLeader
        sheetId={null}
        rowId={'SHEET_HEADER'}
        isRowBreak={false}
        style={{ width: '35px' }}/>
      {sheetVisibleColumns.map((columnId: string, index: number) => (
        <SheetHeader
          key={index}
          sheetId={sheetId}
          column={columnId !== 'COLUMN_BREAK' ? columns[columnId] : columnBreakHeader}
          visibleColumnsIndex={index}
          handleContextMenu={handleContextMenu}
          isLast={index === sheetVisibleColumns.length - 1}
          isNextColumnAColumnBreak={isNextColumnAColumnBreak(index)}/>))}
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetHeadersProps {
  sheetId: ISheet['id']
  columns: IAllSheetColumns
  handleContextMenu(e: MouseEvent, type: string, id: string, index?: number): void
  sheetVisibleColumns: ISheetColumn['id'][]
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  z-index: 1000;
  position: sticky;
  top: 0;
  left: 0;
  height: 3.5vh;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetHeaders
