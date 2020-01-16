//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { ARROW_DOWN } from '@/assets/icons'

import { IAppState } from '@/state'

import Icon from '@/components/Icon'
import SheetActionTooltip from '@desktop/Sheet/SheetActionTooltip'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionButton = ({
  children,
  closeDropdown,
  containerBackgroundColor = 'rgb(220, 220, 220)',
  containerColor = 'rgb(80, 80, 80)',
  containerHoverBackgroundColor,
  containerHoverColor = 'rgb(240, 240, 240)',
  dropdownToggleBackgroundColor = 'rgb(220, 220, 220)',
  containerWidth = 'auto',
  icon,
  iconPadding = '0.4rem 0.4rem',
  iconSize = '1.1rem',
  iconTextSize = '0.78rem',
  isDropdownVisible,
  marginLeft = '0.25rem',
  marginRight = '0.25rem',
  onClick = () =>  null,
  openDropdown,
  text,
  tooltip
}: SheetActionButtonProps) => {

  const userColorPrimary = useSelector((state: IAppState) => state.user.color.primary)

  const tooltipTimer = useRef(null)
  const container = useRef(null)

  const [ isTooltipVisible, setIsTooltipVisible ] = useState(false)

  useEffect(() => {
    if(isDropdownVisible) { 
      clearTimeout(tooltipTimer.current)
      setTimeout(() => addEventListener('mousedown', e => closeOnClickOutside(e)), 10) 
    }
    else { removeEventListener('mousedown', e => closeOnClickOutside(e)) }
    return () => removeEventListener('mousedown', e => closeOnClickOutside(e))
  }, [ isDropdownVisible ])

  const closeOnClickOutside = (e: MouseEvent) => {
    if(container && container.current && !container.current.contains(e.target)) {
      closeDropdown()
    }
  }

  const handleMouseEnter = () => {
    if(!isDropdownVisible) {
      tooltipTimer.current = setTimeout(() => setIsTooltipVisible(true), 600)
    }
  }
  const handleMouseLeave = () => {
    clearTimeout(tooltipTimer.current)
    setIsTooltipVisible(false)
  }

  return (
    <Container
      ref={container}
      containerMarginLeft={marginLeft}
      containerMarginRight={marginRight}
      onMouseEnter={() => handleMouseEnter()}
      onMouseLeave={() => handleMouseLeave()}>
      <IconContainer
        containerBackgroundColor={containerBackgroundColor}
        containerColor={containerColor}
        containerHoverBackgroundColor={containerHoverBackgroundColor || userColorPrimary}
        containerHoverColor={containerHoverColor}
        containerWidth={containerWidth}
        hasDropdown={typeof(children) !== 'undefined'}
        iconPadding={iconPadding}
        onClick={() => {
          clearTimeout(tooltipTimer.current)
          setIsTooltipVisible(false)
          onClick()
        }}>
        {icon &&
          <Icon 
            icon={icon}
            size={text ? "1rem" : iconSize}/>
        }
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
            dropdownToggleBackgroundColor={dropdownToggleBackgroundColor}
            dropdownToggleHoverBackgroundColor={userColorPrimary}
            onClick={() => {
              clearTimeout(tooltipTimer.current)
              setIsTooltipVisible(false)
              openDropdown()
            }}>
            <Icon 
              icon={ARROW_DOWN}
              size={text ? "1rem" : iconSize}/>
          </DropdownToggle>
          <DropdownContainer
            isDropdownVisible={isDropdownVisible}>
            {children}
          </DropdownContainer>
        </>
      }
      {tooltip && 
        <SheetActionTooltip
          isTooltipVisible={isTooltipVisible}>
          {tooltip}
        </SheetActionTooltip>
      }
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetActionButtonProps {
  children?: any // React Component,
  containerBackgroundColor?: string
  containerColor?: string
  containerHoverBackgroundColor?: string
  containerHoverColor?: string
  containerWidth?: string
  closeDropdown?(): void
  dropdownToggleBackgroundColor?: string
  icon?: string
  iconPadding?: string
  iconSize?: string
  iconTextSize?: string
  isDropdownVisible?: boolean
  marginLeft?: string
  marginRight?: string
  onClick?(): void
  openDropdown?(): void,
  text?: string
  tooltip?: string
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
  color: rgb(80, 80, 80);
  border-radius: 3px;
  transition: all 0.05s;
  border: 1px solid rgb(175, 175, 175);
`
interface IContainer {
  containerMarginLeft: string
  containerMarginRight: string
}

const IconContainer = styled.div`
  cursor: pointer;  
  width: ${ ({ containerWidth }: IIconContainer) => containerWidth };
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: ${ ({ iconPadding }: IIconContainer ) => iconPadding };
  transition: all 0.05s;
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
  border-top-right-radius: ${ ({ hasDropdown }: IIconContainer) => hasDropdown ? '0' : '3px' };
  border-bottom-right-radius: ${ ({ hasDropdown }: IIconContainer) => hasDropdown ? '0' : '3px' };
  background-color: ${ ({ containerBackgroundColor }: IIconContainer) => containerBackgroundColor };
  color: ${ ({ containerColor }: IIconContainer) => containerColor };
  &:hover {
    background-color: ${ ({ containerHoverBackgroundColor }: IIconContainer) => containerHoverBackgroundColor };
    color: ${ ({ containerHoverColor }: IIconContainer) => containerHoverColor };
  }
`
interface IIconContainer {
  containerBackgroundColor: string
  containerColor: string
  containerHoverBackgroundColor: string
  containerHoverColor: string
  containerWidth: string
  hasDropdown: boolean
  iconPadding: string
}

const IconText = styled.div`
  margin-left: 0.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: ${ ({ iconTextSize }: IIconText ) => iconTextSize };
`
interface IIconText {
  iconTextSize: string
}

const DropdownToggle = styled.div`
  cursor: pointer;
  padding: 0.45rem 0.1rem;
  border-left: 1px solid rgb(175, 175, 175);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: all 0.05s;
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
    background-color: ${ ({ dropdownToggleBackgroundColor }: IDropdownToggle) => dropdownToggleBackgroundColor};
  &:hover {
    background-color: ${ ({ dropdownToggleHoverBackgroundColor }: IDropdownToggle) => dropdownToggleHoverBackgroundColor};
    color: rgb(240, 240, 240);
  }
`

interface IDropdownToggle {
  dropdownToggleBackgroundColor: string
  dropdownToggleHoverBackgroundColor: string
}

const DropdownContainer = styled.div`
  cursor: default;
  display: ${ ({ isDropdownVisible }: IDropdown) => isDropdownVisible ? 'block' : 'none' };
  position: absolute;
  left: -1px;
  top: 100%;
  min-width: 100%;
  border-radius: 5px;
  background-color: rgb(250, 250, 250);
  box-shadow: 2px 2px 15px 0px rgba(0,0,0,0.3);
  white-space: nowrap;
  border: 1px solid rgb(175, 175, 175);
`
interface IDropdown {
  isDropdownVisible: boolean
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetActionButton
