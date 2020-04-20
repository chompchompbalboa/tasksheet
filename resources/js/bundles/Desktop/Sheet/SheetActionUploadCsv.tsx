//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useDispatch } from 'react-redux'

import { UPLOAD } from '@/assets/icons'

import {
  updateModal
} from '@/state/modal/actions'

import SheetActionButton from '@desktop/Sheet/SheetActionButton'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionUploadCsv = () => {

  // Redux
  const dispatch = useDispatch()

  // Handle Button Click
  const handleButtonClick = () => {
    dispatch(updateModal({ activeModal: 'CREATE_SHEET_FROM_CSV', createSheetFolderId: null, openSheetAfterCreate: true }))
  }

  return (
    <SheetActionButton
      icon={UPLOAD}
      onClick={() => handleButtonClick()}
      tooltip='Create a new sheet from a .csv file'>
    </SheetActionButton>
  )
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetActionUploadCsv
