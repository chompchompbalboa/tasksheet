//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useSelector } from 'react-redux'

import { IAppState } from '@/state'
import { IModal } from '@/state/modal/types'

import SheetModalCreateSheetFromCsv from '@desktop/Sheet/SheetModalCreateSheetFromCsv'

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
