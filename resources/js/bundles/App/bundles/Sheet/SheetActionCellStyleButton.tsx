//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { AppState } from '@app/state'
import { Sheet } from '@app/state/sheet/types'

import Icon from '@/components/Icon'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionCellStyleButton = ({
  sheetId,
  icon,
  sheetStylesSet,
  updateSheetStylesSet
}: SheetActionCellStyleButtonProps) => {
  
  const userColorPrimary = useSelector((state: AppState) => state.user.color.primary)
  const allSheetRows = useSelector((state: AppState) => state.sheet.allSheetRows)
  const selections = useSelector((state: AppState) => state.sheet.allSheets && state.sheet.allSheets[sheetId] && state.sheet.allSheets[sheetId].selections)
  const sheetVisibleColumns = useSelector((state: AppState) => state.sheet.allSheets && state.sheet.allSheets[sheetId] && state.sheet.allSheets[sheetId].visibleColumns)
  const sheetVisibleRows = useSelector((state: AppState) => state.sheet.allSheets && state.sheet.allSheets[sheetId] && state.sheet.allSheets[sheetId].visibleRows)
  
  const addOrDeleteFromSet = sheetStylesSet && sheetStylesSet.has(selections.rangeStartCellId) ? 'DELETE' : 'ADD'

  const handleContainerClick = () => {
    const {
      rangeStartCellId,
      rangeStartColumnId,
      rangeStartRowId,
      rangeEndCellId,
      rangeEndColumnId,
      rangeEndRowId,
    } = selections

    // Range
    if(rangeEndCellId) {
      const rangeStartColumnIndex = sheetVisibleColumns.findIndex(visibleColumnId => visibleColumnId === rangeStartColumnId)
      const rangeStartRowIndex = sheetVisibleRows.findIndex(visibleRowId => visibleRowId === rangeStartRowId)
      const rangeEndColumnIndex = sheetVisibleColumns.findIndex(visibleColumnId => visibleColumnId === rangeEndColumnId)
      const rangeEndRowIndex = sheetVisibleRows.findIndex(visibleRowId => visibleRowId === rangeEndRowId)
      const nextSheetStylesSet = new Set([ ...sheetStylesSet ])

      for(let rowIndex = rangeStartRowIndex; rowIndex <= rangeEndRowIndex; rowIndex++) {
        const rowId = sheetVisibleRows[rowIndex]
        if(rowId !== 'ROW_BREAK') {
          const row = allSheetRows[rowId]
          for(let columnIndex = rangeStartColumnIndex; columnIndex <= rangeEndColumnIndex; columnIndex++) {
            const columnId = sheetVisibleColumns[columnIndex]
            if(columnId !== 'COLUMN_BREAK') {
              const cellId = row.cells[columnId]
              addOrDeleteFromSet === 'ADD' ? nextSheetStylesSet.add(cellId) : nextSheetStylesSet.delete(cellId)
            }
          }
        }
      }
      updateSheetStylesSet(nextSheetStylesSet)
    }
    // Cell
    else if(rangeStartCellId) {
      const nextSheetStylesSet = new Set([ ...sheetStylesSet ])
      addOrDeleteFromSet === 'ADD' ? nextSheetStylesSet.add(rangeStartCellId) : nextSheetStylesSet.delete(rangeStartCellId)
      updateSheetStylesSet(nextSheetStylesSet)
    }
  }

  return (
    <Container
      containerBackgroundColor={userColorPrimary}
      onClick={handleContainerClick}>
      <Icon 
        icon={icon}/>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetActionCellStyleButtonProps {
  sheetId: Sheet['id']
  icon: string
  sheetStylesSet: Set<string>
  updateSheetStylesSet(nextSheetStylesSet: Set<string>): void
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  margin-right: 0.375rem;
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
export default SheetActionCellStyleButton
