//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { connect } from 'react-redux'
import { v4 as createUuid } from 'uuid'

import clone from '@/utils/clone'

import { ThunkDispatch } from '@app/state/types'
import { 
  createSheetFilter as createSheetFilterAction,
  deleteSheetFilter as deleteSheetFilterAction,
  updateSheetFilter as updateSheetFilterAction 
} from '@app/state/sheet/actions'
import { SheetColumn, SheetColumns, SheetFilter, SheetFilters, SheetFilterType, SheetFilterUpdates } from '@app/state/sheet/types'

import SheetAction from '@app/bundles/Sheet/SheetAction'
import SheetActionDropdown, { SheetActionDropdownOption } from '@app/bundles/Sheet/SheetActionDropdown'
import SheetActionFilterSelectedOption from '@app/bundles/Sheet/SheetActionFilterSelectedOption'

//-----------------------------------------------------------------------------
// Redux
//-----------------------------------------------------------------------------
const mapDispatchToProps = (dispatch: ThunkDispatch, props: SheetActionProps) => ({
  createSheetFilter: (sheetId: string, newFilter: SheetFilter) => dispatch(createSheetFilterAction(props.sheetId, newFilter)),
  deleteSheetFilter: (filterId: string) => dispatch(deleteSheetFilterAction(props.sheetId, filterId)),
  updateSheetFilter: (filterId: string, updates: SheetFilterUpdates) => dispatch(updateSheetFilterAction(filterId, updates))
})

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionFilter = ({
  columns,
  createSheetFilter,
  deleteSheetFilter,
  filters,
  sheetFilters,
  sheetVisibleColumns,
  sheetId
}: SheetActionProps) => {

  const selectedOptions = sheetFilters && sheetFilters.map((filterId: SheetFilter['id']) => { 
    const filter = filters[filterId]
    return { 
      label: columns[filter.columnId].name, 
      value: filter.id 
    }
  })

  const columnNames = sheetVisibleColumns && sheetVisibleColumns.map(columnId => columns[columnId].name)
  const filterTypes: SheetFilterType[] = ['=', '>', '>=', '<', '<=']
  const isValidFilter = ([
    columnName,
    filterType,
    filterValue
  ]: string[]) => {
    return (
      columnName && filterType && filterValue &&
      columnNames.includes(columnName) && // First string is a column name
      filterTypes.includes(filterType as SheetFilterType) && // Second string is a FilterType
      filterValue[filterValue.length - 1] === ';' // Third string ends with a semicolon
    )
  }

  const handleInputChange = (nextValue: string) => {
    const splitNextValue = nextValue.split(" ")
    const [ columnName, filterType, ...filterValue ] = splitNextValue
    if(isValidFilter([ columnName, filterType, clone(filterValue).join(" ") ])) {
      createSheetFilter(sheetId, {
        id: createUuid(), 
        sheetId: sheetId,
        columnId: sheetVisibleColumns[columnNames.findIndex(_columnName => _columnName === columnName)], 
        value: clone(filterValue).join(" ").slice(0, -1), 
        type: filterTypes.find(_filterType => _filterType === filterType)
      })
    }
  }
  
  return (
    <SheetAction>
      <SheetActionDropdown
        onInputChange={(nextValue: string) => handleInputChange(nextValue)}
        onOptionDelete={(optionToDelete: SheetActionDropdownOption) => deleteSheetFilter(optionToDelete.value)}
        onOptionSelect={null}
        options={null}
        placeholder={"Filter By..."}
        selectedOptions={selectedOptions}
        selectedOptionComponent={({ option }: { option: SheetActionDropdownOption }) => <SheetActionFilterSelectedOption option={option} filters={filters} />}/>
    </SheetAction>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetActionProps {
  columns: SheetColumns
  createSheetFilter?(sheetId: string, newFilter: SheetFilter): void
  deleteSheetFilter?(columnId: string): void
  filters: SheetFilters
  sheetId: string
  sheetFilters: SheetFilter['id'][]
  sheetVisibleColumns: SheetColumn['id'][]
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default connect(
  null,
  mapDispatchToProps
)(SheetActionFilter)
