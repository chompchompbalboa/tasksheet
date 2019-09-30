//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { 
  updateModal,
} from '@app/state/modal/actions' 

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const Modals = ({
  children
}: ModalsProps) => {

  const dispatch = useDispatch()

  const modal = useRef(null)

  useEffect(() => {
    addEventListener('mousedown', closeModalOnClickOutside)
    return () => { removeEventListener('mousedown', closeModalOnClickOutside) }
  }, [])

  const closeModalOnClickOutside = (e: Event) => {
    if(!modal.current.contains(e.target)) {
      dispatch(updateModal({ activeModal: null }))
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

export default Modals
