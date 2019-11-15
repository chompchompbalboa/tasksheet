//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useState } from 'react'
import styled from 'styled-components'

import SheetActionButton from '@app/bundles/Sheet/SheetActionButton'

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
      <Priorities>
        Priorities
      </Priorities>
    </SheetActionButton>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface ISheetActionSheetCellPriorities {
  sheetId: string
}

const Priorities = styled.div``

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetActionSheetCellPriorities
