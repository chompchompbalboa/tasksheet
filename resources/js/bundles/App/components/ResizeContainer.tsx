//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { MouseEvent, useState, useEffect } from 'react'
import styled from 'styled-components'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
export const ResizeContainer = ({ 
  containerBackgroundColor = 'rgb(180, 180, 180)',
  containerWidth = '2px',
  onResizeStart = null,
  onResizeEnd = null
}: ResizeContainerProps) => {

  const [ currentClientX, setCurrentClientX ] = useState(0)
  const [ isResizing, setIsResizing ] = useState(false)
  const [ startClientX, setStartClientX ] = useState(null)

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  })
  
  const handleMouseDown = (e: MouseEvent) => {
    e.preventDefault()
    onResizeStart()
    setIsResizing(true)
    setStartClientX(e.clientX)
    setCurrentClientX(e.clientX)
  }
  
  const handleMouseMove = (e: Event) => {
    document.body.style.cursor = 'col-resize'
    e.preventDefault()
    // @ts-ignore mouse-move
    setCurrentClientX(e.clientX)
  }
  
  const handleMouseUp = (e: Event) => {
    document.body.style.cursor = null
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('mouseup', handleMouseUp)
    setCurrentClientX(null)
    setIsResizing(false)
    setStartClientX(null)
    // @ts-ignore mouse-move
    onResizeEnd(e.clientX - startClientX)
  }

  return (
    <Container
      data-testid="resizeContainer"
      containerBackgroundColor={containerBackgroundColor}
      containerLeft={currentClientX + "px"}
      containerWidth={containerWidth}
      isResizing={isResizing}
      onMouseDown={(e: MouseEvent<HTMLDivElement>) => handleMouseDown(e)}/>
  )
}

//-----------------------------------------------------------------------------
// Props & State
//-----------------------------------------------------------------------------
export type ResizeContainerProps = {
  containerBackgroundColor?: string
  containerWidth?: string
  onResizeStart?(): void
  onResizeEnd(widthChange: number): void
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  z-index: 10000;
  position: ${ ({ isResizing }: ContainerProps) => isResizing ? 'fixed' : 'relative' };
  cursor: col-resize;
  left: ${ ({ containerLeft }: ContainerProps) => containerLeft };
  width: ${ ({ containerWidth, isResizing }: ContainerProps) => isResizing ? containerWidth : '4px' };
  height: 100%;
  background-color: ${ ({ containerBackgroundColor, isResizing }: ContainerProps) => isResizing ? containerBackgroundColor : 'transparent' };
  &:hover {
    background-color: ${ ({ containerBackgroundColor }: ContainerProps) => containerBackgroundColor };
    opacity: ${ ({ isResizing }: ContainerProps) => !isResizing ? '0.625' : '1' };
  }
`
type ContainerProps = {
  containerBackgroundColor: string
  containerLeft: string
  containerWidth: string
  isResizing: boolean
}

export default ResizeContainer