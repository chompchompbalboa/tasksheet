//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { MouseEvent, useState, useEffect, RefObject } from 'react'
import styled from 'styled-components'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
export const SheetHeaderResizeContainer = ({ 
  containerBackgroundColor = 'rgb(180, 180, 180)',
  containerWidth = '2px',
  gridContainerRef = null,
  onResizeStart = null,
  onResizeEnd = null
}: SheetHeaderResizeContainerProps) => {

  const [ currentClientX, setCurrentClientX ] = useState(0)
  const [ gridContainerScrollLeft, setGridContainerScrollLeft ] = useState(0)
  const [ isResizing, setIsResizing ] = useState(false)
  const [ startClientX, setStartClientX ] = useState(null)

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }
    else {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
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
    gridContainerRef && setGridContainerScrollLeft(gridContainerRef.current.scrollLeft)
  }
  
  const handleMouseMove = (e: Event) => {
    document.body.style.cursor = 'col-resize'
    e.preventDefault()
    // @ts-ignore
    setCurrentClientX(e.clientX)
  }
  
  const handleMouseUp = (e: Event) => {
    document.body.style.cursor = null
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('mouseup', handleMouseUp)
    setCurrentClientX(null)
    setIsResizing(false)
    setStartClientX(null)
    // @ts-ignore
    onResizeEnd(e.clientX - startClientX)
  }

  return (
    <Container
      data-testid="SheetHeaderResizeContainer"
      containerBackgroundColor={containerBackgroundColor}
      containerLeft={currentClientX}
      containerWidth={containerWidth}
      gridContainerScrollLeft={gridContainerScrollLeft}
      isResizing={isResizing}
      onMouseDown={(e: MouseEvent<HTMLDivElement>) => handleMouseDown(e)}/>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
export type SheetHeaderResizeContainerProps = {
  containerBackgroundColor?: string
  containerWidth?: string
  gridContainerRef?: RefObject<HTMLDivElement>
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
  left: ${ ({ containerLeft, gridContainerScrollLeft }: ContainerProps) => containerLeft + gridContainerScrollLeft + "px" };
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
  containerLeft: number
  containerWidth: string
  gridContainerScrollLeft: number
  isResizing: boolean
}

export default SheetHeaderResizeContainer