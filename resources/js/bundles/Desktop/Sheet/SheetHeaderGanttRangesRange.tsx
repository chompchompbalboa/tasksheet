//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { TRASH_CAN } from '@/assets/icons'

import { IAppState } from '@/state'
import { 
  ISheet,
  ISheetColumn,
  ISheetGanttRange 
} from '@/state/sheet/types'

import { deleteSheetGanttRange } from '@/state/sheet/actions'

import Icon from '@/components/Icon'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetHeaderGanttRangeDropdown = ({
  sheetId,
  columnId,
  sheetGanttRangeId
}: ISheetHeaderGanttRangeDropdown) => {

  // Redux
  const dispatch = useDispatch()
  const sheetGanttRange = useSelector((state: IAppState) => state.sheet.allSheetGanttRanges[sheetGanttRangeId])
  const sheetGanttRangeStartColumn = useSelector((state: IAppState) => sheetGanttRange.startDateColumnId && state.sheet.allSheetColumns[sheetGanttRange.startDateColumnId])
  const sheetGanttRangeEndColumn = useSelector((state: IAppState) => sheetGanttRange.endDateColumnId && state.sheet.allSheetColumns[sheetGanttRange.endDateColumnId])

  return (
    <Container>
      <ColumnNames>
        {sheetGanttRangeStartColumn.name}{sheetGanttRangeEndColumn && ' - ' + sheetGanttRangeEndColumn.name}
      </ColumnNames>
      <ActionsContainer>
        <Action
          onClick={() => dispatch(deleteSheetGanttRange(sheetId, columnId, sheetGanttRangeId))}>
          <Icon
            icon={TRASH_CAN}/>
        </Action>
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

const Action = styled.div`
  cursor: pointer;
  padding: 0.125rem;
  border-radius: 3px;
  &:hover {
    background-color: rgb(230, 230, 230);
  }
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetHeaderGanttRangeDropdown
