//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { MouseEvent } from 'react'
import styled from 'styled-components'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
export default class ResizeContainer extends React.Component<ResizeContainerProps, ResizeContainerState> {

  state: ResizeContainerState = {
    currentPageX: null,
    isResizing: false,
    startPageX: null
  }

  static defaultProps: ResizeContainerProps = {
    containerBackgroundColor: 'red',
    containerWidth: '5px',
    onResize: null
  }
  
  handleMouseDown = (e: MouseEvent) => {
    e.preventDefault()
    window.addEventListener('mousemove', this.handleMouseMove)
    window.addEventListener('mouseup', this.handleMouseUp)
    this.setState({
      isResizing: true,
      startPageX: e.pageX
    })
  }
  
  handleMouseMove = (e: Event) => {
    document.body.style.cursor = 'col-resize'
    e.preventDefault()
    this.setState({
      // @ts-ignore
      currentPageX: e.pageX
    })
  }
  
  handleMouseUp = () => {
    document.body.style.cursor = null
    const {
      onResize
    } = this.props
    const {
      currentPageX,
      startPageX
    } = this.state
    window.removeEventListener('mousemove', this.handleMouseMove)
    window.removeEventListener('mouseup', this.handleMouseUp)
    onResize(currentPageX - startPageX)
    this.setState({
      currentPageX: null,
      isResizing: false,
      startPageX: null
    })
  }
  render() {
    const {
      containerBackgroundColor,
      containerWidth
    } = this.props
    const {
      currentPageX,
      isResizing,
      startPageX
    } = this.state
    return (
      <Container
        containerBackgroundColor={containerBackgroundColor}
        containerLeft={(currentPageX - startPageX) === -startPageX ? "0" : (currentPageX - startPageX) + "px"}
        containerWidth={containerWidth}
        isResizing={isResizing}
        onMouseDown={(e: MouseEvent<HTMLDivElement>) => this.handleMouseDown(e)}/>
    )
  }
}

//-----------------------------------------------------------------------------
// Props & State
//-----------------------------------------------------------------------------
type ResizeContainerProps = {
  containerBackgroundColor: string
  containerWidth: string
  onResize(widthChange: number): void
}

type ResizeContainerState = {
  currentPageX: number
  isResizing: boolean
  startPageX: number
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