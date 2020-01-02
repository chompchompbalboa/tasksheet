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

import SheetCell from '@mobile/Sheet/SheetCell'
import SheetColumnBreak from '@mobile/Sheet/SheetColumnBreak'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
export const SheetRow = memo(({
  sheetId,
  rowId,
  style,
  visibleColumns
}: ISheetRowProps) => {

  const sheetRow = useSelector((state: IAppState) => state.sheet.allSheetRows && state.sheet.allSheetRows[rowId])

  return (
    <Container
      style={style}>
      <ContentContainer>
        {visibleColumns && visibleColumns.map((columnId, index) => {
          if(columnId === 'COLUMN_BREAK') {
            return (
              <SheetColumnBreak
                key={index}
                isFirstColumn={index === 0}
                isLastColumn={index === visibleColumns.length - 1}/>
            )
          }
          else {
            const cellId = sheetRow.cells[columnId]
            if(cellId) {
              return (
                <SheetCell
                  key={cellId}
                  sheetId={sheetId}
                  columnId={columnId}
                  cellId={cellId}
                  isFirstColumn={index === 0}
                  isLastColumn={index === visibleColumns.length - 1}/>
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
export interface ISheetRowProps {
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
  padding: 7px 10px;
`

const ContentContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: white;
  border-radius: 5px;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetRow
