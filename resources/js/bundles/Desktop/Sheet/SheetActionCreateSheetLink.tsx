//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useDispatch } from 'react-redux'

import { SHEET_LINK } from '@/assets/icons' 

import { updateIsSavingNewFile } from '@/state/folder/actions'
import { createSheetLink } from '@/state/sheet/actions'
import { updateActiveTab } from '@/state/tab/actions'

import SheetActionButton from '@desktop/Sheet/SheetActionButton'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionCreateSheetLink = ({
  sheetId
}: ISheetActionCreateSheetLink) => {

  const dispatch = useDispatch()

  const handleClick = () => {
    dispatch(updateActiveTab('FOLDERS'))
    dispatch(updateIsSavingNewFile(true, (newViewName: string) => {
      dispatch(createSheetLink(sheetId, newViewName))
      dispatch(updateIsSavingNewFile(false, null))
    }))
  }

  return (
    <SheetActionButton
      icon={SHEET_LINK}
      iconPadding="0.225rem 0.4rem"
      iconTextSize="1rem"
      marginLeft="0"
      marginRight="0"
      onClick={() => handleClick()}
      tooltip="Create a linked sheet"
      text="+"/>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface ISheetActionCreateSheetLink {
  sheetId: string
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetActionCreateSheetLink
