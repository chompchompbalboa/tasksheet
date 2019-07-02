//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { SETTINGS_BACKGROUND_COLOR_HOVER } from '@app/assets/colors'

import { ChromePicker } from 'react-color'
import SettingsTileItem from './SettingsTileItem'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SettingsUserColorColor = ({
  color,
  label,
  onColorChange
}: SettingsUserColorColorProps) => {

  const colorPickerContainer = useRef(null)

  const [ isColorPickerVisible, setIsColorPickerVisible ] = useState(false)
  useEffect(() => {
    if(isColorPickerVisible) {
      window.addEventListener('click', handleClick)
    }
    return () => {
      window.removeEventListener('click', handleClick)
    }
  }, [isColorPickerVisible])

  const handleClick = (e: Event) => {
    if(!colorPickerContainer.current.contains(e.target)) {
      setIsColorPickerVisible(false)
    }
  }

  return (
    <SettingsTileItem>
      <Description
        data-testid="description"
        onClick={() => setIsColorPickerVisible(!isColorPickerVisible)}>
        <Label>
          {label}
        </Label>
        <Color
          colorBackgroundColor={color}/>
      </Description>
      <ColorPicker
        data-testid="colorPicker"
        ref={colorPickerContainer}
        isColorPickerVisible={isColorPickerVisible}>
        <ChromePicker
          color={color}
          onChangeComplete={nextColor => onColorChange(nextColor.hex)}/>
      </ColorPicker>
    </SettingsTileItem>
  )
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
export type SettingsUserColorColorProps = {
  color: string
  label: string
  onColorChange(nextColor: string): void
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Description = styled.div`
  cursor: pointer;
  position: relative;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.25rem;
  border-radius: 2px;
  &:hover {
    background-color: ${ SETTINGS_BACKGROUND_COLOR_HOVER };
  }
`

const Color = styled.div`
  width: 1rem;
  height: 1rem;
  background-color: ${({ colorBackgroundColor }: ColorProps) => colorBackgroundColor};
`
type ColorProps = {
  colorBackgroundColor: string
}

const Label = styled.div``

const ColorPicker = styled.div`
  z-index: 10;
  display: ${ ({ isColorPickerVisible }: ColorPickerProps) => isColorPickerVisible ? 'block' : 'none'};
  position: absolute;
  top: 100%;
  right: 0;
`
type ColorPickerProps = {
  isColorPickerVisible: boolean
}

export default SettingsUserColorColor
