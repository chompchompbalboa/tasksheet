//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { SHEET_LINK } from '@/assets/icons' 

import { IAppState } from '@/state'
import { createSheetLink } from '@/state/sheet/actions'

import SheetActionButton from '@desktop/Sheet/SheetActionButton'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionCreateSheetLink = ({
  sheetId
}: ISheetActionCreateSheetLink) => {

  // Redux
  const dispatch = useDispatch()
  const userFolderId = useSelector((state: IAppState) => state.user.folderId)
  
  // State
  const [ isSheetLinkCurrentlyBeingCreated, setIsSheetLinkCurrentlyBeingCreated ] = useState(false)

  // Handle Click
  const handleClick = () => {
    setIsSheetLinkCurrentlyBeingCreated(true)
    setTimeout(() => {
      dispatch(createSheetLink(sheetId, userFolderId))
    }, 25)
    setTimeout(() => {
      setIsSheetLinkCurrentlyBeingCreated(false)
    }, 2000)
  }

  return (
    <SheetActionButton
      icon={SHEET_LINK}
      iconPadding={isSheetLinkCurrentlyBeingCreated ? "0.4rem 0.4rem" : "0.225rem 0.4rem"}
      iconTextSize={isSheetLinkCurrentlyBeingCreated ? "0.78rem" : "1rem"}
      marginLeft="0"
      marginRight="0"
      onClick={() => handleClick()}
      tooltip="Create a linked sheet"
      text={isSheetLinkCurrentlyBeingCreated ? "Creating..." : "+"}/>
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
