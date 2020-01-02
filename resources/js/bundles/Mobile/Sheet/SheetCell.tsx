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
  ISheetCell, 
  ISheetStyles 
} from '@/state/sheet/types'

import SheetCellBoolean from '@mobile/Sheet/SheetCellBoolean'
import SheetCellDatetime from '@mobile/Sheet/SheetCellDatetime'
import SheetCellNumber from '@mobile/Sheet/SheetCellNumber'
import SheetCellPlaceholder from '@mobile/Sheet/SheetCellPlaceholder'
import SheetCellString from '@mobile/Sheet/SheetCellString'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
export const SheetCell = memo(({
  sheetId,
  columnId,
  cellId
}: ISheetCellProps) => {

  // Redux
  const sheetColumn = useSelector((state: IAppState) => state.sheet.allSheetColumns && state.sheet.allSheetColumns[columnId])
  const sheetCell = useSelector((state: IAppState) => state.sheet.allSheetCells && state.sheet.allSheetCells[cellId])
  const sheetStyles = useSelector((state: IAppState) => state.sheet.allSheets[sheetId].styles)

  if(sheetCell) {

    // Cell types
    const sheetCellTypes = {
      STRING: SheetCellString,
      NUMBER: SheetCellNumber,
      BOOLEAN: SheetCellBoolean,
      DATETIME: SheetCellDatetime,
      PHOTOS: SheetCellPlaceholder,
      FILES: SheetCellPlaceholder
    }
    const SheetCellType = sheetCellTypes[sheetColumn.cellType]

    return (
      <Container>
        <Column>{sheetColumn.name}</Column>
        <Cell
          cellId={cellId}
          isCellSelected={false}
          sheetStyles={sheetStyles}>
          <SheetCellType
            sheetId={sheetId}
            cell={sheetCell}/>
        </Cell>
      </Container>
    )
  }
  return (
    <Container/>
  )
}, areEqual)

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
export interface ISheetCellProps {
  sheetId: ISheet['id']
  columnId: ISheetColumn['id']
  cellId: ISheetCell['id']
}

export interface ISheetCellTypesSharedProps {
  sheetId: ISheet['id']
  cell: ISheetCell
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
  height: 100%;
  padding-left: 0.5rem;
  display: flex;
  align-items: center;
  background-color: rgb(250, 250, 250);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const Cell = styled.div`
  width: 75%;
  height: 100%;
  padding: 0 0.5rem;
  display: flex;
  align-items: center;
  text-overflow: ellipsis;
  background-color: ${ ({ cellId, isCellSelected, sheetStyles }: ICell ) => 
    sheetStyles.backgroundColor.has(cellId)
      ? sheetStyles.backgroundColorReference[cellId]
      : isCellSelected
        ? 'rgb(245, 245, 245)'
        : 'white'
  };
`
interface ICell {
  cellId: ISheetCell['id']
  isCellSelected: boolean
  sheetStyles: ISheetStyles
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetCell
