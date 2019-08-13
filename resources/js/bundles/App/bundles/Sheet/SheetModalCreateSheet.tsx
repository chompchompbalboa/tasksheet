//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { FILE_SHEET, UPLOAD } from '@app/assets/icons'

import { AppState } from '@app/state'
import { ThunkDispatch } from '@app/state/types'
import { selectModalCreateSheetFolderId } from '@app/state/modal/selectors'

import Icon from '@/components/Icon'

//-----------------------------------------------------------------------------
// Redux
//-----------------------------------------------------------------------------
const mapStateToProps = (state: AppState) => ({
  folderId: selectModalCreateSheetFolderId(state)
})

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
})

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetModalCreateSheet = ({
  folderId
}: SheetModalCreateSheetProps) => {
  return (
    <>
      <CreateSheetButton>
        <Icon icon={FILE_SHEET} size="2rem" />
        <CreateSheetButtonText>Brand New</CreateSheetButtonText>
      </CreateSheetButton>
      <CreateSheetButton>
        <Icon icon={UPLOAD} size="2rem" />
        <CreateSheetButtonText>From File</CreateSheetButtonText>
      </CreateSheetButton>
    </>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetModalCreateSheetProps {
  folderId: string
}
//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const CreateSheetButton = styled.div`
  cursor: pointer;
  padding: 1.5rem;
  margin: 0.75rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: rgb(50, 50, 50);
  border: 1px solid rgb(50, 50, 50);
  border-radius: 3px;
`

const CreateSheetButtonText = styled.div``

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SheetModalCreateSheet)
