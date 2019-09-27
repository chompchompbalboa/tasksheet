//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { MouseEvent, useState } from 'react'
import styled from 'styled-components'

import { ISheet, SheetActiveUpdates, ISheetColumn, IAllSheetColumns, SheetColumnUpdates } from '@app/state/sheet/types'

import SheetHeader from '@app/bundles/Sheet/SheetHeader'
import SheetRowLeader from '@app/bundles/Sheet/SheetRowLeader'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetHeaders = ({
  sheetId,
  columns,
  handleContextMenu,
  sheetVisibleColumns,
  updateSheetActive,
  updateSheetColumn
}: SheetHeadersProps) => {

  const [ isResizing, setIsResizing ] = useState(false)
  const handleResizeEnd = (columnId: ISheetColumn['id'], columnWidthChange: number) => {
    const column = columns[columnId]
    updateSheetColumn(columnId, { width: column.width + columnWidthChange })
  }
  
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
        style={{ width: '30px' }}/>
      {sheetVisibleColumns.map((columnId: string, index: number) => (
        <SheetHeader
          key={index}
          sheetId={sheetId}
          column={columnId !== 'COLUMN_BREAK' ? columns[columnId] : columnBreakHeader}
          visibleColumnsIndex={index}
          handleContextMenu={handleContextMenu}
          isLast={index === sheetVisibleColumns.length - 1}
          isNextColumnAColumnBreak={isNextColumnAColumnBreak(index)}
          isResizing={isResizing}
          onResizeStart={() => setIsResizing(true)}
          onResizeEnd={(columnWidthChange: number) => handleResizeEnd(columnId, columnWidthChange)}
          updateSheetActive={updateSheetActive}
          updateSheetColumn={updateSheetColumn}/>))}
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
  updateSheetActive(updates: SheetActiveUpdates): void
  updateSheetColumn(columnId: ISheetColumn['id'], updates: SheetColumnUpdates): void
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
