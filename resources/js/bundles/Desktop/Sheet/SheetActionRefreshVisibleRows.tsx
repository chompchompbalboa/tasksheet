//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useDispatch } from 'react-redux'

import { REFRESH } from '@/assets/icons' 

import { refreshSheetVisibleRows } from '@/state/sheet/actions'

import SheetActionButton from '@desktop/Sheet/SheetActionButton'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionRefreshVisibleRows = ({
  sheetId
}: ISheetActionRefreshVisibleRowsProps) => {
  const dispatch = useDispatch()
  return (
    <SheetActionButton
      icon={REFRESH}
      marginLeft="0.25rem"
      onClick={() => dispatch(refreshSheetVisibleRows(sheetId))}
      tooltip="Refresh the view"/>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface ISheetActionRefreshVisibleRowsProps {
  sheetId: string
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetActionRefreshVisibleRows
