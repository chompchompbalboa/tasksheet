//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { PLUS_SIGN } from '@app/assets/icons'

import { IAppState } from '@app/state'
import {
  updateActiveSiteSplashForm,
  updateActiveSiteSplashFormMessage
} from '@app/state/active/actions'
import {
  createSheet
} from '@app/state/sheet/actions'

import SheetActionButton from '@app/bundles/Sheet/SheetActionButton'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionCreateSheet = () => {

  const dispatch = useDispatch()
  const isDemoUser = useSelector((state: IAppState) => state.user.subscription.type === 'DEMO')
  const userFolderId = useSelector((state: IAppState) => state.user.folderId)

  const handleButtonClick = () => {
    if(isDemoUser) {
      dispatch(updateActiveSiteSplashForm('REGISTER'))
      dispatch(updateActiveSiteSplashFormMessage('ACCOUNT_NEEDED_TO_CREATE_SHEET'))
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth'})
    }
    else {
      dispatch(createSheet(userFolderId, 'New Sheet', true))
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
// Export
//-----------------------------------------------------------------------------
export default SheetActionCreateSheet
