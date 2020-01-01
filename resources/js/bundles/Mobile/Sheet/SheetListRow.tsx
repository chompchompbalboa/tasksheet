//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { memo } from 'react'
import { useSelector } from 'react-redux'
import { areEqual } from 'react-window'
import styled from 'styled-components'

import { IAppState } from '@/state'
import { 
  ISheet,
  ISheetColumn,
  ISheetRow 
} from '@/state/sheet/types'

import SheetListRowCell from '@mobile/Sheet/SheetListRowCell'
import SheetListRowCellBreak from '@mobile/Sheet/SheetListRowCellBreak'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
export const SheetListRow = memo(({
  sheetId,
  rowId,
  style,
  visibleColumns
}: ISheetListRowProps) => {

  const sheetRow = useSelector((state: IAppState) => state.sheet.allSheetRows && state.sheet.allSheetRows[rowId])

  return (
    <Container
      style={style}>
      <ContentContainer>
        {visibleColumns && visibleColumns.map((columnId, index) => {
          if(columnId === 'COLUMN_BREAK') {
            return (
              <SheetListRowCellBreak
                key={index}/>
            )
          }
          else {
            const cellId = sheetRow.cells[columnId]
            if(cellId) {
              return (
                <SheetListRowCell
                  key={cellId}
                  sheetId={sheetId}
                  columnId={columnId}
                  cellId={cellId}/>
              )
            }
          }
        })}
      </ContentContainer>
    </Container>
  )
}, areEqual)

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
export interface ISheetListRowProps {
  sheetId: ISheet['id']
  rowId: ISheetRow['id']
  style: any
  visibleColumns: ISheetColumn['id'][]
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  width: 100%;
  padding: 10px;
`

const ContentContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: white;
  box-shadow: 1px 1px 10px 1px rgba(200, 200, 200, 1);
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetListRow
