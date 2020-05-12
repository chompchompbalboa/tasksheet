//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { IAppState } from '@/state'
import { ISheetCellTypesSharedProps } from '@desktop/Sheet/SheetCell'

import SheetCellContainer from '@desktop/Sheet/SheetCellContainer'
import SheetCellGanttRange from '@desktop/Sheet/SheetCellGanttRange'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetCellGantt = ({
  sheetId,
  columnId,
  rowId,
  cell
}: ISheetCellTypesSharedProps) => {

  // Redux
  const sheetGantt = useSelector((state: IAppState) => {
    const sheetGanttId = state.sheet.allSheets[sheetId]?.gantts && state.sheet.allSheets[sheetId]?.gantts[columnId]
    if(state.sheet.allSheetGantts && sheetGanttId) {
      return state.sheet.allSheetGantts[sheetGanttId]
    }
    return null
  })
  const sheetGanttRanges = useSelector((state: IAppState) => sheetGantt && state.sheet.allSheets[sheetId]?.ganttRanges[sheetGantt.id])

  return (
    <SheetCellContainer
      testId="SheetCellGantt"
      sheetId={sheetId}
      cell={cell}
      cellType='GANTT'
      containerPadding="0.15rem 0"
      onlyRenderChildren
      value={cell.value}>
        {sheetGantt &&
          <Container>
            {sheetGanttRanges && sheetGanttRanges.map(sheetGanttRangeId => (
              <SheetCellGanttRange
                key={sheetGanttRangeId}
                sheetId={sheetId}
                columnId={columnId}
                rowId={rowId}
                sheetGanttRangeId={sheetGanttRangeId}/>
            ))}
          </Container>
        }
    </SheetCellContainer>
  )
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetCellGantt
