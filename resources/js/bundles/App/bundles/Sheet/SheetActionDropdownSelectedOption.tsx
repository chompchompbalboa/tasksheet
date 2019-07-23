//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'

import { CLOSE } from '@app/assets/icons'

import Icon from '@/components/Icon'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionDropdownSelectedOption = ({
  children,
  onOptionDelete,
  optionBackgroundColor
}: SheetActionDropdownSelectedOptionProps) => (
  <Container
    optionBackgroundColor={optionBackgroundColor}>
    <Option>
      {children}
    </Option>
    <Delete
      onClick={() => onOptionDelete()}>
      <Icon 
        icon={CLOSE} 
        size="0.75rem"/>
    </Delete>
  </Container>
)

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetActionDropdownSelectedOptionProps {
  children?: any
  onOptionDelete?(...args: any[]): void
  optionBackgroundColor: string
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  padding: 0.125rem 0.25rem;
  margin-right: 0.25rem;
  background-color: ${ ({ optionBackgroundColor }: ContainerProps ) => optionBackgroundColor};
  color: white;
  border-radius: 7px;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
`
interface ContainerProps {
  optionBackgroundColor: string
}

const Option = styled.div`
  display: flex;
  align-items: center;
`

const Delete = styled.div`
  padding: 0.125rem;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0.5;
  &:hover {
    opacity: 1;
  }
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetActionDropdownSelectedOption
