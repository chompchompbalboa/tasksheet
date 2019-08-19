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
  onClick,
  text
}: ContextMenuItemProps) => {
  
  const [ isSubItemsVisible, setIsSubItemsVisible ] = useState(false)

  return (
    <Container
      onClick={onClick}
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
  onClick?(...args: any): void
  text: string
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  cursor: default;
  min-width: 8rem;
  width: 100%;
  padding: 0.5rem 0.5rem 0.5rem 0;
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
  margin: 0 0.5rem;
  width: 1.125rem;
  display: flex;
  align-items: center;
  justify-content: center;
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
  max-height: 50vh;
	overflow-y: scroll;
	scrollbar-width: none;
	-ms-overflow-style: none;
	&::-webkit-scrollbar {
		width: 0;
		height: 0;
	}
`
interface SubItemProps {
  isSubItemsVisible: boolean
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default ContextMenuItem
