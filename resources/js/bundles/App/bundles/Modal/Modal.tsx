//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { ThunkDispatch } from '@app/state/types'
import { IModalUpdates } from '@app/state/modal/types'
import { 
  updateModal as updateModalAction,
} from '@app/state/modal/actions' 

//-----------------------------------------------------------------------------
// Redux
//-----------------------------------------------------------------------------
const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  updateModal: (updates: IModalUpdates) => dispatch(updateModalAction(updates))
})

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const Modals = ({
  children,
  updateModal
}: ModalsProps) => {

  const modal = useRef(null)

  useEffect(() => {
    addEventListener('mousedown', closeModalOnClickOutside)
    return () => { removeEventListener('mousedown', closeModalOnClickOutside) }
  }, [])

  const closeModalOnClickOutside = (e: Event) => {
    if(!modal.current.contains(e.target)) {
      updateModal({ activeModal: null })
    }
  }
  
  return (
    <Container>
      <Modal
        ref={modal}>
        {children}
      </Modal>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface ModalsProps {
  children?: any
  updateModal?(updates: IModalUpdates): void
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
  null,
  mapDispatchToProps
)(Modals)
