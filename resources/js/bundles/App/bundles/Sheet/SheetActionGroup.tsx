//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { v4 as createUuid } from 'uuid'

import { IAppState } from '@app/state'
import { ISheetGroup } from '@app/state/sheet/types'
import { 
  createSheetGroup,
  deleteSheetGroup,
  updateSheetGroup 
} from '@app/state/sheet/actions'

import SheetAction from '@app/bundles/Sheet/SheetAction'
import SheetActionDropdown, { SheetActionDropdownOption } from '@app/bundles/Sheet/SheetActionDropdown'
import SheetActionGroupSelectedOption from '@app/bundles/Sheet/SheetActionGroupSelectedOption'

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
  const sheetViewGroups = useSelector((state: IAppState) => state.sheet.allSheetViews && state.sheet.allSheetViews[sheetActiveSheetViewId] && state.sheet.allSheetViews[sheetActiveSheetViewId].groups)
  const sheetViewVisibleColumns = useSelector((state: IAppState) => state.sheet.allSheetViews && state.sheet.allSheetViews[sheetActiveSheetViewId] && state.sheet.allSheetViews[sheetActiveSheetViewId].visibleColumns)

  // Use the sheet column names to provide options for the dropdown
  const sheetColumnNames = sheetViewVisibleColumns && sheetViewVisibleColumns.map((columnId: string) => {
    if(allSheetColumns && allSheetColumns[columnId]) {
      return { label: allSheetColumns[columnId].name, value: columnId }
    }
  }).filter(Boolean)

  // Display an existing sheet group
  const sheetGroupSelectedOptions = sheetViewGroups && sheetViewGroups.map((groupId: ISheetGroup['id']) => { 
    const group = allSheetGroups[groupId]
    return { label: allSheetColumns[group.columnId].name, value: group.id, isLocked: group.isLocked }
  })

  const newSheetGroupFromSelectedOption = (selectedOption: SheetActionDropdownOption): ISheetGroup => {
    return { 
      id: createUuid(), 
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
