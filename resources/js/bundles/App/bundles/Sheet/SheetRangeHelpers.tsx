//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { memo, useLayoutEffect, useState } from 'react'
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
  
  const isRangeStartCellRendered = useSelector((state: AppState) => state.sheet.active.selections.isRangeStartCellRendered)
  const isRangeEndCellRendered = useSelector((state: AppState) => state.sheet.active.selections.isRangeEndCellRendered)
  const rangeEndCellId = useSelector((state: AppState) => state.sheet.active.selections.rangeEndCellId)
  const rangeStartCellId = useSelector((state: AppState) => state.sheet.active.selections.rangeStartCellId)
  const rangeStartColumnId = useSelector((state: AppState) => state.sheet.active.selections.rangeStartColumnId)
  const rangeWidth = useSelector((state: AppState) => state.sheet.active.selections.rangeWidth)
  
  const [ isRangeHelperRendered, setIsRangeHelperRendered ] = useState(!isRangeStartCellRendered && !isRangeEndCellRendered && rangeStartCellId !== null && rangeEndCellId !== null)
  
  const [ previousIsRangeStartCellRendered, setPreviousIsRangeStartCellRendered ] = useState([ false ])
  const [ previousIsRangeEndCellRendered, setPreviousIsRangeEndCellRendered ] = useState([ false ])
  
  useLayoutEffect(() => {
    const nextPreviousIsRangeStartCellRendered = [ isRangeStartCellRendered, ...previousIsRangeStartCellRendered ].slice(0, 2)
    const nextPreviousIsRangeEndCellRendered = [ isRangeEndCellRendered, ...previousIsRangeEndCellRendered].slice(0, 2)
    setPreviousIsRangeStartCellRendered(nextPreviousIsRangeStartCellRendered)
    setPreviousIsRangeEndCellRendered(nextPreviousIsRangeEndCellRendered)
    const isWindowBetweenRangeStartCellAndRangeEndCell = 
          previousIsRangeStartCellRendered[0] === true && previousIsRangeStartCellRendered[1] === false && previousIsRangeEndCellRendered[0] === false && previousIsRangeEndCellRendered[1] === true
    console.log('Start:', nextPreviousIsRangeStartCellRendered,previousIsRangeStartCellRendered)
    console.log('End:', nextPreviousIsRangeEndCellRendered, previousIsRangeEndCellRendered)
    console.log('Window:', isWindowBetweenRangeStartCellAndRangeEndCell)
    const nextIsRangeHelperRendered = !isRangeStartCellRendered && !isRangeEndCellRendered && rangeStartCellId && rangeEndCellId && isWindowBetweenRangeStartCellAndRangeEndCell
    setIsRangeHelperRendered(nextIsRangeHelperRendered)
  }, [ isRangeStartCellRendered, isRangeEndCellRendered, rangeStartCellId, rangeEndCellId ])
  
  return (
    <Container>
      {sheetVisibleColumns.map((columnId, index) => (
        <SheetRangeColumn
          key={index}
          columnWidth={columnId === 'COLUMN_BREAK' ? 10 : columns[columnId].width}>
          <SheetRange
            rangeWidth={rangeWidth}
            isVisible={isRangeHelperRendered && columnId === rangeStartColumnId}/>
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
