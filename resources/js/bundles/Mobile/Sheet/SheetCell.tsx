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
  cellId,
  isFirstColumn,
  isLastColumn
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
      <Container
        isLastColumn={isLastColumn}>
        <Column
          isFirstColumn={isFirstColumn}
          isLastColumn={isLastColumn}>
          {sheetColumn.name}
        </Column>
        <Cell
          cellId={cellId}
          isCellSelected={false}
          isFirstColumn={isFirstColumn}
          isLastColumn={isLastColumn}
          sheetStyles={sheetStyles}>
          <SheetCellType
            sheetId={sheetId}
            columnId={columnId}
            cell={sheetCell}
            isTrackCellChanges={sheetColumn.trackCellChanges}/>
        </Cell>
      </Container>
    )
  }
  return (
    <Container
      isLastColumn={isLastColumn}/>
  )
}, areEqual)

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
export interface ISheetCellProps {
  sheetId: ISheet['id']
  columnId: ISheetColumn['id']
  cellId: ISheetCell['id']
  isFirstColumn: boolean
  isLastColumn: boolean
}

export interface ISheetCellTypesSharedProps {
  sheetId: ISheet['id']
  columnId: ISheetColumn['id']
  cell: ISheetCell
  isTrackCellChanges: boolean
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
  border-bottom: ${ ({ isLastColumn }: IContainer) => isLastColumn ? 'none' : '1px solid rgb(200, 200, 200)' };
`
interface IContainer {
  isLastColumn: boolean
}

const Column = styled.div`
  width: 30%;
  height: 100%;
  padding-left: 0.5rem;
  display: flex;
  align-items: center;
  background-color: rgb(242, 242, 242);
  border-right: 1px solid rgb(200, 200, 200);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border-top-left-radius: ${ ({ isFirstColumn }: IColumn) => isFirstColumn ? '5px' : 'none' };
  border-bottom-left-radius: ${ ({ isLastColumn }: IColumn) => isLastColumn ? '5px' : 'none' };
`
interface IColumn {
  isFirstColumn: boolean
  isLastColumn: boolean
}

const Cell = styled.div`
  width: 70%;
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
  border-top-right-radius: ${ ({ isFirstColumn }: ICell) => isFirstColumn ? '5px' : 'none' };
  border-bottom-right-radius: ${ ({ isLastColumn }: ICell) => isLastColumn ? '5px' : 'none' };
`
interface ICell {
  cellId: ISheetCell['id']
  isCellSelected: boolean
  isFirstColumn: boolean
  isLastColumn: boolean
  sheetStyles: ISheetStyles
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetCell
