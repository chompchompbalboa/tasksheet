//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import moment from 'moment'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { IAppState } from '@/state'
import { 
  ISheet,
  ISheetColumn,
  ISheetRow,
  ISheetGanttRange 
} from '@/state/sheet/types'

import SheetCellGanttRangeMilestone from '@desktop/Sheet/SheetCellGanttRangeMilestone'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetCellGanttRange = ({
  sheetId,
  columnId,
  rowId,
  sheetGanttRangeId
}: ISheetCellGanttRange) => {

  // Redux
  const sheetGantt = useSelector((state: IAppState) => {
    const sheetGanttId = state.sheet.allSheets[sheetId]?.gantts[columnId]
    return state.sheet.allSheetGantts[sheetGanttId]
  })
  const sheetGanttRangeStartDate = useSelector((state: IAppState) => {
    const sheetGanttRange = state.sheet.allSheetGanttRanges[sheetGanttRangeId]
    const startDateColumnId = sheetGanttRange.startDateColumnId
    if(startDateColumnId) {
      const sheetCellId = state.sheet.allSheetRows[rowId].cells[startDateColumnId]
      const sheetCell = state.sheet.allSheetCells[sheetCellId]
      return sheetCell.value && moment(sheetCell.value)
    }
    return null
  })
  const sheetGanttRangeEndDate = useSelector((state: IAppState) => {
    const sheetGanttRange = state.sheet.allSheetGanttRanges[sheetGanttRangeId]
    const endDateColumnId = sheetGanttRange.endDateColumnId
    if(endDateColumnId) {
      const sheetCellId = state.sheet.allSheetRows[rowId].cells[endDateColumnId]
      const sheetCell = state.sheet.allSheetCells[sheetCellId]
      return sheetCell.value && moment(sheetCell.value)
    }
    return null
  })
  const userColorPrimary = useSelector((state: IAppState) => state.user.color.primary)

  const sheetGanttNumberOfDays = moment(sheetGantt.endDate).diff(moment(sheetGantt.startDate), 'days')

  const sheetGanttRangeNumberOfDays = sheetGanttRangeEndDate && moment(sheetGanttRangeEndDate).diff(moment(sheetGanttRangeStartDate), 'days')
  const sheetGanttRangeStartDay = moment(sheetGanttRangeStartDate).diff(moment(sheetGantt.startDate), 'days')
  const sheetGanttRangeEndDay = sheetGanttRangeEndDate && moment(sheetGanttRangeEndDate).diff(moment(sheetGantt.startDate), 'days')

  return (
    <>
      {sheetGanttRangeStartDate && sheetGanttRangeStartDay >= 0 && sheetGanttRangeStartDay <= sheetGanttNumberOfDays &&
        <SheetCellGanttRangeMilestone
          sheetId={sheetId}
          columnId={columnId}
          sheetGanttRangeId={sheetGanttRangeId}
          left={sheetGanttRangeStartDay * (100 / sheetGanttNumberOfDays)}/>
      }
      {sheetGanttRangeEndDate &&
        <GanttRange 
          left={sheetGanttRangeStartDay * (100 / sheetGanttNumberOfDays)}
          rangeBackgroundColor={userColorPrimary}
          rangeWidth={sheetGanttRangeNumberOfDays * (100 / sheetGanttNumberOfDays)}/>
      }
      {sheetGanttRangeEndDate && sheetGanttRangeEndDay <= sheetGanttNumberOfDays &&
          <SheetCellGanttRangeMilestone
            sheetId={sheetId}
            columnId={columnId}
            sheetGanttRangeId={sheetGanttRangeId}
            left={sheetGanttRangeEndDay * (100 / sheetGanttNumberOfDays)}/>
      }
    </>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface ISheetCellGanttRange {
  sheetId: ISheet['id']
  columnId: ISheetColumn['id']
  rowId: ISheetRow['id']
  sheetGanttRangeId: ISheetGanttRange['id']
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const GanttRange = styled.div`
  z-index: 5;
  position: absolute;
  left: calc(0.25rem + ${ ({ left }: IGanttRange ) => left + '%' });
  width: ${ ({ rangeWidth }: IGanttRange ) => rangeWidth + '%' };
  height: 6px;
  background-color: ${ ({ rangeBackgroundColor }: IGanttRange ) => rangeBackgroundColor };
`
interface IGanttRange {
  left: number
  rangeBackgroundColor: string
  rangeWidth: number
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetCellGanttRange
