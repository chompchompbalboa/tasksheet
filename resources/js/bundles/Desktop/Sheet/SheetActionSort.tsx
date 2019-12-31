//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import { v4 as createUuid } from 'uuid'

import { IAppState } from '@/state'
import { 
  ISheet,
  ISheetSort
} from '@/state/sheet/types'
import { 
  createSheetSort,
  deleteSheetSort,
  updateSheetSort 
} from '@/state/sheet/actions'

import SheetAction from '@desktop/Sheet/SheetAction'
import SheetActionDropdown, { SheetActionDropdownOption } from '@desktop/Sheet/SheetActionDropdown'
import SheetActionSortSelectedOption from '@desktop/Sheet/SheetActionSortSelectedOption'

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
  
  const sheetActiveSheetViewId = useSelector((state: IAppState) => state.sheet.allSheets && state.sheet.allSheets[sheetId] && state.sheet.allSheets[sheetId].activeSheetViewId)
  const activeSheetViewVisibleColumns = useSelector((state: IAppState) => state.sheet.allSheetViews && state.sheet.allSheetViews[sheetActiveSheetViewId] && state.sheet.allSheetViews[sheetActiveSheetViewId].visibleColumns)
  const activeSheetViewSorts = useSelector((state: IAppState) => state.sheet.allSheetViews && state.sheet.allSheetViews[sheetActiveSheetViewId] && state.sheet.allSheetViews[sheetActiveSheetViewId].sorts)

  // Use the sheet column names to provide options for the dropdown
  const options = activeSheetViewVisibleColumns && activeSheetViewVisibleColumns.map((columnId: string) => {
    if(allSheetColumns && allSheetColumns[columnId]) {
      return { label: allSheetColumns[columnId].name, value: columnId }
    }
  }).filter(Boolean)
  
  // Display an existing sheet sort
  const selectedOptions = activeSheetViewSorts && activeSheetViewSorts.map((sortId: ISheetSort['id']) => { 
    const sort = allSheetSorts[sortId]
    return { label: allSheetColumns[sort.columnId].name, value: sortId, isLocked: sort.isLocked }
  })

  const newSheetSortFromSelectedOption = (selectedOption: SheetActionDropdownOption): ISheetSort => {
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
        isLast
        onOptionDelete={(optionToDelete: SheetActionDropdownOption) => dispatch(deleteSheetSort(sheetId, optionToDelete.value))}
        onOptionSelect={(selectedOption: SheetActionDropdownOption) => dispatch(createSheetSort(sheetId, newSheetSortFromSelectedOption(selectedOption)))}
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
