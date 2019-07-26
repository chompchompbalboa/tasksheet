//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { connect } from 'react-redux'
import { v4 as createUuid } from 'uuid'

import { Columns, SheetGroup, SheetGroups } from '@app/state/sheet/types'

import { ThunkDispatch } from '@app/state/types'
import { 
  SheetGroupUpdates,
  createSheetGroup as createSheetGroupAction,
  deleteSheetGroup as deleteSheetGroupAction,
  updateSheetGroup as updateSheetGroupAction 
} from '@app/state/sheet/actions'

import SheetAction from '@app/bundles/Sheet/SheetAction'
import SheetActionDropdown, { SheetActionDropdownOption } from '@app/bundles/Sheet/SheetActionDropdown'
import SheetActionGroupSelectedOption from '@app/bundles/Sheet/SheetActionGroupSelectedOption'

//-----------------------------------------------------------------------------
// Redux
//-----------------------------------------------------------------------------
const mapDispatchToProps = (dispatch: ThunkDispatch, props: SheetActionGroupProps) => ({
  createSheetGroup: (newGroup: SheetGroup) => dispatch(createSheetGroupAction(props.sheetId, newGroup)),
  deleteSheetGroup: (columnId: string) => dispatch(deleteSheetGroupAction(props.sheetId, columnId)),
  updateSheetGroup: (groupId: string, updates: SheetGroupUpdates) => dispatch(updateSheetGroupAction(props.sheetId, groupId, updates))
})

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionGroup = ({
  columns,
  createSheetGroup,
  deleteSheetGroup,
  groups,
  updateSheetGroup
}: SheetActionGroupProps) => {

  const options = columns && Object.keys(columns).map((columnId: string) => { return { label: columns[columnId].name, value: columnId }})
  const selectedOptions = groups && groups.map((group: SheetGroup) => { return { label: columns[group.columnId].name, value: group.columnId }})

  return (
    <SheetAction>
      <SheetActionDropdown
        onOptionDelete={(optionToDelete: SheetActionDropdownOption) => deleteSheetGroup(optionToDelete.value)}
        onOptionSelect={(selectedOption: SheetActionDropdownOption) => createSheetGroup({ id: createUuid(), columnId: selectedOption.value, order: 'ASC' })}
        options={options}
        placeholder={"Group By..."}
        selectedOptions={selectedOptions}
        selectedOptionComponent={({ option }: { option: SheetActionDropdownOption }) => <SheetActionGroupSelectedOption option={option} groups={groups} updateSheetGroup={updateSheetGroup} />}/>
    </SheetAction>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetActionGroupProps {
  columns: Columns
  createSheetGroup?(newGroup: SheetGroup): void
  deleteSheetGroup?(columnId: string): void
  updateSheetGroup?(groupId: string, updates: SheetGroupUpdates): void
  groups: SheetGroups
  sheetId: string
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default connect(
  null,
  mapDispatchToProps
)(SheetActionGroup)
