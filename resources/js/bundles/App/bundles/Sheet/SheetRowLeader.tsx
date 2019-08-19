//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { memo } from 'react'
import { areEqual } from 'react-window'
import styled from 'styled-components'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetRowLeader = memo(({
  isRowBreak,
  style,
  text = null
}: SheetRowLeaderProps) => (
    <Container 
      isRowBreak={isRowBreak}
      style={style}>
      <TextContainer
        isTextVisible={text !== null}>
        {text || '1'}
      </TextContainer>
    </Container>
), areEqual)

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetRowLeaderProps {
  isRowBreak: boolean
  style: {},
  text?: string
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  display: inline-flex;
  user-select: none;
  height: 100%;
  text-align: left;
  background-color: ${ ({ isRowBreak }: ContainerProps ) => isRowBreak ? 'rgb(190, 190, 190)' : 'rgb(250, 250, 250)'};
  box-shadow: inset -1px -1px 0px 0px rgba(180,180,180,1);
  &:hover {
    background-color: ${ ({ isRowBreak }: ContainerProps ) => isRowBreak ? 'rgb(190, 190, 190)' : 'rgb(235, 235, 235)'};
  }
`
interface ContainerProps {
  isRowBreak: boolean
}

const TextContainer = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 0.25rem;
  font-size: 0.7rem;
  width: calc(100% - 3px);
  white-space: nowrap;
  display: flex;
  align-items: center;
  color: ${ ({ isTextVisible }: TextContainerProps ) => isTextVisible ? 'inherit' : 'transparent'};
`
interface TextContainerProps {
  isTextVisible: boolean
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetRowLeader
