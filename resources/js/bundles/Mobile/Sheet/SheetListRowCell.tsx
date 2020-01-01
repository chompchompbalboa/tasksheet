//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { ChangeEvent, memo, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { areEqual } from 'react-window'
import styled from 'styled-components'

import { IAppState } from '@/state'
import { 
  ISheet,
  ISheetColumn, 
  ISheetCell, 
  ISheetStyles 
} from '@/state/sheet/types'

import { updateSheetCell } from '@/state/sheet/actions'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
export const SheetListRowCell = memo(({
  sheetId,
  columnId,
  cellId
}: ISheetListRowCellProps) => {

  // Redux
  const dispatch = useDispatch()
  const sheetColumn = useSelector((state: IAppState) => state.sheet.allSheetColumns && state.sheet.allSheetColumns[columnId])
  const sheetCell = useSelector((state: IAppState) => state.sheet.allSheetCells && state.sheet.allSheetCells[cellId])
  const sheetStyles = useSelector((state: IAppState) => state.sheet.allSheets[sheetId].styles)

  // State
  const [ sheetCellValue, setSheetCellValue ] = useState(sheetCell ? sheetCell.value : '')

  // Effects
  useEffect(() => {
    setSheetCellValue(sheetCell.value)
  }, [ sheetCell.value ])

  // Handle Input Blur
  const handleInputBlur = () => {
    if(sheetCell.value !== sheetCellValue) {
      dispatch(updateSheetCell(cellId, { value: sheetCellValue }))
    }
  }

  if(sheetCell) {
    return (
      <Container>
        <Column>{sheetColumn.name}</Column>
        <Cell
          cellId={cellId}
          isCellSelected={false}
          sheetStyles={sheetStyles}>
          <StyledInput
            onBlur={handleInputBlur}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSheetCellValue(e.target.value)}
            value={sheetCellValue || ''}/>
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
export interface ISheetListRowCellProps {
  sheetId: ISheet['id']
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

const StyledInput = styled.input`
  width: 100%;
  height: 100%;
  font-size: inherit;
  font-weight: inherit;
  font-family: inherit;
  color: inherit;
  letter-spacing: inherit;
  border: none;
  outline: none;
  background-color: transparent;
  text-align: right;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetListRowCell
