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
  contextMenuRight,
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
      contextMenuLeft={contextMenuLeft}
      contextMenuRight={contextMenuRight}>
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
  contextMenuLeft?: number
  contextMenuRight?: number
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  z-index: 10000;
  position: fixed;
  top: ${( { contextMenuTop }: ContainerProps ) => contextMenuTop  + 'px'};
  left: ${( { contextMenuLeft }: ContainerProps ) => contextMenuLeft ? contextMenuLeft + 'px' : 'auto'};
  right: ${( { contextMenuRight }: ContainerProps ) => contextMenuRight ? contextMenuRight + 'px' : 'auto' };
  background-color: white;
  border-radius: 8px;
  min-width: 8rem;
  box-shadow: 3px 3px 10px 0px rgba(150,150,150,1);
`
interface ContainerProps {
  contextMenuTop: number
  contextMenuLeft?: number
  contextMenuRight?: number
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default ContextMenu
