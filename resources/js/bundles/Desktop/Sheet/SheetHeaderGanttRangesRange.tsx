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

import SheetHeaderGanttRangesRangeBackgroundColor from '@desktop/Sheet/SheetHeaderGanttRangesRangeBackgroundColor'
import SheetHeaderGanttRangesRangeDelete from '@desktop/Sheet/SheetHeaderGanttRangesRangeDelete'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetHeaderGanttRangeDropdown = ({
  sheetId,
  columnId,
  sheetGanttRangeId
}: ISheetHeaderGanttRangeDropdown) => {

  // Redux
  const sheetGanttRange = useSelector((state: IAppState) => state.sheet.allSheetGanttRanges[sheetGanttRangeId])
  const sheetGanttRangeStartColumn = useSelector((state: IAppState) => sheetGanttRange.startDateColumnId && state.sheet.allSheetColumns[sheetGanttRange.startDateColumnId])
  const sheetGanttRangeEndColumn = useSelector((state: IAppState) => sheetGanttRange.endDateColumnId && state.sheet.allSheetColumns[sheetGanttRange.endDateColumnId])

  return (
    <Container>
      <ColumnNames>
        {sheetGanttRangeStartColumn.name}{sheetGanttRangeEndColumn && ' - ' + sheetGanttRangeEndColumn.name}
      </ColumnNames>
      <ActionsContainer>
        <SheetHeaderGanttRangesRangeBackgroundColor
          sheetId={sheetId}
          sheetGanttRangeId={sheetGanttRangeId}/>
        <SheetHeaderGanttRangesRangeDelete
          sheetId={sheetId}
          columnId={columnId}
          sheetGanttRangeId={sheetGanttRangeId}/>
      </ActionsContainer>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface ISheetHeaderGanttRangeDropdown {
  sheetId: ISheet['id']
  columnId: ISheetColumn['id']
  sheetGanttRangeId: ISheetGanttRange['id']
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const ColumnNames = styled.div``

const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetHeaderGanttRangeDropdown
