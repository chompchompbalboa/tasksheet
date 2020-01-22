//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { PLUS_SIGN } from '@/assets/icons' 

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
  const userId = useSelector((state: IAppState) => state.user.id)
  
  // State
  const [ isSheetLinkCurrentlyBeingCreated, setIsSheetLinkCurrentlyBeingCreated ] = useState(false)

  // Handle Click
  const handleClick = () => {
    setIsSheetLinkCurrentlyBeingCreated(true)
    setTimeout(() => {
      dispatch(createSheetLink(sheetId, null, userId))
    }, 25)
    setTimeout(() => {
      setIsSheetLinkCurrentlyBeingCreated(false)
    }, 2000)
  }

  return (
    <SheetActionButton
      icon={PLUS_SIGN}
      iconSize="0.85rem"
      marginRight="0"
      onClick={() => handleClick()}
      text={isSheetLinkCurrentlyBeingCreated ? "Creating..." : "Link"}
      tooltip="Create a linked sheet"/>
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
