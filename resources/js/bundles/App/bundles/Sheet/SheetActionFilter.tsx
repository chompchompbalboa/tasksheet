//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { connect } from 'react-redux'
import { v4 as createUuid } from 'uuid'

import { Columns, Filter, Filters } from '@app/state/sheet/types'

import { ThunkDispatch } from '@app/state/types'
import { 
  FilterUpdates,
  createFilter as createFilterAction,
  deleteFilter as deleteFilterAction,
  updateFilter as updateFilterAction 
} from '@app/state/sheet/actions'

import SheetAction from '@app/bundles/Sheet/SheetAction'
import SheetActionDropdown, { SheetActionDropdownOption } from '@app/bundles/Sheet/SheetActionDropdown'
import SheetActionFilterSelectedOption from '@app/bundles/Sheet/SheetActionFilterSelectedOption'

//-----------------------------------------------------------------------------
// Redux
//-----------------------------------------------------------------------------
const mapDispatchToProps = (dispatch: ThunkDispatch, props: SheetActionProps) => ({
  createFilter: (newFilter: Filter) => dispatch(createFilterAction(props.sheetId, newFilter)),
  deleteFilter: (columnId: string) => dispatch(deleteFilterAction(props.sheetId, columnId)),
  updateFilter: (filterId: string, updates: FilterUpdates) => dispatch(updateFilterAction(props.sheetId, filterId, updates))
})

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionFilter = ({
  columns,
  createFilter,
  deleteFilter,
  filters,
  updateFilter
}: SheetActionProps) => {

  const options = columns && Object.keys(columns).map((columnId: string) => { return { label: columns[columnId].name, value: columnId }})
  const selectedOptions = filters && filters.map((filter: Filter) => { return { label: columns[filter.columnId].name, value: filter.id }})

  return (
    <SheetAction>
      <SheetActionDropdown
        onOptionDelete={(optionToDelete: SheetActionDropdownOption) => deleteFilter(optionToDelete.value)}
        onOptionSelect={(selectedOption: SheetActionDropdownOption) => createFilter({ id: createUuid(), columnId: selectedOption.value, value: "", type: "EQUALS" })}
        options={options}
        placeholder={"Filter By..."}
        selectedOptions={selectedOptions}
        selectedOptionComponent={({ option }: { option: SheetActionDropdownOption }) => <SheetActionFilterSelectedOption option={option} filters={filters} updateFilter={updateFilter} />}/>
    </SheetAction>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetActionProps {
  columns: Columns
  createFilter?(newFilter: Filter): void
  deleteFilter?(columnId: string): void
  updateFilter?(filterId: string, updates: FilterUpdates): void
  filters: Filters
  sheetId: string
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default connect(
  null,
  mapDispatchToProps
)(SheetActionFilter)
