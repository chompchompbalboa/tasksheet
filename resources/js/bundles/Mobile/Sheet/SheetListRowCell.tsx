//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { memo } from 'react'
import { useSelector } from 'react-redux'
import { areEqual } from 'react-window'
import styled from 'styled-components'

import { IAppState } from '@/state'
import { ISheetColumn, ISheetCell } from '@/state/sheet/types'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
export const SheetListRowCell = memo(({
  columnId,
  cellId
}: ISheetListRowCellProps) => {

  // Redux
  const sheetColumn = useSelector((state: IAppState) => state.sheet.allSheetColumns && state.sheet.allSheetColumns[columnId])
  const sheetCell = useSelector((state: IAppState) => state.sheet.allSheetCells && state.sheet.allSheetCells[cellId])

  return (
    <Container>
      <Column>{sheetColumn.name}</Column>
      <Cell>{sheetCell.value}</Cell>
    </Container>
  )
}, areEqual)

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
export interface ISheetListRowCellProps {
  columnId: ISheetColumn['id']
  cellId: ISheetCell['id']
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  height: 30px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgb(200, 200, 200);
`

const Column = styled.div`
  width: 25%;
  padding-left: 0.5rem;
  background-color: rgb(250, 250, 250);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const Cell = styled.div`
  width: 75%;
  padding-right: 0.5rem;
  text-align: right;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetListRowCell
