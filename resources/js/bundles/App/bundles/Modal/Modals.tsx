//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { connect } from 'react-redux'

import { AppState } from '@app/state'
import { Modal as TModal, ModalUpdates } from '@app/state/modal/types'
import { selectActiveModal } from '@app/state/modal/selectors'

import SheetModalCreateSheet from '@app/bundles/Sheet/SheetModalCreateSheet'
import SheetModalCreateSheetFromUpload from '@app/bundles/Sheet/SheetModalCreateSheetFromUpload'

//-----------------------------------------------------------------------------
// Redux
//-----------------------------------------------------------------------------
const mapStateToProps = (state: AppState) => ({
  activeModal: selectActiveModal(state)
})

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const Modals = ({
  activeModal
}: ModalsProps) => {
  
  const modals = {
    CREATE_SHEET: SheetModalCreateSheet,
    CREATE_SHEET_FROM_UPLOAD: SheetModalCreateSheetFromUpload
  }
  
  const ActiveModal = modals[activeModal]
  
  if(activeModal !== null) {
    return <ActiveModal />
  }
  return null
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface ModalsProps {
  activeModal?: TModal
  updateModal?(updates: ModalUpdates): void
}

export default connect(
  mapStateToProps
)(Modals)
