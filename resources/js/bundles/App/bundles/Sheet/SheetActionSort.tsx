//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'

import { Column, Columns } from '@app/state/sheet/types'

import SheetAction from '@app/bundles/Sheet/SheetAction'
import SheetActionDropdown from '@app/bundles/Sheet/SheetActionDropdown'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionSort = ({
  columns
}: SheetActionProps) => {

  const sortOptions = columns && columns.map((column: Column) => { return { label: column.name, value: column.id }})

  return (
    <SheetAction>
      <SheetActionDropdown
        options={sortOptions}
        placeholder={"Sort By..."}
        selectedOptions={[{ label: "Name", value: "Name"}]}/>
    </SheetAction>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetActionProps {
  columns: Columns
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetActionSort
