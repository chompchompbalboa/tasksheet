//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { ARROW_DOWN } from '@app/assets/icons'

import { IAppState } from '@app/state'

import Icon from '@/components/Icon'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionButton = ({
  children,
  closeDropdown,
  icon,
  isDropdownVisible,
  marginLeft = '0.25rem',
  marginRight = '0.25rem',
  onClick,
  openDropdown,
  text
}: SheetActionButtonProps) => {
  
  const userColorPrimary = useSelector((state: IAppState) => state.user.color.primary)
  
  // Dropdown
  const container = useRef(null)
  useEffect(() => {
    if(isDropdownVisible) { setTimeout(() => addEventListener('click', e => closeOnClickOutside(e)), 10) }
    else { removeEventListener('click', e => closeOnClickOutside(e)) }
    return () => removeEventListener('click', e => closeOnClickOutside(e))
  }, [ isDropdownVisible ])

  const closeOnClickOutside = (e: MouseEvent) => {
    if(!container.current.contains(e.target)) {
      closeDropdown()
    }
  }

  return (
    <Container
      ref={container}
      containerMarginLeft={marginLeft}
      containerMarginRight={marginRight}>
      <IconContainer
        containerBackgroundColor={userColorPrimary}
        onClick={() => onClick()}>
        <Icon 
          icon={icon}
          size={text ? "1rem" : "1.1rem"}/>
        <IconText>
          {text}
        </IconText>
      </IconContainer>
      {children && 
        <>
          <DropdownToggle
            dropdownToggleBackgroundColor={userColorPrimary}
            onClick={() => openDropdown()}>
            <Icon 
              icon={ARROW_DOWN}/>
          </DropdownToggle>
          <DropdownContainer
            isDropdownVisible={isDropdownVisible}>
            {children}
          </DropdownContainer>
        </>
      }
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetActionButtonProps {
  children?: any // React Component,
  closeDropdown(): void
  icon: string
  isDropdownVisible?: boolean
  marginLeft?: string
  marginRight?: string
  onClick?(): void
  openDropdown(): void,
  text?: string
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  position: relative;
  margin-right: ${ ({ containerMarginRight }: IContainer) => containerMarginRight};
  margin-left: ${ ({ containerMarginLeft }: IContainer) => containerMarginLeft};
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgb(210, 210, 210);
  color: rgb(80, 80, 80);
  border-radius: 3px;
  transition: all 0.05s;
`
interface IContainer {
  containerMarginLeft: string
  containerMarginRight: string
}

const IconContainer = styled.div`
  cursor: pointer;  
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.325rem 0.4rem;
  transition: all 0.05s;
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
  &:hover {
    background-color: ${ ({ containerBackgroundColor }: IIconContainer) => containerBackgroundColor};
    color: rgb(240, 240, 240);
  }
`
interface IIconContainer {
  containerBackgroundColor: string
}

const IconText = styled.div`
  margin-left: 0.125rem;
  white-space: nowrap;
`

const DropdownToggle = styled.div`
  cursor: pointer;
  padding: 0.4rem 0.1rem;
  border-left: 1px solid rgb(170, 170, 170);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: all 0.05s;
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
  &:hover {
    background-color: ${ ({ dropdownToggleBackgroundColor }: IDropdownToggle) => dropdownToggleBackgroundColor};
    color: rgb(240, 240, 240);
  }
`

interface IDropdownToggle {
  dropdownToggleBackgroundColor: string
}

const DropdownContainer = styled.div`
  cursor: default;
  display: ${ ({ isDropdownVisible }: IDropdown) => isDropdownVisible ? 'block' : 'none' };
  position: absolute;
  left: 0;
  top: 100%;
  border-radius: 5px;
  background-color: rgb(250, 250, 250);
  box-shadow: 1px 1px 10px 0px rgba(0,0,0,0.5);
  white-space: nowrap;
`
interface IDropdown {
  isDropdownVisible: boolean
}
//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetActionButton
