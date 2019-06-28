//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { MouseEvent, useState, useEffect } from 'react'
import styled from 'styled-components'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
export const ResizeContainer = ({ 
  containerBackgroundColor = 'red',
  containerWidth = '5px',
  onResize = null
}: ResizeContainerProps) => {

  const [ currentClientX, setCurrentClientX ] = useState(null)
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
    setIsResizing(true)
    setStartClientX(e.clientX)
    setCurrentClientX(e.clientX)
  }
  
  const handleMouseMove = (e: Event) => {
    document.body.style.cursor = 'col-resize'
    e.preventDefault()
    // @ts-ignore
    setCurrentClientX(e.clientX)
  }
  
  const handleMouseUp = () => {
    document.body.style.cursor = null
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('mouseup', handleMouseUp)
    onResize(currentClientX - startClientX)
    setCurrentClientX(null)
    setIsResizing(null)
    setStartClientX(null)
  }

  return (
    <Container
      data-testid="resizeContainer"
      containerBackgroundColor={containerBackgroundColor}
      containerLeft={(currentClientX - startClientX) === -startClientX ? "0" : (currentClientX - startClientX) + "px"}
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
  onResize(widthChange: number): void
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  position: relative;
  cursor: col-resize;
  left: ${ ({ containerLeft }: ContainerProps) => containerLeft };
  width: ${ ({ containerWidth }: ContainerProps) => containerWidth };
  height: 100%;
  background-color: ${ ({ containerBackgroundColor, isResizing }: ContainerProps) => isResizing ? containerBackgroundColor : 'transparent' };
`
type ContainerProps = {
  containerBackgroundColor: string
  containerLeft: string
  containerWidth: string
  isResizing: boolean
}

export default ResizeContainer