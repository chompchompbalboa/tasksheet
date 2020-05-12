//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { TRASH_CAN } from '@/assets/icons'

import { useSheetEditingPermissions } from '@/hooks'

import { 
  ISheet,
  ISheetColumn,
  ISheetGanttRange 
} from '@/state/sheet/types'

import { createMessengerMessage } from '@/state/messenger/actions'
import { deleteSheetGanttRange } from '@/state/sheet/actions'

import Icon from '@/components/Icon'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetHeaderGanttRangesRangeDelete = ({
  sheetId,
  columnId,
  sheetGanttRangeId
}: ISheetHeaderGanttRangesRangeDelete) => {

  // Redux
  const dispatch = useDispatch()

  // Permissions
  const {
    userHasPermissionToEditSheet,
    userHasPermissionToEditSheetErrorMessage
  } = useSheetEditingPermissions(sheetId)

  // Handle Delete Gantt Range
  const handleDeleteGanttRange = () => {
    if(!userHasPermissionToEditSheet) {
      dispatch(createMessengerMessage(userHasPermissionToEditSheetErrorMessage))
    }
    else {
      dispatch(deleteSheetGanttRange(sheetId, columnId, sheetGanttRangeId))
    }
  }

  return (
    <Container
      data-testid="SheetHeaderGanttRangesRangeDeleteButton"
      onClick={handleDeleteGanttRange}>
      <Icon
        icon={TRASH_CAN}/>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface ISheetHeaderGanttRangesRangeDelete {
  sheetId: ISheet['id']
  columnId: ISheetColumn['id']
  sheetGanttRangeId: ISheetGanttRange['id']
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
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
export default SheetHeaderGanttRangesRangeDelete
