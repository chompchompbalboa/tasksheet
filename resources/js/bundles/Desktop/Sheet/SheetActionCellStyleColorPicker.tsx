//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { colorPickerColors } from '@/components/ColorPicker'
import { ARROW_DOWN, RESET_COLOR } from '@/assets/icons'

import { useSheetEditingPermissions } from '@/hooks'

import { IAppState } from '@/state'
import { ISheet } from '@/state/sheet/types'

import { createMessengerMessage } from '@/state/messenger/actions'

import Icon from '@/components/Icon'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionCellStyleColorPicker = ({
  sheetId,
  icon,
  initialColor,
  isBeforeDivider = false,
  sheetStylesSet,
  sheetStylesColorReference,
  updateSheetStyles,
}: SheetActionCellStyleColorPickerProps) => {

  // Refs
  const dropdown = useRef(null)
  
  // Redux
  const dispatch = useDispatch()
  const userColorPrimary = useSelector((state: IAppState) => state.user.color.primary)
  const selections = useSelector((state: IAppState) => state.sheet.allSheets && state.sheet.allSheets[sheetId] && state.sheet.allSheets[sheetId].selections)

  // State
  const [ localColor, setLocalColor ] = useState(initialColor || 'black')
  const [ isDropdownVisible, setIsDropdownVisible ] = useState(false)

  // Permissions
  const {
    userHasPermissionToEditSheet,
    userHasPermissionToEditSheetErrorMessage
  } = useSheetEditingPermissions(sheetId)
  
  // Add event listeners to close the dropdown on click outside
  useEffect(() => {
    if(isDropdownVisible) { addEventListener('click', closeDropdownOnClickOutside) }
    else { removeEventListener('click', closeDropdownOnClickOutside) }
    return () => removeEventListener('click', closeDropdownOnClickOutside)
  })

  // Close Dropdown On Click Outside
  const closeDropdownOnClickOutside = (e: MouseEvent) => {
    if(!dropdown.current.contains(e.target)) {
      setIsDropdownVisible(false)
    }
  }

  // Handle Container Click
  const handleContainerClick = (color?: string) => {
    if(!userHasPermissionToEditSheet) {
      dispatch(createMessengerMessage(userHasPermissionToEditSheetErrorMessage))
    }
    else {
      const {
        rangeCellIds,
        rangeStartCellId
      } = selections

      const nextColor = color || localColor
      const nextSheetStylesSet = new Set([ ...sheetStylesSet ])
      const nextSheetStylesColorReference = { ...sheetStylesColorReference }
  
      // Ranges
      rangeCellIds.forEach(cellId => {
        nextSheetStylesSet.add(cellId)
        nextSheetStylesColorReference[cellId] = nextColor
      })
      // Cells
      nextSheetStylesSet.add(rangeStartCellId)
      nextSheetStylesColorReference[rangeStartCellId] = nextColor
  
      updateSheetStyles(nextSheetStylesSet, nextSheetStylesColorReference)
    }
  }

  // Handle Color Change
  const handleColorChange = (nextColor: string) => {
    if(!userHasPermissionToEditSheet) {
      dispatch(createMessengerMessage(userHasPermissionToEditSheetErrorMessage))
    }
    else {
      setLocalColor(nextColor)
      handleContainerClick(nextColor)
    }
  }

  // Handle Color Reset
  const handleColorReset = () => {
    if(!userHasPermissionToEditSheet) {
      dispatch(createMessengerMessage(userHasPermissionToEditSheetErrorMessage))
    }
    else {
      const {
        rangeCellIds,
        rangeStartCellId
      } = selections

      const nextSheetStylesSet = new Set([ ...sheetStylesSet ])
      const nextSheetStylesColorReference = { ...sheetStylesColorReference }

      // Ranges
      rangeCellIds.forEach(cellId => {
        nextSheetStylesSet.delete(cellId)
        nextSheetStylesColorReference[cellId] = null
      })
      // Cells
      nextSheetStylesSet.delete(rangeStartCellId)
      nextSheetStylesColorReference[rangeStartCellId] = null

      updateSheetStyles(nextSheetStylesSet, nextSheetStylesColorReference)
    }
  }

  return (
    <Container
      isBeforeDivider={isBeforeDivider}>
      <CurrentColorContainer
        containerBackgroundColor={userColorPrimary}
        onClick={() => handleContainerClick()}>
        <Icon 
          icon={icon}/>
        <CurrentColor
          currentColor={localColor}/>
      </CurrentColorContainer>
      <DropdownToggle
        dropdownToggleBackgroundColor={userColorPrimary}
        onClick={() => setIsDropdownVisible(true)}>
        <Icon 
          icon={ARROW_DOWN}/>
      </DropdownToggle>
      <Dropdown
        ref={dropdown}
        isDropdownVisible={isDropdownVisible}>
        <ResetColor
          onClick={handleColorReset}>
          <Icon 
            icon={RESET_COLOR}
            size="1.125rem"/>
          &nbsp;&nbsp;Reset
        </ResetColor>
        <Colors>
          {colorPickerColors.map((colorGroup, colorGroupIndex) => (
            <ColorGroup
              key={colorGroupIndex}>
              {colorGroup.map((color, colorIndex) => (
                <Color
                  key={colorIndex}
                  colorBackgroundColor={color}
                  isCurrentColor={color === localColor}
                  onClick={() => handleColorChange(color)}/>
              ))}
            </ColorGroup>
          ))}
        </Colors>
      </Dropdown>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetActionCellStyleColorPickerProps {
  sheetId: ISheet['id']
  icon: string
  initialColor?: string
  isBeforeDivider?: boolean
  sheetStylesSet: Set<string>
  sheetStylesColorReference: { [cellId: string]: string }
  updateSheetStyles(nextSheetStylesSet: Set<string>, nextSheetStylesColorReference: { [cellId: string ]: string }): void
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  position: relative;
  margin-right: ${ ({ isBeforeDivider }: IContainer ) => isBeforeDivider ? '0' : '0.375rem' };
  cursor: pointer;  
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgb(220, 220, 220);
  color: rgb(80, 80, 80);
  text-decoration: none;
  border-radius: 3px;
  border: 1px solid rgb(175, 175, 175);
`
interface IContainer {
  isBeforeDivider: boolean
}

const CurrentColorContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0.35rem 0.4rem;
  transition: all 0.05s;
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
  &:hover {
    background-color: ${ ({ containerBackgroundColor }: ICurrentColorContainer) => containerBackgroundColor};
    color: rgb(240, 240, 240);
  }
`
interface ICurrentColorContainer {
  containerBackgroundColor: string
}

const CurrentColor = styled.div`
  width: 100%;
  height: 0.15rem;
  background-color: ${ ({ currentColor }: ICurrentColor ) => currentColor};
`
interface ICurrentColor {
  currentColor: string
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
  box-shadow: 2px 2px 15px 0px rgba(0,0,0,0.3);
`
interface IDropdown {
  isDropdownVisible: boolean
}

const ResetColor = styled.div`
  width: 100%;
  padding: 0.25rem;
  margin-bottom: 0.25rem;
  border-radius: 3px;
  display: flex;
  align-items: center;
  font-size: 0.85rem;
  &:hover {
    background-color: rgb(210, 210, 210);
  }
`

const Colors = styled.div`
  display: flex;
`

const ColorGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 0.0625rem;
`

const Color = styled.div`
  cursor: pointer;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 1px;
  background-color: ${ ({ colorBackgroundColor }: IColor) => colorBackgroundColor};
  box-shadow: ${ ({ colorBackgroundColor, isCurrentColor }: IColor) => isCurrentColor ? 'inset 0px 0px 0px 1px white' : 'inset 0px 0px 0px 1px trasnparent' };
  border: ${ ({ isCurrentColor }: IColor) => isCurrentColor ? '2px solid black' : '1px solid rgb(230, 230, 230)' };
  transition: all 0.15s;
  &:hover {
    box-shadow: inset 0px 0px 0px 1px white;
    border: 2px solid black;
  }
`
interface IColor {
  colorBackgroundColor: string
  isCurrentColor: boolean
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetActionCellStyleColorPicker
