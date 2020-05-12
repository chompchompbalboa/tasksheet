//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetCellGanttRangeMilestone = ({
  backgroundColor,
  left
}: ISheetCellGanttRangeMilestone) => {

  return (
    <GanttMilestone
      data-testid="SheetCellGanttRangeMilestone"
      left={left}>
      <GanttMilestoneDot
        milestoneBackgroundColor={backgroundColor}/>
    </GanttMilestone>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface ISheetCellGanttRangeMilestone {
  backgroundColor: string
  left: number
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const GanttMilestone = styled.div`
  z-index: 10;
  position: absolute;
  left: calc(2.25px + ${ ({ left }: IGanttMilestone ) => left + '%' });
  height: 100%;
`
interface IGanttMilestone {
  left: number
}

const GanttMilestoneDot = styled.div`
  position: absolute;
  margin-top: 3px;
  width: 12px;
  height: 12px;
  border-radius: 4px;
  background-color: ${ ({ milestoneBackgroundColor }: IGanttMilestoneDot ) => milestoneBackgroundColor };
`
interface IGanttMilestoneDot {
  milestoneBackgroundColor: string
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetCellGanttRangeMilestone
