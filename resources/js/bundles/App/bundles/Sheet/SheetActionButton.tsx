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
  iconPadding = '0.35rem 0.4rem',
  iconSize = '1.1rem',
  iconTextSize = '0.75rem',
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
        hasDropdown={typeof(children) !== 'undefined'}
        iconPadding={iconPadding}
        onClick={() => onClick()}>
        <Icon 
          icon={icon}
          size={text ? "1rem" : iconSize}/>
        {text &&
          <IconText
            iconTextSize={iconTextSize}>
            {text}
          </IconText>
        }
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
  closeDropdown?(): void
  icon: string
  iconPadding?: string
  iconSize?: string
  iconTextSize?: string
  isDropdownVisible?: boolean
  marginLeft?: string
  marginRight?: string
  onClick?(): void
  openDropdown?(): void,
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
  background-color: rgb(220, 220, 220);
  color: rgb(80, 80, 80);
  border-radius: 3px;
  transition: all 0.05s;
  border: 1px solid rgb(200, 200, 200);
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
  padding: ${ ({ iconPadding }: IIconContainer ) => iconPadding };
  transition: all 0.05s;
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
  border-top-right-radius: ${ ({ hasDropdown }: IIconContainer) => hasDropdown ? '0' : '3px' };
  border-bottom-right-radius: ${ ({ hasDropdown }: IIconContainer) => hasDropdown ? '0' : '3px' };
  &:hover {
    background-color: ${ ({ containerBackgroundColor }: IIconContainer) => containerBackgroundColor };
    color: rgb(240, 240, 240);
  }
`
interface IIconContainer {
  containerBackgroundColor: string
  hasDropdown: boolean
  iconPadding: string
}

const IconText = styled.div`
  white-space: nowrap;
  margin-left: 0.25rem;
  font-size: ${ ({ iconTextSize }: IIconText ) => iconTextSize };
`
interface IIconText {
  iconTextSize: string
}

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
  min-width: 100%;
  border-radius: 5px;
  background-color: rgb(250, 250, 250);
  box-shadow: 2px 2px 15px 0px rgba(0,0,0,0.3);
  white-space: nowrap;
  border: 1px solid rgb(200, 200, 200);
`
interface IDropdown {
  isDropdownVisible: boolean
}
//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetActionButton
