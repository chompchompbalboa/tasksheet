//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'

import { RESET_COLOR } from '@/assets/icons'

import Icon from '@/components/Icon'

//-----------------------------------------------------------------------------
// Colors
//-----------------------------------------------------------------------------
export const colorPickerColors = [
  [ 'rgb(255, 200, 200)', 'rgb(255, 150, 150)', 'rgb(255, 100, 100)', 'rgb(255, 0, 0)' ],
  [ 'rgb(255, 205, 155)', 'rgb(255, 185, 115)', 'rgb(255, 150, 50)', 'rgb(255, 115, 0)' ],
  [ 'rgb(255, 255, 160)', 'rgb(255, 255, 110)', 'rgb(255, 255, 50)', 'rgb(255, 255, 0)' ],
  [ 'rgb(140, 255, 155)', 'rgb(90, 245, 145)', 'rgb(75, 195, 95)', 'rgb(40, 100, 0)' ],
  [ 'rgb(190, 215, 255)', 'rgb(135, 175, 255)', 'rgb(65, 135, 255)', 'rgb(0, 90, 255)' ],
  [ 'rgb(240, 175, 255)', 'rgb(230, 130, 255)', 'rgb(210, 70, 255)', 'rgb(190, 0, 255)' ],
]

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const ColorPicker = ({
  activeColor,
  onColorChange
}: ColorPickerProps) => {

  return (
      <Container>
        <ResetColor
          onClick={() => onColorChange(null)}>
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
                  isCurrentColor={color === activeColor}
                  onClick={() => onColorChange(color)}/>
              ))}
            </ColorGroup>
          ))}
        </Colors>
      </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface ColorPickerProps {
  activeColor: string
  onColorChange(nextColor: string): void
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------

const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 0.625rem;
  border-radius: 5px;
  background-color: rgb(250, 250, 250);
  box-shadow: 2px 2px 15px 0px rgba(0,0,0,0.3);
`

const ResetColor = styled.div`
  width: 100%;
  padding: 0.25rem;
  margin-bottom: 0.25rem;
  border-radius: 3px;
  display: flex;
  align-items: center;
  font-size: 0.85rem;
  color: black;
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
export default ColorPicker
