//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { SHEET } from '@/assets/icons'

import { IAppState } from '@/state'
import {
  createSheet
} from '@/state/sheet/actions'

import SheetActionButton from '@desktop/Sheet/SheetActionButton'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionCreateSheet = () => {

  // Redux
  const dispatch = useDispatch()
  const userId = useSelector((state: IAppState) => state.user.id)
  
  // State
  const [ isSheetCurrentlyBeingCreated, setIsSheetCurrentlyBeingCreated ] = useState(false)

  // Handle Button Click
  const handleButtonClick = () => {
    setIsSheetCurrentlyBeingCreated(true)
    dispatch(createSheet(null, 'New Sheet', true, userId))
    setTimeout(() => {
      setIsSheetCurrentlyBeingCreated(false)
    }, 2500)
  }

  return (
    <SheetActionButton
      icon={SHEET}
      onClick={() => handleButtonClick()}
      text={ isSheetCurrentlyBeingCreated ? 'Creating...' : '' }
      tooltip='Create a new sheet'>
    </SheetActionButton>
  )
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetActionCreateSheet
