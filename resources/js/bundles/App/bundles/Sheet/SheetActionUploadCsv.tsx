//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { UPLOAD } from '@app/assets/icons'

import { IAppState } from '@app/state'
import {
  updateActiveSiteSplashForm,
  updateActiveSiteSplashFormMessage
} from '@app/state/active/actions'
import {
  updateModal
} from '@app/state/modal/actions'

import SheetActionButton from '@app/bundles/Sheet/SheetActionButton'
import SheetActionButtonDropdown from '@app/bundles/Sheet/SheetActionButtonDropdown'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionUploadCsv = () => {

  const dispatch = useDispatch()
  const isDemoUser = useSelector((state: IAppState) => state.user.tasksheetSubscription.type === 'DEMO')
  const userFolderId = useSelector((state: IAppState) => state.user.folderId)

  const [ isDropdownVisible, setIsDropdownVisible ] = useState(false)

  const handleButtonClick = () => {
    if(isDemoUser) {
      dispatch(updateActiveSiteSplashForm('REGISTER'))
      dispatch(updateActiveSiteSplashFormMessage('ACCOUNT_NEEDED_TO_UPLOAD_CSV'))
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth'})
    }
    else {
      dispatch(updateModal({ activeModal: 'CREATE_SHEET_FROM_CSV', createSheetFolderId: userFolderId, openSheetAfterCreate: true }))
    }
  }

  return (
    <SheetActionButton
      closeDropdown={() => setIsDropdownVisible(false)}
      icon={UPLOAD}
      iconSize="0.85rem"
      isDropdownVisible={isDropdownVisible}
      marginRight="0"
      onClick={() => handleButtonClick()}
      openDropdown={() => setIsDropdownVisible(true)}
      text='.csv'
      tooltip='Create a new sheet from a .csv file'>
      <SheetActionButtonDropdown>
        Create a new sheet from a .csv file
      </SheetActionButtonDropdown>
    </SheetActionButton>
  )
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetActionUploadCsv
