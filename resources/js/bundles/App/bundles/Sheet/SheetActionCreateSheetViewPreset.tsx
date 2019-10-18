//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { ARROW_DOWN, STAR } from '@app/assets/icons' 

import { IAppState } from '@app/state'
import { createSheetViewPreset } from '@app/state/sheet/actions'

import Icon from '@/components/Icon'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionLocalSheetViews = ({
  sheetId
}: ISheetActionLocalSheetViewsProps) => {

  const dispatch = useDispatch()
  
  // Dropdown
  const dropdown = useRef(null)
  const [ isDropdownVisible, setIsDropdownVisible ] = useState(false)
  useEffect(() => {
    if(isDropdownVisible) { addEventListener('click', closeOnClickOutside) }
    else { removeEventListener('click', closeOnClickOutside) }
    return () => removeEventListener('click', closeOnClickOutside)
  })
  const closeOnClickOutside = (e: MouseEvent) => {
    if(!dropdown.current.contains(e.target)) {
      setIsDropdownVisible(false)
    }
  }

  const userColorPrimary = useSelector((state: IAppState) => state.user.color.primary)

  return (
    <Container>
      <IconContainer
        containerBackgroundColor={userColorPrimary}
        onClick={() => dispatch(createSheetViewPreset(sheetId))}>
        <Icon 
          icon={STAR}
          size="1.1rem"/>
      </IconContainer>
      <DropdownToggle
        dropdownToggleBackgroundColor={userColorPrimary}
        onClick={() => setIsDropdownVisible(true)}>
        <Icon 
          icon={ARROW_DOWN}/>
      </DropdownToggle>
      <Dropdown
        ref={dropdown}
        isDropdownVisible={isDropdownVisible}>
        Dropdown
      </Dropdown>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface ISheetActionLocalSheetViewsProps {
  sheetId: string
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  position: relative;
  margin-right: 0.375rem;
  margin-left: 0.125rem;
  cursor: pointer;  
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgb(210, 210, 210);
  color: rgb(80, 80, 80);
  border-radius: 3px;
  transition: all 0.05s;
`

const IconContainer = styled.div`
  display: flex;
  flex-direction: column;
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

const Dropdown = styled.div`
  display: ${ ({ isDropdownVisible }: IDropdown) => isDropdownVisible ? 'block' : 'none' };
  position: absolute;
  left: 0;
  top: 100%;
  padding: 0.625rem;
  border-radius: 5px;
  background-color: rgb(250, 250, 250);
  box-shadow: 1px 1px 10px 0px rgba(0,0,0,0.5);
`
interface IDropdown {
  isDropdownVisible: boolean
}
//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetActionLocalSheetViews
