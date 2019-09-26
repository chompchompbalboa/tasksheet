//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { ARROW_DOWN, RESET_COLOR } from '@app/assets/icons'

import { AppState } from '@app/state'
import { Sheet } from '@app/state/sheet/types'

import Icon from '@/components/Icon'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionCellStyleColorPicker = ({
  sheetId,
  icon,
  initialColor,
  sheetStylesSet,
  sheetStylesColorReference,
  updateSheetStyles,
}: SheetActionCellStyleColorPickerProps) => {
  
  // Redux
  const userColorPrimary = useSelector((state: AppState) => state.user.color.primary)
  const selections = useSelector((state: AppState) => state.sheet.allSheets && state.sheet.allSheets[sheetId] && state.sheet.allSheets[sheetId].selections)
  
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

  // Local Color
  const [ localColor, setLocalColor ] = useState(initialColor || 'black')

  const handleContainerClick = (color?: string) => {
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

  const handleColorChange = (nextColor: string) => {
    setLocalColor(nextColor)
    handleContainerClick(nextColor)
  }

  const handleResetClick = () => {
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
  
  const colors = [
    ['rgba(255, 255, 255, 1)', 'rgba(0, 0, 0, 0.125)', 'rgba(0, 0, 0, 0.25)', 'rgba(0, 0, 0, 0.375)'],
    ['rgba(0, 0, 0, 0.5)', 'rgba(0, 0, 0, 0.625)', 'rgba(0, 0, 0, 0.75)', 'rgba(0, 0, 0, 1)'],
    ['rgba(255, 0, 0, 0.25)', 'rgba(255, 0, 0, 0.5)', 'rgba(255, 0, 0, 0.75)', 'rgba(255, 0, 0, 1)'],
    ['rgba(255, 127, 0, 0.25)', 'rgba(255, 127, 0, 0.5)', 'rgba(255, 127, 0, 0.75)', 'rgba(255, 127, 0, 1)'],
    ['rgba(255, 255, 0, 0.25)', 'rgba(255, 255, 0, 0.5)', 'rgba(255, 255, 0, 0.75)', 'rgba(255, 255, 0, 1)'],
    ['rgba(0, 255, 0 , 0.25)', 'rgba(0, 255, 0 , 0.5)', 'rgba(0, 255, 0 , 0.75)', 'rgba(0, 255, 0 , 1)'],
    ['rgba(0, 0, 255, 0.25)', 'rgba(0, 0, 255, 0.5)', 'rgba(0, 0, 255, 0.75)', 'rgba(0, 0, 255, 1)'],
    ['rgba(75, 0, 130, 0.25)', 'rgba(75, 0, 130, 0.5)', 'rgba(75, 0, 130, 0.75)', 'rgba(75, 0, 130, 1)'],
    ['rgba(143, 0, 255, 0.25)', 'rgba(143, 0, 255, 0.5)', 'rgba(143, 0, 255, 0.75)', 'rgba(143, 0, 255, 1)'],
  ]

  return (
    <Container>
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
          onClick={handleResetClick}>
          <Icon 
            icon={RESET_COLOR}
            size="1.125rem"/>
          &nbsp;&nbsp;Reset
        </ResetColor>
        <Colors>
          {colors.map((colorGroup, colorGroupIndex) => (
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
  sheetId: Sheet['id']
  icon: string
  initialColor?: string
  sheetStylesSet: Set<string>
  sheetStylesColorReference: { [cellId: string]: string }
  updateSheetStyles(nextSheetStylesSet: Set<string>, nextSheetStylesColorReference: { [cellId: string ]: string }): void
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  position: relative;
  margin-right: 0.375rem;
  cursor: pointer;  
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgb(210, 210, 210);
  color: rgb(80, 80, 80);
  text-decoration: none;
  border-radius: 3px;
`

const CurrentColorContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0.325rem 0.4rem;
  transition: all 0.05s;
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
  &:hover {
    background-color: ${ ({ containerBackgroundColor }: IContainer) => containerBackgroundColor};
    color: rgb(240, 240, 240);
  }
`
interface IContainer {
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
