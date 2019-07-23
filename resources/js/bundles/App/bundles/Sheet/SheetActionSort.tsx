//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { connect } from 'react-redux'

import { Columns, Sort, Sorts } from '@app/state/sheet/types'

import { ThunkDispatch } from '@app/state/types'
import { createSort as createSortAction } from '@app/state/sheet/actions'

import SheetAction from '@app/bundles/Sheet/SheetAction'
import SheetActionDropdown, { SheetActionDropdownOption } from '@app/bundles/Sheet/SheetActionDropdown'

//-----------------------------------------------------------------------------
// Redux
//-----------------------------------------------------------------------------
const mapDispatchToProps = (dispatch: ThunkDispatch, props: SheetActionProps) => ({
  createSort: (newSort: Sort) => dispatch(createSortAction(props.sheetId, newSort))
})
//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionSort = ({
  columns,
  createSort,
  sorts
}: SheetActionProps) => {

  const options = columns && Object.keys(columns).map((columnId: string) => { return { label: columns[columnId].name, value: columnId }})
  const selectedOptions = sorts && sorts.map((sort: Sort) => { return { label: columns[sort.columnId].name, value: columns[sort.columnId].id }})

  return (
    <SheetAction>
      <SheetActionDropdown
        onOptionSelect={(selectedOption: SheetActionDropdownOption) => createSort({ columnId: selectedOption.value, order: 'ASC' })}
        options={options}
        placeholder={"Sort By..."}
        selectedOptions={selectedOptions}/>
    </SheetAction>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetActionProps {
  columns: Columns
  createSort?(newSort: Sort): void
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
