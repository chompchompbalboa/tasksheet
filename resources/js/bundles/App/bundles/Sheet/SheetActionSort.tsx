//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { v4 as createUuid } from 'uuid'

import { IAppState } from '@app/state'
import { 
  ISheet,
  ISheetSort
} from '@app/state/sheet/types'
import { 
  createSheetSort,
  deleteSheetSort,
  updateSheetSort 
} from '@app/state/sheet/actions'

import SheetAction from '@app/bundles/Sheet/SheetAction'
import SheetActionDropdown, { SheetActionDropdownOption } from '@app/bundles/Sheet/SheetActionDropdown'
import SheetActionSortSelectedOption from '@app/bundles/Sheet/SheetActionSortSelectedOption'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionSort = ({
  sheetId
}: SheetActionProps) => {

  // Redux
  const dispatch = useDispatch()

  const allSheetColumns = useSelector((state: IAppState) => state.sheet.allSheetColumns)
  const allSheetSorts = useSelector((state: IAppState) => state.sheet.allSheetSorts)
  
  const sheetSorts = useSelector((state: IAppState) => state.sheet.allSheets && state.sheet.allSheets[sheetId] && state.sheet.allSheets[sheetId].sorts)
  const sheetVisibleColumns = useSelector((state: IAppState) => state.sheet.allSheets && state.sheet.allSheets[sheetId] && state.sheet.allSheets[sheetId].visibleColumns)

  // Use the sheet column names to provide options for the dropdown
  const options = sheetVisibleColumns && sheetVisibleColumns.map((columnId: string) => {
    if(allSheetColumns && allSheetColumns[columnId]) {
      return { label: allSheetColumns[columnId].name, value: columnId }
    }
  }).filter(Boolean)
  
  // Display an existing sheet sort
  const selectedOptions = sheetSorts && sheetSorts.map((sortId: ISheetSort['id']) => { 
    const sort = allSheetSorts[sortId]
    return { label: allSheetColumns[sort.columnId].name, value: sortId, isLocked: sort.isLocked }
  })

  return (
    <SheetAction>
      <SheetActionDropdown
        sheetId={sheetId}
        onOptionDelete={(optionToDelete: SheetActionDropdownOption) => dispatch(deleteSheetSort(sheetId, optionToDelete.value))}
        onOptionSelect={(selectedOption: SheetActionDropdownOption) => dispatch(createSheetSort(sheetId, { id: createUuid(), sheetId: sheetId, sheetViewId: null, columnId: selectedOption.value, order: 'ASC', isLocked: false }))}
        onOptionUpdate={(sortId, updates) => dispatch(updateSheetSort(sheetId, sortId, updates, true))}
        options={options}
        placeholder={"Sort By..."}
        selectedOptions={selectedOptions}
        selectedOptionComponent={({ option }: { option: SheetActionDropdownOption }) => <SheetActionSortSelectedOption option={option} allSheetSorts={allSheetSorts} updateSheetSort={(...args) => dispatch(updateSheetSort(sheetId, ...args))} />}/>
    </SheetAction>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetActionProps {
  sheetId: ISheet['id']
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetActionSort
