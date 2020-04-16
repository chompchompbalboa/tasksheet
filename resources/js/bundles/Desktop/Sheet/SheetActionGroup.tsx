//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import { v4 as createUuid } from 'uuid'

import { IAppState } from '@/state'
import { ISheetGroup } from '@/state/sheet/types'

import { 
  createSheetGroup,
  deleteSheetGroup,
  updateSheetGroup 
} from '@/state/sheet/actions'

import SheetAction from '@desktop/Sheet/SheetAction'
import SheetActionDropdown, { SheetActionDropdownOption } from '@desktop/Sheet/SheetActionDropdown'
import SheetActionGroupSelectedOption from '@desktop/Sheet/SheetActionGroupSelectedOption'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionGroup = ({
  sheetId
}: ISheetActionGroupProps) => {

  // Redux
  const dispatch = useDispatch()
  const allSheetColumns = useSelector((state: IAppState) => state.sheet.allSheetColumns)
  const allSheetGroups = useSelector((state: IAppState) => state.sheet.allSheetGroups)
  const sheetActiveSheetViewId = useSelector((state: IAppState) => state.sheet.allSheets && state.sheet.allSheets[sheetId] && state.sheet.allSheets[sheetId].activeSheetViewId)
  const activeSheetViewVisibleColumns = useSelector((state: IAppState) => state.sheet.allSheetViews && state.sheet.allSheetViews[sheetActiveSheetViewId] && state.sheet.allSheetViews[sheetActiveSheetViewId].visibleColumns)
  const activeSheetViewGroups = useSelector((state: IAppState) => state.sheet.allSheetViews && state.sheet.allSheetViews[sheetActiveSheetViewId] && state.sheet.allSheetViews[sheetActiveSheetViewId].groups)

  // Use the sheet column names to provide options for the dropdown
  const sheetColumnNames = activeSheetViewVisibleColumns && activeSheetViewVisibleColumns.map((columnId: string) => {
    if(allSheetColumns && allSheetColumns[columnId]) {
      return { label: allSheetColumns[columnId].name, value: columnId }
    }
  }).filter(Boolean)

  // Display an existing sheet group
  const sheetGroupSelectedOptions = activeSheetViewGroups && activeSheetViewGroups.map((groupId: ISheetGroup['id']) => { 
    const group = allSheetGroups[groupId]
    return { label: allSheetColumns[group.columnId].name, value: group.id, isLocked: group.isLocked }
  })

  // New Sheet Group From Selected Option
  const newSheetGroupFromSelectedOption = (selectedOption: SheetActionDropdownOption): ISheetGroup => {
    return { 
      id: createUuid(), 
      createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      sheetId: sheetActiveSheetViewId ? null : sheetId,
      sheetViewId: sheetActiveSheetViewId, 
      columnId: selectedOption.value, 
      order: 'ASC', 
      isLocked: false 
    }
  }

  return (
    <SheetAction>
      <SheetActionDropdown
        sheetId={sheetId}
        onOptionDelete={(optionToDelete: SheetActionDropdownOption) => dispatch(deleteSheetGroup(sheetId, optionToDelete.value))}
        onOptionSelect={(selectedOption: SheetActionDropdownOption) => dispatch(createSheetGroup(sheetId, newSheetGroupFromSelectedOption(selectedOption)))}
        onOptionUpdate={(groupId, updates) => dispatch(updateSheetGroup(sheetId, groupId, updates, true))}
        options={sheetColumnNames}
        placeholder={"Group By..."}
        selectedOptions={sheetGroupSelectedOptions}
        selectedOptionComponent={({ option }: { option: SheetActionDropdownOption }) => <SheetActionGroupSelectedOption option={option} groups={allSheetGroups} updateSheetGroup={(...args) => dispatch(updateSheetGroup(sheetId, ...args))} />}/>
    </SheetAction>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface ISheetActionGroupProps {
  sheetId: string
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetActionGroup
