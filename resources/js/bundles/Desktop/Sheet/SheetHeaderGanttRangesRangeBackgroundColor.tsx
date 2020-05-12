//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { BACKGROUND_COLOR } from '@/assets/icons'

import { useSheetEditingPermissions } from '@/hooks'

import { IAppState } from '@/state'
import { 
  ISheet,
  ISheetGanttRange 
} from '@/state/sheet/types'

import { createMessengerMessage } from '@/state/messenger/actions'
import { updateSheetGanttRange } from '@/state/sheet/actions'

import ColorPicker from '@/components/ColorPicker'
import Icon from '@/components/Icon'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetHeaderGanttRangesRangeBackgroundColor = ({
  sheetId,
  sheetGanttRangeId
}: ISheetHeaderGanttRangesRangeBackgroundColor) => {

  // Refs
  const container = useRef(null)

  // Redux
  const dispatch = useDispatch()
  const sheetGanttRangeBackgroundColor = useSelector((state: IAppState) => state.sheet.allSheetGanttRanges[sheetGanttRangeId].backgroundColor)
  const userColorPrimary = useSelector((state: IAppState) => state.user.color.primary)

  // State
  const [ isColorPickerVisible, setIsColorPickerVisible ] = useState(false)

  // Permissions
  const {
    userHasPermissionToEditSheet,
    userHasPermissionToEditSheetErrorMessage
  } = useSheetEditingPermissions(sheetId)

  // Add the event listeners to close the color picker dropdown on click outside
  useEffect(() => {
    if(isColorPickerVisible) {
      addEventListener('mousedown', closeColorPickerOnClickOutside)
    }
    else {
      removeEventListener('mousedown', closeColorPickerOnClickOutside)
    }
    return () => removeEventListener('mousedown', closeColorPickerOnClickOutside)
  }, [ isColorPickerVisible ])

  // Close the color picker on click outside
  const closeColorPickerOnClickOutside = (e: MouseEvent) => {
    if(!container.current.contains(e.target)) {
      setIsColorPickerVisible(false)
    }
  }

  // Handle Set Color Picker Visible
  const handleSetColorPickerVisible = () => {
    if(!userHasPermissionToEditSheet) {
      dispatch(createMessengerMessage(userHasPermissionToEditSheetErrorMessage))
    }
    else {
      setIsColorPickerVisible(true)
    }
  }

  // Handle Sheet Gantt Range Background Color Change
  const handleSheetGanttRangeBackgroundColorChange = (nextColor: string) => {
    if(!userHasPermissionToEditSheet) {
      dispatch(createMessengerMessage(userHasPermissionToEditSheetErrorMessage))
    }
    else {
      dispatch(updateSheetGanttRange(sheetGanttRangeId, { backgroundColor: nextColor || userColorPrimary }, { backgroundColor: sheetGanttRangeBackgroundColor }))
    }
  }

  return (
    <Container
      data-testid="SheetHeaderGanttRangesRangeBackgroundColor"
      ref={container}>
      <IconContainer
        onClick={handleSetColorPickerVisible}>
        <Icon
          icon={BACKGROUND_COLOR}/>
      </IconContainer>
      <ColorPickerContainer
        isColorPickerVisible={isColorPickerVisible}>
        <ColorPicker
          activeColor={sheetGanttRangeBackgroundColor}
          onColorChange={(nextColor: string) => handleSheetGanttRangeBackgroundColorChange(nextColor)}/>
      </ColorPickerContainer>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface ISheetHeaderGanttRangesRangeBackgroundColor {
  sheetId: ISheet['id']
  sheetGanttRangeId: ISheetGanttRange['id']
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  position: relative;
  cursor: pointer;
  padding: 0.125rem;
  border-radius: 3px;
  &:hover {
    background-color: rgb(230, 230, 230);
  }
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
export default SheetHeaderGanttRangesRangeBackgroundColor
