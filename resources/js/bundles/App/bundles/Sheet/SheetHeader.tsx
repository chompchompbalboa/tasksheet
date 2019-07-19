//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { MouseEvent, useState } from 'react'
import styled from 'styled-components'

import { Column } from '@app/state/sheet/types'

import SheetColumnContextMenu from '@app/bundles/ContextMenu/SheetColumnContextMenu'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetColumn = ({
  column: {
    name,
    width
  }
}: SheetColumnProps) => {

  const [ isContextMenuVisible, setIsContextMenuVisible ] = useState(false)
  const [ contextMenuTop, setContextMenuTop ] = useState(null)
  const [ contextMenuLeft, setContextMenuLeft ] = useState(null)

  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault()
    setContextMenuTop(e.pageY)
    setContextMenuLeft(e.pageX)
    setIsContextMenuVisible(true)
  }

  return (
    <Container
      containerWidth={width}
      isContextMenuVisible={isContextMenuVisible}
      onContextMenu={(e: MouseEvent) => handleContextMenu(e)}>
      {name}
    {isContextMenuVisible && 
      <SheetColumnContextMenu
        contextMenuTop={contextMenuTop}
        contextMenuLeft={contextMenuLeft}
        closeContextMenu={() => setIsContextMenuVisible(false)}/>}
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetColumnProps {
  column: Column
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.th`
  z-index: ${ ({ isContextMenuVisible }: ContainerProps ) => isContextMenuVisible ? '100' : '50'};
  position: sticky;
  top: 2rem;
  width: ${ ({ containerWidth }: ContainerProps ) => containerWidth + 'px'};
  padding: 0.25rem 0 0.25rem 0.25rem;
  text-align: left;
  background-color: rgb(250, 250, 250);
  box-shadow: 0px 1px 0px 0px rgba(180,180,180,1);
  font-size: 0.85rem;
`
interface ContainerProps {
  containerWidth: number
  isContextMenuVisible: boolean
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetColumn
