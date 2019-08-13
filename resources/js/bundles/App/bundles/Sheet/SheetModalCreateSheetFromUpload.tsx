//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useRef, useEffect } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { AppState } from '@app/state'
import { ThunkDispatch } from '@app/state/types'
import { ModalUpdates } from '@app/state/modal/types'
import { selectModalCreateSheetFolderId } from '@app/state/modal/selectors'
import { 
  updateModal as updateModalAction,
} from '@app/state/modal/actions' 

//-----------------------------------------------------------------------------
// Redux
//-----------------------------------------------------------------------------
const mapStateToProps = (state: AppState) => ({
  folderId: selectModalCreateSheetFolderId(state)
})

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  updateModal: (updates: ModalUpdates) => dispatch(updateModalAction(updates))
})

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetModalCreateSheetFromUpload = ({
  updateModal
}: SheetModalCreateSheetFromUploadProps) => {
  
  const input = useRef(null)

  useEffect(() => {
    input.current.click()
    addEventListener('focus', handleFileDialogClose)
  }, [])

  const handleFileDialogClose = (e: Event) => {
    removeEventListener('focus', handleFileDialogClose)
    updateModal({ activeModal: null, createSheetFolderId: null })
  }

  return (
    <StyledInput
      ref={input}
      type="file"/>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetModalCreateSheetFromUploadProps {
  updateModal?(updates: ModalUpdates): void
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const StyledInput = styled.input`
  display: none;
`

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SheetModalCreateSheetFromUpload)
