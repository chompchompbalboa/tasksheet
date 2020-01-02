//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'

import { ISheetCellTypesSharedProps } from '@mobile/Sheet/SheetCell'

import SheetCellContainer from '@mobile/Sheet/SheetCellContainer'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
export const SheetCellPlaceholder = ({
  cell
}: ISheetCellTypesSharedProps) => {
  return (
    <SheetCellContainer>
      {cell && cell.value ? cell.value : ''}
    </SheetCellContainer>
  )
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetCellPlaceholder
