//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { connect } from 'react-redux'
import { v4 as createUuid } from 'uuid'

import { SheetColumn, SheetColumns, SheetSort, SheetSorts } from '@app/state/sheet/types'

import { ThunkDispatch } from '@app/state/types'
import { SheetSortUpdates } from '@app/state/sheet/types'
import { 
  createSheetSort as createSheetSortAction,
  deleteSheetSort as deleteSheetSortAction,
  updateSheetSort as updateSheetSortAction 
} from '@app/state/sheet/actions'

import SheetAction from '@app/bundles/Sheet/SheetAction'
import SheetActionDropdown, { SheetActionDropdownOption } from '@app/bundles/Sheet/SheetActionDropdown'
import SheetActionSortSelectedOption from '@app/bundles/Sheet/SheetActionSortSelectedOption'

//-----------------------------------------------------------------------------
// Redux
//-----------------------------------------------------------------------------
const mapDispatchToProps = (dispatch: ThunkDispatch, props: SheetActionProps) => ({
  createSheetSort: (newSort: SheetSort) => dispatch(createSheetSortAction(props.sheetId, newSort)),
  deleteSheetSort: (columnId: string) => dispatch(deleteSheetSortAction(props.sheetId, columnId)),
  updateSheetSort: (sortId: string, updates: SheetSortUpdates) => dispatch(updateSheetSortAction(sortId, updates))
})

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionSort = ({
  sheetId,
  columns,
  createSheetSort,
  deleteSheetSort,
  sorts,
  sheetSorts,
  sheetVisibleColumns,
  updateSheetSort
}: SheetActionProps) => {

  const options = sheetVisibleColumns &&  sheetVisibleColumns.map((columnId: string) => { 
    return { label: columns[columnId].name, value: columnId }
  })
  const selectedOptions = sheetSorts && sheetSorts.map((sortId: SheetSort['id']) => { 
    const sort = sorts[sortId]
    return { label: columns[sort.columnId].name, value: sortId }
  })

  return (
    <SheetAction>
      <SheetActionDropdown
        onOptionDelete={(optionToDelete: SheetActionDropdownOption) => deleteSheetSort(optionToDelete.value)}
        onOptionSelect={(selectedOption: SheetActionDropdownOption) => createSheetSort({ id: createUuid(), sheetId: sheetId, columnId: selectedOption.value, order: 'ASC' })}
        options={options}
        placeholder={"Sort By..."}
        selectedOptions={selectedOptions}
        selectedOptionComponent={({ option }: { option: SheetActionDropdownOption }) => <SheetActionSortSelectedOption option={option} sorts={sorts} updateSheetSort={updateSheetSort} />}/>
    </SheetAction>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetActionProps {
  columns: SheetColumns
  createSheetSort?(newSort: SheetSort): void
  deleteSheetSort?(columnId: string): void
  updateSheetSort?(sortId: string, updates: SheetSortUpdates): void
  sorts: SheetSorts
  sheetSorts: SheetSort['id'][]
  sheetVisibleColumns: SheetColumn['id'][]
  sheetId: string
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default connect(
  null,
  mapDispatchToProps
)(SheetActionSort)
