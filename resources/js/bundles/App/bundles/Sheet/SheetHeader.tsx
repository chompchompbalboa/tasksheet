//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { MouseEvent } from 'react'
import styled from 'styled-components'

import { SheetColumn } from '@app/state/sheet/types'

import ResizeContainer from '@app/components/ResizeContainer'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetHeader = ({
  column: {
    id,
    name,
    width
  },
  handleContextMenu,
  isLast,
  isResizing,
  onResizeStart,
  onResizeEnd
}: SheetHeaderProps) => {

  return (
    <Container
      containerWidth={width}
      isLast={isLast}
      isResizing={isResizing}
      onContextMenu={(e: MouseEvent) => handleContextMenu(e, 'COLUMN', id)}>
      <NameContainer>
        {name}
      </NameContainer>
      <ResizeContainer
        onResizeStart={onResizeStart}
        onResizeEnd={onResizeEnd}/>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetHeaderProps {
  column: SheetColumn
  handleContextMenu(e: MouseEvent, type: string, id: string): void
  isLast: boolean
  isResizing: boolean
  onResizeStart(): void
  onResizeEnd(widthChange: number): void
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  cursor: ${ ({ isResizing }: ContainerProps) => isResizing ? 'col-resize' : 'default' };
  display: inline-flex;
  user-select: none;
  width: ${ ({ containerWidth }: ContainerProps ) => containerWidth + 'px'};
  height: 100%;
  text-align: left;
  background-color: rgb(250, 250, 250);
  box-shadow: inset 0 -1px 0px 0px rgba(180,180,180,1);
  border-right: ${ ({ isLast }: ContainerProps ) => isLast ? '1px solid rgb(180, 180, 180)' : 'none'};
  font-size: 0.875rem;
  font-weight: bold;
`
interface ContainerProps {
  containerWidth: number
  isLast: boolean
  isResizing: boolean
}

const NameContainer = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0.28rem 0 0.28rem 0.14rem;
  width: calc(100% - 3px);
  white-space: nowrap;
  display: flex;
  align-items: center;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetHeader
