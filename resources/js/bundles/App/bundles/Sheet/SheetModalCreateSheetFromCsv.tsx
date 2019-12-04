//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { ChangeEvent, useEffect, useRef } from 'react'
import { connect, useSelector } from 'react-redux'
import styled from 'styled-components'

import { IAppState } from '@app/state'
import { IThunkDispatch } from '@app/state/types'
import { IModalUpdates } from '@app/state/modal/types'
import { selectModalCreateSheetFolderId } from '@app/state/modal/selectors'
import { 
  updateModal as updateModalAction,
} from '@app/state/modal/actions' 
import { 
  createSheetFromCsv as createSheetFromCsvAction,
} from '@app/state/sheet/actions' 
import { IFolder } from '@app/state/folder/types'

//-----------------------------------------------------------------------------
// Redux
//-----------------------------------------------------------------------------
const mapStateToProps = (state: IAppState) => ({
  folderId: selectModalCreateSheetFolderId(state)
})

const mapDispatchToProps = (dispatch: IThunkDispatch) => ({
  createSheetFromCsv: (folderId: IFolder['id'], fileToCsv: File, openSheetAfterCreate: boolean) => dispatch(createSheetFromCsvAction(folderId, fileToCsv, openSheetAfterCreate)),
  updateModal: (updates: IModalUpdates) => dispatch(updateModalAction(updates))
})

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetModalCreateSheetFromCsv = ({
  folderId,
  createSheetFromCsv,
  updateModal
}: SheetModalCreateSheetFromCsvProps) => {
  
  const input = useRef(null)
  
  const openSheetAfterCreate = useSelector((state: IAppState) => state.modal.openSheetAfterCreate)

  useEffect(() => {
    input.current.click()
    addEventListener('focus', handleFileDialogClose)
  }, [])

  // This fires when a file is selected or the user hits cancel
  const handleFileDialogClose = (e: Event) => {
    removeEventListener('focus', handleFileDialogClose)
    setTimeout(() => updateModal({ activeModal: null, createSheetFolderId: null, openSheetAfterCreate: false }), 500)
  }
  
  // This only fires when a file is selected
  const handleFileDialogSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const fileToCsv = e.target.files[0]
    createSheetFromCsv(folderId, fileToCsv, openSheetAfterCreate)
  }

  return (
    <StyledInput
      ref={input}
      type="file"
      accept=".csv"
      onChange={e => handleFileDialogSelect(e)}/>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetModalCreateSheetFromCsvProps {
  createSheetFromCsv?(folderId: IFolder['id'], fileToCsv: File, openSheetAfterCreate: boolean): void
  folderId: IFolder['id']
  updateModal?(updates: IModalUpdates): void
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
)(SheetModalCreateSheetFromCsv)
