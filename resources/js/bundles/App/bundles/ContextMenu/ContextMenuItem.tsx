//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useState } from 'react'
import styled from 'styled-components'

import { SUBITEM_ARROW } from '@app/assets/icons'

import Icon from '@/components/Icon'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const ContextMenuItem = ({
  children,
  decorator = null,
  logo = null,
  text
}: ContextMenuItemProps) => {
  
  const [ isSubItemsVisible, setIsSubItemsVisible ] = useState(false)

  return (
    <Container
      onMouseEnter={() => setIsSubItemsVisible(true)}
      onMouseLeave={() => setIsSubItemsVisible(false)}>
      <Logo>{logo && <Icon icon={logo}/>}</Logo>
      <Text>{text}</Text>
      <Decorator>{children ? <Icon icon={SUBITEM_ARROW}/> : decorator && <Icon icon={decorator}/>}</Decorator>
      {children && isSubItemsVisible &&
        <SubItems
          isSubItemsVisible={isSubItemsVisible}>
          {children}
        </SubItems>}
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface ContextMenuItemProps {
  children?: any
  decorator?: string
  logo?: string
  text: string
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  cursor: default;
  width: 100%;
  padding: 0.625rem 0.625rem 0.625rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1rem;
  transition: background-color 0.05s;
  &:hover {
    background-color: rgb(242, 242, 242);
  }
`

const Logo = styled.div`
  width: 1.25rem;
`

const Text = styled.div`
  margin-right: auto;
  white-space: nowrap;
`

const Decorator = styled.div`
  width: 1.5rem;
  display: flex;
  justify-content: flex-end;
`

const SubItems = styled.div`
  display: ${ ({ isSubItemsVisible }: SubItemProps ) => isSubItemsVisible ? 'block' : 'none'};
  align-self: flex-start;
  position: absolute;
  left: 100%;
  margin-top: -0.625rem;
  background-color: white;
  border-radius: 3px;
  box-shadow: 3px 3px 10px 0px rgba(150,150,150,1);
`
interface SubItemProps {
  isSubItemsVisible: boolean
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default ContextMenuItem
