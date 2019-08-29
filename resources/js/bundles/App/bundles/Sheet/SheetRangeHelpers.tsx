//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { memo } from 'react'
import { useSelector } from 'react-redux'
import { areEqual } from 'react-window'
import styled from 'styled-components'

import { AppState } from '@app/state'
import { SheetColumn, SheetColumns } from '@app/state/sheet/types'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetRangeHelpers = memo(({
  columns,
  sheetVisibleColumns
}: SheetRangeHelpersProps) => {

  const rangeStartColumnId = useSelector((state: AppState) => state.sheet.active.selections.rangeStartColumnId)
  const rangeWidth = useSelector((state: AppState) => state.sheet.active.selections.rangeWidth)
  const shouldRangeHelperRender = useSelector((state: AppState) => state.sheet.active.selections.shouldRangeHelperRender)
  
  return (
    <Container>
      {sheetVisibleColumns.map((columnId, index) => (
        <SheetRangeColumn
          key={index}
          columnWidth={columnId === 'COLUMN_BREAK' ? 10 : columns[columnId].width}>
          <SheetRange
            rangeWidth={rangeWidth}
            isVisible={shouldRangeHelperRender && columnId === rangeStartColumnId}/>
        </SheetRangeColumn>
      ))}
    </Container>
  )
}, areEqual)

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetRangeHelpersProps {
  columns: SheetColumns
  sheetVisibleColumns: SheetColumn['id'][]
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  z-index: 5;
  position: absolute;
  top: 0;
  left: 0;
  padding-left: 30px;
`

const SheetRangeColumn = styled.div`
  display: inline-block;
  width: ${ ({ columnWidth }: SheetRangeColumnProps ) => columnWidth + 'px' };
  height: 1px;
`
interface SheetRangeColumnProps {
  columnWidth: number
}

const SheetRange = styled.div`
  pointer-events: none;
  z-index: 0;
  position: relative;
  top: calc(-5rem);
  left: 0;
  display: ${ ({ isVisible }: SheetRangeProps ) => isVisible ? 'block' : 'none' };
  width: ${ ({ rangeWidth }: SheetRangeProps ) => rangeWidth + 'px' };
  height: 120vh;
  background-color: #1C49AD;
  opacity: 0.15;
`
interface SheetRangeProps {
  rangeWidth: number
  isVisible: boolean
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetRangeHelpers
