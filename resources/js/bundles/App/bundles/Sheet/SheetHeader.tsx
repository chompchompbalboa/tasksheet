//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { MouseEvent, useState } from 'react'
import styled from 'styled-components'

import { Column } from '@app/state/sheet/types'

import SheetHeaderContextMenu from '@app/bundles/ContextMenu/SheetHeaderContextMenu'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetHeader = ({
  column: {
    name,
    width
  },
  isLast
}: SheetHeaderProps) => {

  const [ isContextMenuVisible, setIsContextMenuVisible ] = useState(false)
  const [ contextMenuTop, setContextMenuTop ] = useState(null)
  const [ contextMenuLeft, setContextMenuLeft ] = useState(null)

  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault()
    setContextMenuTop(e.clientY)
    setContextMenuLeft(e.clientX)
    setIsContextMenuVisible(true)
  }

  return (
    <Container
      containerWidth={width}
      isContextMenuVisible={isContextMenuVisible}
      isLast={isLast}
      onContextMenu={(e: MouseEvent) => handleContextMenu(e)}>
      {name}
    {isContextMenuVisible && 
      <SheetHeaderContextMenu
        contextMenuTop={contextMenuTop}
        contextMenuLeft={contextMenuLeft}
        closeContextMenu={() => setIsContextMenuVisible(false)}/>}
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetHeaderProps {
  column: Column
  isLast: boolean
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  display: inline-block;
  overflow: hidden;
  text-overflow: hidden;
  z-index: ${ ({ isContextMenuVisible }: ContainerProps ) => isContextMenuVisible ? '100' : '50'};
  width: ${ ({ containerWidth }: ContainerProps ) => containerWidth + 'px'};
  padding: 0.28rem;
  text-align: left;
  background-color: rgb(250, 250, 250);
  box-shadow: inset 0 -1px 0px 0px rgba(180,180,180,1);
  border-right: ${ ({ isLast }: ContainerProps ) => isLast ? '1px solid rgb(180, 180, 180)' : 'none'};
  font-size: 0.875rem;
  font-weight: bold;
`
interface ContainerProps {
  containerWidth: number
  isContextMenuVisible: boolean
  isLast: boolean
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetHeader
