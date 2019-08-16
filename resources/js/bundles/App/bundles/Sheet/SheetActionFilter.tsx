//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useState } from 'react'
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

  const [ inputValue, setInputValue ] = useState("")
  const [ isColumnNameValid, setIsColumnNameValid ] = useState(false)

  const filterTypes: SheetFilterType[] = ['=', '>', '>=', '<', '<=']
  const columnNames = sheetVisibleColumns && sheetVisibleColumns.map(columnId => columns[columnId].name)

  let optionsColumnOnly: SheetActionDropdownOption[] = []
  let optionsColumnWithFilterType: SheetActionDropdownOption[] = []
  sheetVisibleColumns && sheetVisibleColumns.forEach((columnId: string, index: number) => {
    const columnOnlyValue = columns[columnId].name
    optionsColumnOnly.push({ label: columnOnlyValue, value: columnOnlyValue + '-' + index })
    filterTypes.forEach(filterType => {
      const columnWithFilterTypeValue = columnOnlyValue + ' ' + filterType
      optionsColumnWithFilterType.push({ label: columnWithFilterTypeValue, value: columnWithFilterTypeValue })
    })
  })

  const selectedOptions = sheetFilters && sheetFilters.map((filterId: SheetFilter['id']) => { 
    const filter = filters[filterId]
    return { 
      label: columns[filter.columnId].name, 
      value: filter.id 
    }
  })

  const isValidFilter = ([
    columnName,
    filterType,
    filterValue
  ]: string[]) => {
    if (columnName && filterType && filterValue) {
      return (
        columnNames.includes(columnName) && // First string is a column name
        filterTypes.includes(filterType as SheetFilterType) && // Second string is a FilterType
        filterValue[filterValue.length - 1] === ';' // Third string ends with a semicolon
      )
    }
    return false
  }

  const handleInputChange = (nextValue: string) => {
    setInputValue(nextValue)
    const [ columnName, filterType, ...filterValue ] = nextValue.split(" ")
    if(columnNames.includes(columnName)) { 
      setIsColumnNameValid(true) 
    }
    else {
      setIsColumnNameValid(false)
    }
    if(isValidFilter([ columnName, filterType, clone(filterValue).join(" ") ])) {
      setInputValue("")
      setIsColumnNameValid(false)
      createSheetFilter(sheetId, {
        id: createUuid(), 
        sheetId: sheetId,
        columnId: sheetVisibleColumns[columnNames.findIndex(_columnName => _columnName === columnName)], 
        value: clone(filterValue).join(" ").slice(0, -1), 
        type: filterTypes.find(_filterType => _filterType === filterType)
      })
    }
  }
  console.log(inputValue)
  return (
    <SheetAction>
      <SheetActionDropdown
        onInputChange={(nextValue: string) => handleInputChange(nextValue)}
        onOptionDelete={(optionToDelete: SheetActionDropdownOption) => deleteSheetFilter(optionToDelete.value)}
        onOptionSelect={() => console.log('onOptionSelect')}
        options={isColumnNameValid ? optionsColumnWithFilterType : optionsColumnOnly}
        placeholder={"Filter By..."}
        selectedOptions={selectedOptions}
        selectedOptionComponent={({ option }: { option: SheetActionDropdownOption }) => <SheetActionFilterSelectedOption option={option} filters={filters} />}
        value={inputValue}/>
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
