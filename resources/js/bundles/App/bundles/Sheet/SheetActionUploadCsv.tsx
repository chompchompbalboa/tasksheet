//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { UPLOAD } from '@app/assets/icons'

import { IAppState } from '@app/state'
import {
  updateModal
} from '@app/state/modal/actions'

import SheetActionButton from '@app/bundles/Sheet/SheetActionButton'
import SheetActionButtonDropdown from '@app/bundles/Sheet/SheetActionButtonDropdown'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionUploadCsv = ({
  sheetId
}: ISheetActionUploadCsv) => {

  const dispatch = useDispatch()
  const isDemoUser = useSelector((state: IAppState) => state.user.isDemoUser)

  const [ isDropdownVisible, setIsDropdownVisible ] = useState(false)

  const handleButtonClick = () => {
    if(isDemoUser) {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth'})
    }
    else {
      dispatch(updateModal({ activeModal: 'CREATE_SHEET_FROM_CSV' }))
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
      tooltip='Upload a .csv file'>
      <SheetActionButtonDropdown>
        Upload .csv
      </SheetActionButtonDropdown>
    </SheetActionButton>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface ISheetActionUploadCsv {
  sheetId: string
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetActionUploadCsv
