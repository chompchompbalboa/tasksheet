//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useSelector } from 'react-redux'

import { PLUS_SIGN } from '@app/assets/icons'

import { IAppState } from '@app/state'

import SheetActionButton from '@app/bundles/Sheet/SheetActionButton'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionCreateSheet = ({
  sheetId
}: ISheetActionCreateSheet) => {

  const isDemoUser = useSelector((state: IAppState) => state.user.subscription.type === 'DEMO')

  const handleButtonClick = () => {
    if(isDemoUser) {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth'})
    }
  }

  return (
    <SheetActionButton
      icon={PLUS_SIGN}
      iconSize="0.85rem"
      marginLeft="0"
      onClick={() => handleButtonClick()}
      text='Sheet'
      tooltip='Create a new sheet'>
    </SheetActionButton>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface ISheetActionCreateSheet {
  sheetId: string
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetActionCreateSheet
