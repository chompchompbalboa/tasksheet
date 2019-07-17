//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'

import Dropdown from '@app/bundles/Dropdown/Dropdown'
import DropdownItem from '@app/bundles/Dropdown/DropdownItem'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetColumnDropdown = ({
  closeDropdown,
  dropdownLeft,
  dropdownTop,
}: SheetColumnDropdownProps) => {

  return (
    <Dropdown
      closeDropdown={closeDropdown}
      dropdownTop={dropdownTop}
      dropdownLeft={dropdownLeft}>
      <DropdownItem text="SheetColumnDropdown" />
    </Dropdown>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetColumnDropdownProps {
  closeDropdown(): void
  dropdownLeft: number
  dropdownTop: number
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetColumnDropdown
