//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'

import { ARROW_DOWN, ARROW_UP } from '@/assets/icons'

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
  const [ insertAboveOrBelowSelectedRow, setInsertAboveOrBelowSelectedRow ] = useState('ABOVE' as 'ABOVE' | 'BELOW')
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
      setInsertAboveOrBelowSelectedRow(aboveOrBelow)
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
      createRows(insertAboveOrBelowSelectedRow as 'ABOVE' | 'BELOW') 
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
      <AboveOrBelowButtons>
        <AboveButton
          data-testid="SheetActionCreateRowsAboveButton"
          isSelected={insertAboveOrBelowSelectedRow === 'ABOVE'}
          onClick={() => createRows('ABOVE')}
          userColorPrimary={userColorPrimary}>
          <Icon
            icon={ARROW_UP}
            size="0.95rem"/>
        </AboveButton>
        <BelowButton
          data-testid="SheetActionCreateRowsBelowButton"
          isSelected={insertAboveOrBelowSelectedRow === 'BELOW'}
          onClick={() => createRows('BELOW')}
          userColorPrimary={userColorPrimary}>
          <Icon
            icon={ARROW_DOWN}
            size="0.95rem"/>
        </BelowButton>
      </AboveOrBelowButtons>
      <Tooltip
        isVisible={isTooltipVisible}>
        Insert rows above or below the selected cell
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
`

const StyledInput = styled.input`
  padding: 0.4rem 0.5rem;
  width: 2rem;
  border: none;
  border-top: 0.5px solid rgb(175, 175, 175);
  border-bottom: 0.5px solid rgb(175, 175, 175);
  border-left: 0.5px solid rgb(175, 175, 175);
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
  color: rgb(110, 110, 110);
  background-color: transparent;
  outline: none;
  font-family: inherit;
  font-size: 0.9rem;
  font-weight: inherit;
  text-align: center;
`

const AboveOrBelowButtons = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
`

const AboveOrBelowButton = styled.div`
  cursor: pointer;  
  display: inline-flex;
  justify-content: center;
  align-items: center;
  background-color: ${ ({ isSelected, userColorPrimary }: IAboveOrBelowButton ) => isSelected ? userColorPrimary : 'rgb(220, 220, 220)' };
  color: ${ ({ isSelected }: IAboveOrBelowButton ) => isSelected ? 'rgb(240, 240, 240)' : 'inherit' };
  padding: 0.45rem 0.3rem;
  transition: all 0.05s;
  &:hover {
    background-color: ${ ({ userColorPrimary }: IAboveOrBelowButton ) => userColorPrimary };
    color: rgb(240, 240, 240);
  }
`
interface IAboveOrBelowButton {
  isSelected: boolean
  userColorPrimary: string
}

const AboveButton = styled(AboveOrBelowButton)`
  border-top: 1px solid rgb(175, 175, 175);
  border-bottom: 1px solid rgb(175, 175, 175);
`

const BelowButton = styled(AboveOrBelowButton)`
  border-top: 1px solid rgb(175, 175, 175);
  border-bottom: 1px solid rgb(175, 175, 175);
  border-right: 1px solid rgb(175, 175, 175);
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
`

const InputContainer = styled.div`
  display: flex;
  align-items: center;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetActionCreateRows
