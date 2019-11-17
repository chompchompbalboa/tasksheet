//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'

import Icon from '@/components/Icon'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionButtonDropdownItem = ({
  icon,
  iconSize = "0.88rem",
  onClick,
  isLast = false
}: ISheetActionButtonDropdownItem) => (
  <Container
    isLast={isLast}
    onClick={onClick}>
    <Icon
      icon={icon}
      size={iconSize}/>
  </Container>
)

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface ISheetActionButtonDropdownItem {
  icon: string
  iconSize?: string
  onClick(...args: any): void
  isLast?: boolean
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  cursor: pointer;
  padding: 0 0.125rem;
  margin-right: ${ ({ isLast }: IContainer ) => isLast ? '0' : '0.1875rem' };
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    opacity: 0.85;
  }
`
interface IContainer {
  isLast: boolean
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetActionButtonDropdownItem
