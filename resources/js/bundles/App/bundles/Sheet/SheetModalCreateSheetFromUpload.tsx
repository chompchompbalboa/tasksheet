//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { ChangeEvent, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { AppState } from '@app/state'
import { ThunkDispatch } from '@app/state/types'
import { ModalUpdates } from '@app/state/modal/types'
import { selectModalCreateSheetFolderId } from '@app/state/modal/selectors'
import { 
  updateModal as updateModalAction,
} from '@app/state/modal/actions' 
import { 
  createSheetFromUpload as createSheetFromUploadAction,
} from '@app/state/sheet/actions' 

//-----------------------------------------------------------------------------
// Redux
//-----------------------------------------------------------------------------
const mapStateToProps = (state: AppState) => ({
  folderId: selectModalCreateSheetFolderId(state)
})

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  createSheetFromUpload: (fileToUpload: File) => dispatch(createSheetFromUploadAction(fileToUpload)),
  updateModal: (updates: ModalUpdates) => dispatch(updateModalAction(updates))
})

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetModalCreateSheetFromUpload = ({
  createSheetFromUpload,
  updateModal
}: SheetModalCreateSheetFromUploadProps) => {
  
  const input = useRef(null)

  useEffect(() => {
    input.current.click()
    addEventListener('focus', handleFileDialogClose)
  }, [])

  // This fires when a file is selected or the user hits cancel
  const handleFileDialogClose = (e: Event) => {
    removeEventListener('focus', handleFileDialogClose)
    setTimeout(() => updateModal({ activeModal: null, createSheetFolderId: null }), 500)
  }
  
  // This only fires when a file is selected
  const handleFileDialogSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const fileToUpload = e.target.files[0]
    createSheetFromUpload(fileToUpload)
  }

  return (
    <StyledInput
      ref={input}
      name="upload"
      type="file"
      accept=".csv,.xls,.xlsx"
      onChange={e => handleFileDialogSelect(e)}/>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetModalCreateSheetFromUploadProps {
  createSheetFromUpload?(fileToUpload: File): void
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
