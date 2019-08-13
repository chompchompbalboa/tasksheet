//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { AppState } from '@app/state'
import { ThunkDispatch } from '@app/state/types'
import { Modal as TModal, ModalUpdates } from '@app/state/modal/types'
import { 
  updateModal as updateModalAction,
} from '@app/state/modal/actions' 
import { selectActiveModal } from '@app/state/modal/selectors'

import SheetModalCreateSheet from '@app/bundles/Sheet/SheetModalCreateSheet'

//-----------------------------------------------------------------------------
// Redux
//-----------------------------------------------------------------------------
const mapStateToProps = (state: AppState) => ({
  activeModal: selectActiveModal(state)
})

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  updateModal: (updates: ModalUpdates) => dispatch(updateModalAction(updates))
})

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const Modals = ({
  activeModal,
  updateModal
}: ModalsProps) => {

  const modal = useRef(null)

  useEffect(() => {
    if(activeModal !== null) { addEventListener('mousedown', closeModalOnClickOutside) }
    else { removeEventListener('mousedown', closeModalOnClickOutside)}
    return () => { removeEventListener('mousedown', closeModalOnClickOutside) }
  }, [ activeModal ])

  const closeModalOnClickOutside = (e: Event) => {
    if(!modal.current.contains(e.target)) {
      updateModal({
        activeModal: null
      })
    }
  }
  
  const modals = {
    CREATE_SHEET: SheetModalCreateSheet
  }
  
  const ActiveModal = modals[activeModal]
  
  if(activeModal !== null) {
    return (
      <Container>
        <Modal
          ref={modal}>
          <ActiveModal />
        </Modal>
      </Container>
    )
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
//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  z-index: 10000;
  position: fixed;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.25);
`

const Modal = styled.div`
  background-color: white;
  padding: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
`

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Modals)
