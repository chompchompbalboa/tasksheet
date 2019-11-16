//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useState } from 'react'
//import styled from 'styled-components'

import SheetActionButton from '@app/bundles/Sheet/SheetActionButton'
import SheetActionButtonDropdown from '@app/bundles/Sheet/SheetActionButtonDropdown'
import SheetActionSheetCellPrioritiesCreatePriority from '@app/bundles/Sheet/SheetActionSheetCellPrioritiesCreatePriority'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionSheetCellPriorities = ({
  sheetId
}: ISheetActionSheetCellPriorities) => {

  const [ isDropdownVisible, setIsDropdownVisible ] = useState(false)

  return (
    <SheetActionButton
      closeDropdown={() => setIsDropdownVisible(false)}
      isDropdownVisible={isDropdownVisible}
      marginLeft="0"
      marginRight="0"
      openDropdown={() => setIsDropdownVisible(true)}
      text="Priorities">
      <SheetActionButtonDropdown>
        <SheetActionSheetCellPrioritiesCreatePriority
          sheetId={sheetId}/>
      </SheetActionButtonDropdown>
    </SheetActionButton>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface ISheetActionSheetCellPriorities {
  sheetId: string
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetActionSheetCellPriorities
