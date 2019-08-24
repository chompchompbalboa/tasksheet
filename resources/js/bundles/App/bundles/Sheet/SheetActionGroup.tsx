//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { connect } from 'react-redux'
import { v4 as createUuid } from 'uuid'

import { SheetColumn, SheetColumns, SheetGroup, SheetGroups } from '@app/state/sheet/types'

import { ThunkDispatch } from '@app/state/types'
import { SheetGroupUpdates } from '@app/state/sheet/types'
import { 
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
  updateSheetGroup: (groupId: string, updates: SheetGroupUpdates, skipVisibleRowsUpdate?: boolean) => dispatch(updateSheetGroupAction(groupId, updates, skipVisibleRowsUpdate))
})

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionGroup = ({
  sheetId,
  columns,
  createSheetGroup,
  deleteSheetGroup,
  groups,
  sheetGroups,
  sheetVisibleColumns,
  updateSheetGroup
}: SheetActionGroupProps) => {

  const options = sheetVisibleColumns && sheetVisibleColumns.map((columnId: string) => {
    if(columns && columns[columnId]) {
      return { label: columns[columnId].name, value: columnId }
    }
  }).filter(Boolean)

  const selectedOptions = sheetGroups && sheetGroups.map((groupId: SheetGroup['id']) => { 
    const group = groups[groupId]
    return { label: columns[group.columnId].name, value: group.id, isLocked: group.isLocked }
  })

  return (
    <SheetAction>
      <SheetActionDropdown
        onOptionDelete={(optionToDelete: SheetActionDropdownOption) => deleteSheetGroup(optionToDelete.value)}
        onOptionSelect={(selectedOption: SheetActionDropdownOption) => createSheetGroup({ id: createUuid(), sheetId: sheetId, columnId: selectedOption.value, order: 'ASC', isLocked: false })}
        onOptionUpdate={(groupId, updates) => updateSheetGroup(groupId, updates, true)}
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
  columns: SheetColumns
  createSheetGroup?(newGroup: SheetGroup): void
  deleteSheetGroup?(columnId: string): void
  updateSheetGroup?(groupId: string, updates: SheetGroupUpdates, skipVisibleRowsUpdate?: boolean): void
  groups: SheetGroups
  sheetGroups: SheetGroup['id'][]
  sheetVisibleColumns: SheetColumn['id'][]
  sheetId: string
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default connect(
  null,
  mapDispatchToProps
)(SheetActionGroup)
