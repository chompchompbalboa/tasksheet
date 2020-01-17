//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { UPLOAD } from '@/assets/icons'

import { IAppState } from '@/state'
import {
  updateModal
} from '@/state/modal/actions'

import SheetActionButton from '@desktop/Sheet/SheetActionButton'
import SheetActionButtonDropdown from '@desktop/Sheet/SheetActionButtonDropdown'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionUploadCsv = () => {

  // Redux
  const dispatch = useDispatch()
  const userFolderId = useSelector((state: IAppState) => state.user.folderId)

  // State
  const [ isDropdownVisible, setIsDropdownVisible ] = useState(false)

  // Handle Button Click
  const handleButtonClick = () => {
    dispatch(updateModal({ activeModal: 'CREATE_SHEET_FROM_CSV', createSheetFolderId: userFolderId, openSheetAfterCreate: true }))
  }

  return (
    <SheetActionButton
      closeDropdown={() => setIsDropdownVisible(false)}
      icon={UPLOAD}
      iconSize="0.85rem"
      isDropdownVisible={isDropdownVisible}
      marginLeft="0"
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
