//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const ContextMenu = ({
  children,
  closeContextMenu,
  contextMenuLeft,
  contextMenuTop
}: ContextMenuProps) => {

  const container = useRef(null)

  useEffect(() => {
    window.addEventListener('mousedown', closeContextMenuOnClickOutside)
    return () => {
      window.removeEventListener('mousedown', closeContextMenuOnClickOutside)
    }
  }, [])

  const closeContextMenuOnClickOutside = (e: Event) => {
    if(!container.current.contains(e.target)) {
      closeContextMenu()
    }
  }

  return (
    <Container
      ref={container}
      contextMenuTop={contextMenuTop}
      contextMenuLeft={contextMenuLeft}>
      {children}
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface ContextMenuProps {
  children?: any
  closeContextMenu(): void
  contextMenuTop: number
  contextMenuLeft: number
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  z-index: 10000;
  overflow: auto;
  position: relative;
  top: 3.5vh;
  left: ${( { contextMenuLeft }: ContainerProps ) => contextMenuLeft * 0 + 'px'};
  background-color: white;
  border-radius: 3px;
  box-shadow: 3px 3px 10px 0px rgba(150,150,150,1);
`
interface ContainerProps {
  contextMenuTop: number
  contextMenuLeft: number
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default ContextMenu
