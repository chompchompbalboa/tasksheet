//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'

import { PLUS_SIGN } from '@/assets/icons'

import { useSheetEditingPermissions } from '@/hooks'

import { IAppState } from '@/state'
import { ISheet } from '@/state/sheet/types'
import { createMessengerMessage } from '@/state/messenger/actions'
import {  
  allowSelectedCellEditing,
  allowSelectedCellNavigation,
  createSheetRows,
  preventSelectedCellEditing,
  preventSelectedCellNavigation
} from '@/state/sheet/actions'

import Icon from '@/components/Icon'
import Tooltip from '@/components/Tooltip'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionCreateRows = ({
  sheetId
}: ISheetActionCreateRows) => {

  // Refs
  const autosizeInput = useRef(null)
  const tooltipTimer = useRef(null)

  // Redux
  const dispatch = useDispatch()
  const sheetSelections = useSelector((state: IAppState) => state.sheet.allSheets && state.sheet.allSheets[sheetId] && state.sheet.allSheets[sheetId].selections)
  const userColorPrimary = useSelector((state: IAppState) => state.user.color.primary)

  // State
  const [ isEditingInputValue, setIsEditingInputValue ] = useState(false)
  const [ inputValue, setInputValue ] = useState(1)
  const [ isTooltipVisible, setIsTooltipVisible ] = useState(false)
  
  // Permissions
  const { 
    userHasPermissionToEditSheet,
    userHasPermissionToEditSheetErrorMessage
  } = useSheetEditingPermissions(sheetId)
  
  // Effects
  useEffect(() => {
    if(isEditingInputValue) { window.addEventListener('keydown', createRowsOnKeydownEnter) }
    else { window.removeEventListener('keydown', createRowsOnKeydownEnter) }
    return () => window.removeEventListener('keydown', createRowsOnKeydownEnter)
  }, [ inputValue, isEditingInputValue ])

  // Create Rows
  const createRows = (aboveOrBelow: 'ABOVE' | 'BELOW') => {
    if(!userHasPermissionToEditSheet) {
      dispatch(createMessengerMessage(userHasPermissionToEditSheetErrorMessage))
    }
    else {
      setTimeout(() => {
        dispatch(createSheetRows(
          sheetId, 
          inputValue, 
          sheetSelections.rangeStartRowId, 
          aboveOrBelow
        ))
      }, 10)
    }
  }
  
  // Create Rows On Keydown Enter
  const createRowsOnKeydownEnter = (e: KeyboardEvent) => { 
    if(e.key === 'Enter') { 
      autosizeInput.current.blur()
      setIsEditingInputValue(false)
      createRows('BELOW') 
    } 
  }

  // Handle Autosize Input Blur
  const handleAutosizeInputBlur = () => {
    setIsEditingInputValue(false)
    dispatch(allowSelectedCellEditing(sheetId))
    dispatch(allowSelectedCellNavigation(sheetId))
  }

  // Handle Autosize Input Focus
  const handleAutosizeInputFocus = () => {
    setIsEditingInputValue(true)
    dispatch(preventSelectedCellEditing(sheetId))
    dispatch(preventSelectedCellNavigation(sheetId))
  }

  // Handle Mouse Enter
  const handleMouseEnter = () => {
    tooltipTimer.current = setTimeout(() => setIsTooltipVisible(true), 600)
  }

  // Handle Mouse Leave
  const handleMouseLeave = () => {
    clearTimeout(tooltipTimer.current)
    setIsTooltipVisible(false)
  }

  return (
    <Container
      data-testid="SheetActionCreateRows"
      onMouseEnter={() => handleMouseEnter()}
      onMouseLeave={() => handleMouseLeave()}>
      <InputContainer>
        <StyledInput
          data-testid="SheetActionCreateRowsInput"
          ref={autosizeInput}
          value={inputValue === 0 ? '' : inputValue}
          onBlur={() => handleAutosizeInputBlur()}
          onChange={e => !isNaN(Number(e.target.value)) && setInputValue(Math.min(Number(e.target.value), 25))}
          onFocus={() => handleAutosizeInputFocus()}/>
      </InputContainer>
      <InsertButtonContainer>
        <InsertButton
          data-testid="SheetActionCreateRowsButton"
          onClick={() => createRows('BELOW')}
          userColorPrimary={userColorPrimary}>
          <Icon
            icon={PLUS_SIGN}
            size="0.95rem"/>
        </InsertButton>
      </InsertButtonContainer>
      <Tooltip
        isVisible={isTooltipVisible}>
        Insert rows above the selected cell
      </Tooltip>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
export interface ISheetActionCreateRows {
  sheetId: ISheet['id']
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  position: relative;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgb(225, 225, 225);
  border: 1px solid rgb(210, 210, 210);
  border-radius: 4px;
`

const StyledInput = styled.input`
  padding: 0.3rem 0;
  padding-left: 0.1rem;
  width: 1.5rem;
  border: none;
  color: rgb(110, 110, 110);
  outline: none;
  font-family: inherit;
  font-size: 0.9rem;
  font-weight: inherit;
  text-align: center;
  background-color: transparent;
`

const InsertButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
`

const AboveOrBelowButton = styled.div`
  cursor: pointer;  
  display: inline-flex;
  justify-content: center;
  align-items: center;
  color: inherit;
  padding: 0.4rem 0.2rem;
  padding-left: 0.1rem;
  transition: all 0.05s;
  &:hover {
    background-color: ${ ({ userColorPrimary }: IAboveOrBelowButton ) => userColorPrimary };
    color: rgb(240, 240, 240);
  }
`
interface IAboveOrBelowButton {
  userColorPrimary: string
}

const InsertButton = styled(AboveOrBelowButton)`
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
`

const InputContainer = styled.div`
  display: flex;
  align-items: center;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetActionCreateRows
