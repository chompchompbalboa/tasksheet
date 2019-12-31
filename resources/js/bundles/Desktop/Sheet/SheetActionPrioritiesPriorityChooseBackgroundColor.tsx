//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { BACKGROUND_COLOR } from '@/assets/icons'

import { ISheetPriority } from '@/state/sheet/types'

import { updateSheetPriority } from '@/state/sheet/actions'

import ColorPicker from '@/components/ColorPicker'
import Icon from '@/components/Icon'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionPrioritiesPriorityChooseBackgroundColor = ({
  isColorPickerVisible,
  setIsColorPickerVisible,
  sheetPriority
}: ISheetActionPrioritiesPriorityChooseBackgroundColor) => {

  const dispatch = useDispatch()

  return (
    <Container>
      <IconContainer
        onClick={() => setIsColorPickerVisible(true)}>
      <Icon
        icon={BACKGROUND_COLOR}
        size="1.125rem"/>
      </IconContainer>
      <ColorPickerContainer
        isColorPickerVisible={isColorPickerVisible}>
        <ColorPicker
          activeColor={sheetPriority.backgroundColor}
          onColorChange={(nextColor: string) => dispatch(updateSheetPriority(sheetPriority.id, { backgroundColor: nextColor || 'white' }))}/>
      </ColorPickerContainer>
    </Container>
  ) 
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface ISheetActionPrioritiesPriorityChooseBackgroundColor {
  isColorPickerVisible: boolean
  setIsColorPickerVisible(nextIsColorPickerVisible: boolean): void
  sheetPriority: ISheetPriority
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  position: relative;
  cursor: pointer;
  padding: 0 0.125rem;
  display: flex;
  align-items: center;
  justify-content: center;
`

const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const ColorPickerContainer = styled.div`
  z-index: 10000;
  position: absolute;
  top: 100%;
  left: 0;
  display: ${ ({ isColorPickerVisible }: IColorPickerContainer ) => isColorPickerVisible ? 'flex' : 'none' };
  background-color: rgb(255, 255, 255);
`
interface IColorPickerContainer {
  isColorPickerVisible: boolean
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetActionPrioritiesPriorityChooseBackgroundColor
