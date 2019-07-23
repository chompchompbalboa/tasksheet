//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { connect } from 'react-redux'
import { v4 as createUuid } from 'uuid'

import { Columns, Sort, Sorts } from '@app/state/sheet/types'

import { ThunkDispatch } from '@app/state/types'
import { 
  SortUpdates,
  createSort as createSortAction,
  deleteSort as deleteSortAction,
  updateSort as updateSortAction 
} from '@app/state/sheet/actions'

import SheetAction from '@app/bundles/Sheet/SheetAction'
import SheetActionDropdown, { SheetActionDropdownOption } from '@app/bundles/Sheet/SheetActionDropdown'
import SheetActionSortSelectedOption from '@app/bundles/Sheet/SheetActionSortSelectedOption'

//-----------------------------------------------------------------------------
// Redux
//-----------------------------------------------------------------------------
const mapDispatchToProps = (dispatch: ThunkDispatch, props: SheetActionProps) => ({
  createSort: (newSort: Sort) => dispatch(createSortAction(props.sheetId, newSort)),
  deleteSort: (columnId: string) => dispatch(deleteSortAction(props.sheetId, columnId)),
  updateSort: (sortId: string, updates: SortUpdates) => dispatch(updateSortAction(props.sheetId, sortId, updates))
})

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionSort = ({
  columns,
  createSort,
  deleteSort,
  sorts,
  updateSort
}: SheetActionProps) => {

  const options = columns && Object.keys(columns).map((columnId: string) => { return { label: columns[columnId].name, value: columnId }})
  const selectedOptions = sorts && sorts.map((sort: Sort) => { return { label: columns[sort.columnId].name, value: sort.columnId }})

  return (
    <SheetAction>
      <SheetActionDropdown
        onOptionDelete={(optionToDelete: SheetActionDropdownOption) => deleteSort(optionToDelete.value)}
        onOptionSelect={(selectedOption: SheetActionDropdownOption) => createSort({ id: createUuid(), columnId: selectedOption.value, order: 'ASC' })}
        options={options}
        placeholder={"Sort By..."}
        selectedOptions={selectedOptions}
        selectedOptionComponent={({ option }: { option: SheetActionDropdownOption }) => <SheetActionSortSelectedOption option={option} sorts={sorts} updateSort={updateSort} />}/>
    </SheetAction>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetActionProps {
  columns: Columns
  createSort?(newSort: Sort): void
  deleteSort?(columnId: string): void
  updateSort?(sortId: string, updates: SortUpdates): void
  sorts: Sorts
  sheetId: string
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default connect(
  null,
  mapDispatchToProps
)(SheetActionSort)
