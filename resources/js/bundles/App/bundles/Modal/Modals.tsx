//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useSelector } from 'react-redux'

import { IAppState } from '@app/state'
import { IModal } from '@app/state/modal/types'

import SheetModalCreateSheetFromCsv from '@app/bundles/Sheet/SheetModalCreateSheetFromCsv'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const Modals = () => {

  const activeModal: IModal = useSelector((state: IAppState) => state.modal.activeModal)
  
  const modals = {
    CREATE_SHEET_FROM_CSV: SheetModalCreateSheetFromCsv
  }
  
  const ActiveModal = modals[activeModal]
  
  if(activeModal !== null) {
    return <ActiveModal />
  }
  return null
}

export default Modals
