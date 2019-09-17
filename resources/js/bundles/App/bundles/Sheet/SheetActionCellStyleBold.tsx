//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { BOLD } from '@app/assets/icons'

import { AppState } from '@app/state'
import { Sheet } from '@app/state/sheet/types'
import {
  updateSheet
} from '@app/state/sheet/actions'

import Icon from '@/components/Icon'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionCellStyleBold = ({
  sheetId
}: SheetActionCellStyleBoldProps) => {
  
  const dispatch = useDispatch()
  
  const userColorPrimary = useSelector((state: AppState) => state.user.color.primary)
  const rows = useSelector((state: AppState) => state.sheet.rows)
  const activeSelections = useSelector((state: AppState) => state.sheet.active.selections)
  const sheetStylesBold = useSelector((state: AppState) => state.sheet.sheets && state.sheet.sheets[sheetId] && state.sheet.sheets[sheetId].styles.BOLD)
  const sheetVisibleColumns = useSelector((state: AppState) => state.sheet.sheets && state.sheet.sheets[sheetId] && state.sheet.sheets[sheetId].visibleColumns)
  const sheetVisibleRows = useSelector((state: AppState) => state.sheet.sheets && state.sheet.sheets[sheetId] && state.sheet.sheets[sheetId].visibleRows)
  
  const [ localActiveSelections, setLocalActiveSelections ] = useState(activeSelections)
  useEffect(() => {
    if(activeSelections.cellId && activeSelections.rangeStartCellId) {
      setLocalActiveSelections(activeSelections)
    }
  }, [ activeSelections ])

  const handleContainerClick = () => {
    const {
      rangeStartCellId,
      rangeStartColumnId,
      rangeStartRowId,
      rangeEndCellId,
      rangeEndColumnId,
      rangeEndRowId,
    } = localActiveSelections

    // Range
    if(rangeEndCellId) {
      const isNextStyleBold = !sheetStylesBold.has(rangeStartCellId)
      const rangeStartColumnIndex = sheetVisibleColumns.findIndex(visibleColumnId => visibleColumnId === rangeStartColumnId)
      const rangeStartRowIndex = sheetVisibleRows.findIndex(visibleRowId => visibleRowId === rangeStartRowId)
      const rangeEndColumnIndex = sheetVisibleColumns.findIndex(visibleColumnId => visibleColumnId === rangeEndColumnId)
      const rangeEndRowIndex = sheetVisibleRows.findIndex(visibleRowId => visibleRowId === rangeEndRowId)
      const nextSheetStylesBold = new Set([ ...sheetStylesBold ])

      for(let rowIndex = rangeStartRowIndex; rowIndex <= rangeEndRowIndex; rowIndex++) {
        const rowId = sheetVisibleRows[rowIndex]
        if(rowId !== 'ROW_BREAK') {
          const row = rows[rowId]
          for(let columnIndex = rangeStartColumnIndex; columnIndex <= rangeEndColumnIndex; columnIndex++) {
            const columnId = sheetVisibleColumns[columnIndex]
            if(columnId !== 'COLUMN_BREAK') {
              const cellId = row.cells[columnId]
              isNextStyleBold ? nextSheetStylesBold.add(cellId) : nextSheetStylesBold.delete(cellId)
            }
          }
        }
      }
      dispatch(updateSheet(sheetId, { styles: { BOLD: nextSheetStylesBold }}, true))
    }
    // Cell
    else if(rangeStartCellId) {
      const isNextStyleBold = !sheetStylesBold.has(rangeStartCellId)
      const nextSheetStylesBold = new Set([ ...sheetStylesBold ])
      isNextStyleBold ? nextSheetStylesBold.add(rangeStartCellId) : nextSheetStylesBold.delete(rangeStartCellId)
      dispatch(updateSheet(sheetId, { styles: { BOLD: nextSheetStylesBold }}, true))
    }
  }

  return (
    <Container
      containerBackgroundColor={userColorPrimary}
      onClick={handleContainerClick}>
      <Icon 
        icon={BOLD}/>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetActionCellStyleBoldProps {
  sheetId: Sheet['id']
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  cursor: pointer;  
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgb(210, 210, 210);
  color: rgb(80, 80, 80);
  text-decoration: none;
  border-radius: 3px;
  padding: 0.4rem;
  transition: all 0.05s;
  &:hover {
    background-color: ${ ({ containerBackgroundColor }: IContainer) => containerBackgroundColor};
    color: rgb(240, 240, 240);
  }
`
interface IContainer {
  containerBackgroundColor: string
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetActionCellStyleBold
