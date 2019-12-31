//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'

//-----------------------------------------------------------------------------
// Components
//-----------------------------------------------------------------------------
const SheetSettingsContentColumnItem = ({
  icon,
  isHighlighted,
  name,
  onClick
}: SheetSettingsContentColumnItemProps) => (
  <Container
    isHighlighted={isHighlighted}
    onClick={onClick}>
    {icon && 
      <IconContainer>
        {icon}
      </IconContainer>
    }
    <NameContainer>
      {name}
    </NameContainer>
  </Container>
)

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetSettingsContentColumnItemProps {
  children?: any
  icon?: string
  isHighlighted: boolean
  name: string
  onClick(...args: any): void
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  justify-content: space-between;
  cursor: default;
  width: 100%;
  padding: 0.125rem 0 0.125rem 0.325rem;
  display: flex;
  align-items: center;
  background-color: ${ ({ isHighlighted }: ContainerProps ) => isHighlighted ? 'rgb(235, 235, 235)' : 'transparent' };
  color: rgb(20, 20, 20);
  &:hover {
    background-color: rgb(235, 235, 235);
  }
`
interface ContainerProps {
  isHighlighted: boolean
}

const NameContainer = styled.div`
  padding: 0.05rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetSettingsContentColumnItem
