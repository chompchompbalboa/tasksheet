//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { IAppState } from '@/state'
import { 
  ISheet,
  ISheetColumn,
  ISheetGanttRange 
} from '@/state/sheet/types'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetCellGanttRangeMilestone = ({
  left
}: ISheetCellGanttRangeMilestone) => {

  // Redux
  const userColorPrimary = useSelector((state: IAppState) => state.user.color.primary)

  return (
    <GanttMilestone
      data-testid="SheetCellGanttRangeMilestone"
      left={left}>
      <GanttMilestoneDot
        milestoneBackgroundColor={userColorPrimary}/>
    </GanttMilestone>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface ISheetCellGanttRangeMilestone {
  sheetId: ISheet['id']
  columnId: ISheetColumn['id']
  sheetGanttRangeId: ISheetGanttRange['id']
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
