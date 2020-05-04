//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { IAppState } from '@/state'
import { 
  ISheet,
  ISheetColumn,
  ISheetGanttRange 
} from '@/state/sheet/types'

import {
  deleteSheetGanttRange,
  updateSheetGanttRange
} from '@/state/sheet/actions'

import SheetColumnsList from '@desktop/Sheet/SheetColumnsList'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetCellGanttRangeDropdown = ({
  sheetId,
  columnId,
  sheetGanttRangeId,
  containerRef,
  isDropdownVisible,
  setIsDropdownVisible
}: ISheetCellGanttRangeDropdown) => {

  // Redux
  const dispatch = useDispatch()
  const sheetGanttRange = useSelector((state: IAppState) => state.sheet.allSheetGanttRanges[sheetGanttRangeId])
  const sheetGanttRangeStartColumn = useSelector((state: IAppState) => state.sheet.allSheetColumns[sheetGanttRange.startDateColumnId])
  const sheetGanttRangeEndColumn = useSelector((state: IAppState) => sheetGanttRange.endDateColumnId && state.sheet.allSheetColumns[sheetGanttRange.endDateColumnId])

  // Add event handlers when dropdown is visible
  useEffect(() => {
    if(isDropdownVisible) {
      addEventListener('click', closeDropdownOnClickOutside)
    }
    else {
      removeEventListener('click', closeDropdownOnClickOutside)
    }
    return () => removeEventListener('click', closeDropdownOnClickOutside)
  }, [ isDropdownVisible ])

  // Close Dropdown On Click Outside
  const closeDropdownOnClickOutside = (e: Event) => {
    if(!containerRef.current.contains(e.target)) {
      setIsDropdownVisible(false)
    }
  }

  return (
    <GanttMilestoneDropdown
      isVisible={isDropdownVisible}>
      <StartEndColumnContainer>
        <SheetColumnsList
          sheetId={sheetId}
          currentColumnId={sheetGanttRangeStartColumn && sheetGanttRangeStartColumn.id}
          onColumnClick={(clickedColumnId: ISheetColumn['id']) => 
            dispatch(updateSheetGanttRange(sheetId, columnId, sheetGanttRangeId, { startDateColumnId: clickedColumnId }))
          }/>
        <ColumnNameDivider>-</ColumnNameDivider> 
        <SheetColumnsList
          sheetId={sheetId}
          currentColumnId={sheetGanttRangeEndColumn && sheetGanttRangeEndColumn.id}
          onColumnClick={(clickedColumnId: ISheetColumn['id']) => 
            dispatch(updateSheetGanttRange(sheetId, columnId, sheetGanttRangeId, { endDateColumnId: clickedColumnId }))
          }/>
      </StartEndColumnContainer>
      <DeleteGanttRangeContainer>
        <DeleteGanttRangeButton
          onClick={() => dispatch(deleteSheetGanttRange(sheetId, columnId, sheetGanttRangeId))}>
          Delete
        </DeleteGanttRangeButton>
      </DeleteGanttRangeContainer>
    </GanttMilestoneDropdown>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface ISheetCellGanttRangeDropdown {
  sheetId: ISheet['id']
  columnId: ISheetColumn['id']
  sheetGanttRangeId: ISheetGanttRange['id']
  containerRef: any
  isDropdownVisible: boolean
  setIsDropdownVisible(nextIsDropdownVisible: boolean): void
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const GanttMilestoneDropdown = styled.div`
  display: ${ ({ isVisible }: IGanttMilestoneDropdown ) => isVisible ? 'block' : 'none' };
  position: absolute;
  top: 100%;
  left: 0;
  padding: 0.25rem;
  border-radius: 4px;
  background-color: rgb(250, 250, 250);
  box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.5);
`
interface IGanttMilestoneDropdown {
  isVisible: boolean
}

const StartEndColumnContainer = styled.div`
  display: flex;
  align-items: center;
  white-space: nowrap;
`

const ColumnNameDivider = styled.div`
  margin: 0 0.25rem;
`

const DeleteGanttRangeContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const DeleteGanttRangeButton = styled.div`
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  background-color: rgb(230, 230, 230);
  &:hover {
    background-color: rgb(200, 0, 0);
    color: white;
  }
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetCellGanttRangeDropdown
