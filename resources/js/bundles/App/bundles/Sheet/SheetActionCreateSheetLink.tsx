//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useDispatch } from 'react-redux'

import { SHEET_LINK } from '@app/assets/icons' 

import { updateIsSavingNewFile } from '@app/state/folder/actions'
import { createSheetLink } from '@app/state/sheet/actions'
import { updateActiveTab } from '@app/state/tab/actions'

import SheetActionButton from '@app/bundles/Sheet/SheetActionButton'

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
      iconPadding="0.2rem 0.4rem"
      iconTextSize="1rem"
      marginLeft="0"
      marginRight="0"
      onClick={() => handleClick()}
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
