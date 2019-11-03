//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'

import { ARROW_DOWN, ARROW_UP } from '@app/assets/icons'

import { IAppState } from '@app/state'
import { ISheet } from '@app/state/sheet/types'
import {  
  allowSelectedCellEditing,
  allowSelectedCellNavigation,
  createSheetRows,
  preventSelectedCellEditing,
  preventSelectedCellNavigation
} from '@app/state/sheet/actions'

import AutosizeInput from 'react-input-autosize'
import Icon from '@/components/Icon'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetCreateRows = ({
  sheetId
}: ISheetCreateRowsProps) => {

  const dispatch = useDispatch()
  
  const [ insertAboveOrBelowSelectedRow, setInsertAboveOrBelowSelectedRow ] = useState('ABOVE')

  const sheetSelections = useSelector((state: IAppState) => state.sheet.allSheets && state.sheet.allSheets[sheetId] && state.sheet.allSheets[sheetId].selections)
  const userColorPrimary = useSelector((state: IAppState) => state.user.color.primary)
  
  const [ isEditingInputValue, setIsEditingInputValue ] = useState(false)
  const [ inputValue, setInputValue ] = useState(1)
  
  useEffect(() => {
    if(isEditingInputValue) { window.addEventListener('keydown', createRowsOnKeydownEnter) }
    else { window.removeEventListener('keydown', createRowsOnKeydownEnter) }
    return () => window.removeEventListener('keydown', createRowsOnKeydownEnter)
  }, [ inputValue, isEditingInputValue ])

  const createRows = (aboveOrBelow: 'ABOVE' | 'BELOW') => {
    setInsertAboveOrBelowSelectedRow(aboveOrBelow)
    dispatch(createSheetRows(
      sheetId, 
      inputValue, 
      sheetSelections.rangeStartRowId, 
      aboveOrBelow === 'ABOVE' ? 'ABOVE' : 'BELOW',
      true
    ))
  }
  
  const handleAutosizeInputFocus = () => {
    setIsEditingInputValue(true)
    dispatch(preventSelectedCellEditing(sheetId))
    dispatch(preventSelectedCellNavigation(sheetId))
  }
  const handleAutosizeInputBlur = () => {
    setIsEditingInputValue(false)
    dispatch(allowSelectedCellEditing(sheetId))
    dispatch(allowSelectedCellNavigation(sheetId))
  }
  
  const createRowsOnKeydownEnter = (e: KeyboardEvent) => { 
    if(e.key === 'Enter') { createRows(insertAboveOrBelowSelectedRow as 'ABOVE' | 'BELOW') } 
  }

  return (
    <Container>
      <AboveOrBelowButton
        isSelected={insertAboveOrBelowSelectedRow === 'ABOVE'}
        isInsertAboveOrBelow="ABOVE"
        onClick={() => createRows('ABOVE')}
        userColorPrimary={userColorPrimary}>
        <Icon
          icon={ARROW_UP}/>
      </AboveOrBelowButton>
      <AddContainer>
        Add
        <AutosizeInput
          value={inputValue === 0 ? '' : inputValue}
          onBlur={() => handleAutosizeInputBlur()}
          onChange={e => setInputValue(Math.min(Number(e.target.value), 25))}
          onFocus={() => handleAutosizeInputFocus()}
          inputStyle={{
            margin: '0 0.25rem',
            padding: '0.125rem 0.125rem 0.125rem 0.25rem',
            height: '100%',
            minWidth: '0.5rem',
            border: '0.5px solid rgb(180, 180, 180)',
            borderRadius: '3px',
            color: 'rgb(110, 110, 110)',
            backgroundColor: 'transparent',
            outline: 'none',
            fontFamily: 'inherit',
            fontSize: 'inherit',
            fontWeight: 'inherit'}}/>
        row{inputValue > 1 ? 's' : ''}
      </AddContainer>
      <AboveOrBelowButton
        isSelected={insertAboveOrBelowSelectedRow === 'BELOW'}
        isInsertAboveOrBelow="BELOW"
        onClick={() => createRows('BELOW')}
        userColorPrimary={userColorPrimary}>
        <Icon
          icon={ARROW_DOWN}/>
      </AboveOrBelowButton>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface ISheetCreateRowsProps {
  sheetId: ISheet['id']
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const AboveOrBelowButton = styled.div`
  margin-right: ${ ({ isInsertAboveOrBelow }: IAboveOrBelowButton ) => isInsertAboveOrBelow === 'ABOVE' ? '0.5rem' : '0' };
  margin-left: ${ ({ isInsertAboveOrBelow }: IAboveOrBelowButton ) => isInsertAboveOrBelow === 'BELOW' ? '0.5rem' : '0' };
  cursor: pointer;  
  display: inline-flex;
  justify-content: center;
  align-items: center;
  background-color: ${ ({ isSelected, userColorPrimary }: IAboveOrBelowButton ) => isSelected ? userColorPrimary : 'rgb(220, 220, 220)' };
  color: ${ ({ isSelected }: IAboveOrBelowButton ) => isSelected ? 'rgb(240, 240, 240)' : 'inherit' };
  border-radius: 3px;
  border: 1px solid rgb(200, 200, 200);
  padding: 0.35rem;
  transition: all 0.05s;
  &:hover {
    background-color: ${ ({ userColorPrimary }: IAboveOrBelowButton ) => userColorPrimary };
    color: rgb(240, 240, 240);
  }
`
interface IAboveOrBelowButton {
  isSelected: boolean
  isInsertAboveOrBelow: 'ABOVE' | 'BELOW'
  userColorPrimary: string
}

const AddContainer = styled.div`
  display: flex;
  align-items: center;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetCreateRows
