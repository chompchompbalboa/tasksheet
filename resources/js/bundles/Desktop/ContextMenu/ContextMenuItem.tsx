//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useState } from 'react'
import styled from 'styled-components'

import { SUBITEM_ARROW } from '@/assets/icons'

import Icon from '@/components/Icon'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const ContextMenuItem = ({
  children,
  containerBackgroundColor = 'transparent',
  containerHoverBackgroundColor = 'rgb(242, 242, 242)',
  decorator = null,
  isFirstItem = false,
  isLastItem = false,
  logo = null,
  onClick,
  testId = 'ContextMenuItem',
  text
}: IContextMenuItem) => {
  
  const [ isSubItemsVisible, setIsSubItemsVisible ] = useState(false)

  return (
    <Container
      data-testid={testId}
      containerBackgroundColor={containerBackgroundColor}
      containerHoverBackgroundColor={containerHoverBackgroundColor}
      isFirstItem={isFirstItem}
      isLastItem={isLastItem}
      onClick={onClick}
      onMouseEnter={() => setIsSubItemsVisible(true)}
      onMouseLeave={() => setIsSubItemsVisible(false)}>
      <Logo>{logo && <Icon icon={logo}/>}</Logo>
      <Text>{text}</Text>
      <Decorator>{children ? <Icon icon={SUBITEM_ARROW}/> : decorator && <Icon icon={decorator}/>}</Decorator>
      {children && isSubItemsVisible &&
        <SubItems
          isSubItemsVisible={isSubItemsVisible}>
          <SubItemsScrollContainer>
            {children}
          </SubItemsScrollContainer>
        </SubItems>}
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface IContextMenuItem {
  children?: any
  containerBackgroundColor?: string
  containerHoverBackgroundColor?: string
  decorator?: string
  isFirstItem?: boolean
  isLastItem?: boolean
  logo?: string
  onClick?(...args: any): void
  text: string
  testId?: string
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  cursor: default;
  min-width: 8rem;
  width: 100%;
  padding: ${ ({ isFirstItem, isLastItem }: IContainer ) => isFirstItem ? '0.55rem 0.75rem 0.425rem 0' : (isLastItem ? '0.425rem 0.75rem 0.55rem 0' : '0.425rem 0.75rem 0.425rem 0') };
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${ ({ containerBackgroundColor }: IContainer ) => containerBackgroundColor };
  font-size: 1rem;
  transition: background-color 0.05s;
  border-radius: ${ ({ isFirstItem, isLastItem }: IContainer ) => isFirstItem ? '3px 3px 0 0' : (isLastItem ? '0 0 3px 3px' : 'none') };
  &:hover {
    background-color: ${ ({ containerHoverBackgroundColor }: IContainer ) => containerHoverBackgroundColor };
  }
`

interface IContainer {
  containerBackgroundColor: IContextMenuItem['containerBackgroundColor']
  containerHoverBackgroundColor: IContextMenuItem['containerHoverBackgroundColor']
  isFirstItem: boolean
  isLastItem: boolean
}

const Logo = styled.div`
  margin: 0 0.5rem;
  width: 0.75rem;
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

const SubItemsScrollContainer = styled.div``

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
  overflow-x: visible;
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
