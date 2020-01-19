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
  cursor = "pointer",
  icon,
  iconSize = "0.88rem",
  onClick,
  isLast = false
}: ISheetActionButtonDropdownItem) => (
  <Container
    cursor={cursor}
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
  cursor?: "pointer" | "not-allowed"
  icon: string
  iconSize?: string
  onClick(...args: any): void
  isLast?: boolean
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  cursor: ${ ({ cursor }: IContainer ) => cursor };
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
  cursor: ISheetActionButtonDropdownItem['cursor']
  isLast: boolean
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetActionButtonDropdownItem
