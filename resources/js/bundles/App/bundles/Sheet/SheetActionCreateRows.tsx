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
  
  const localStorageKey = 'tracksheet.SheetActionCreateRows.insertAtTopOrBottomOfSheet'
  
  const [ insertAtTopOrBottomOfSheet, setInsertAtTopOrBottomOfSheet ] = useState(localStorage.getItem(localStorageKey) || 'TOP')

  const sheetVisibleRows = useSelector((state: IAppState) => state.sheet.allSheets && state.sheet.allSheets[sheetId] && state.sheet.allSheets[sheetId].visibleRows)
  const userColorPrimary = useSelector((state: IAppState) => state.user.color.primary)
  
  const [ isEditingInputValue, setIsEditingInputValue ] = useState(false)
  const [ inputValue, setInputValue ] = useState(1)
  
  useEffect(() => {
    if(isEditingInputValue) { window.addEventListener('keydown', createRowsOnKeydownEnter) }
    else { window.removeEventListener('keydown', createRowsOnKeydownEnter) }
    return () => window.removeEventListener('keydown', createRowsOnKeydownEnter)
  }, [ inputValue, isEditingInputValue ])

  const createRows = (topOrBottom: 'TOP' | 'BOTTOM') => {
    localStorage.setItem(localStorageKey, topOrBottom)
    setInsertAtTopOrBottomOfSheet(topOrBottom)
    const createSheetRowIndex = topOrBottom === 'TOP' 
      ? sheetVisibleRows[0] 
      : sheetVisibleRows[sheetVisibleRows.length - 1] !== 'ROW_BREAK' ? sheetVisibleRows[sheetVisibleRows.length - 1] : sheetVisibleRows[sheetVisibleRows.length - 2]
    dispatch(createSheetRows(sheetId, inputValue, createSheetRowIndex, topOrBottom === 'TOP' ? 'ABOVE' : 'BELOW'))
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
    if(e.key === 'Enter') { createRows(insertAtTopOrBottomOfSheet as 'TOP' | 'BOTTOM') } 
  }

  return (
    <Container>
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
      <TopOrBottomButton
        isSelected={insertAtTopOrBottomOfSheet === 'TOP'}
        onClick={() => createRows('TOP')}
        userColorPrimary={userColorPrimary}>
        <Icon
          icon={ARROW_UP}/>
      </TopOrBottomButton>
      <TopOrBottomButton
        isSelected={insertAtTopOrBottomOfSheet === 'BOTTOM'}
        onClick={() => createRows('BOTTOM')}
        userColorPrimary={userColorPrimary}>
        <Icon
          icon={ARROW_DOWN}/>
      </TopOrBottomButton>
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
  align-items: center;
`

const TopOrBottomButton = styled.div`
  margin-left: 0.375rem;
  cursor: pointer;  
  display: inline-flex;
  justify-content: center;
  align-items: center;
  background-color: ${ ({ isSelected, userColorPrimary }: ITopOrBottomButton ) => isSelected ? userColorPrimary : 'rgb(210, 210, 210)' };
  color: ${ ({ isSelected }: ITopOrBottomButton ) => isSelected ? 'rgb(240, 240, 240)' : 'inherit' };
  border-radius: 3px;
  padding: 0.25rem;
  transition: all 0.05s;
  &:hover {
    background-color: ${ ({ userColorPrimary }: ITopOrBottomButton ) => userColorPrimary };
    color: rgb(240, 240, 240);
  }
`
interface ITopOrBottomButton {
  isSelected: boolean
  userColorPrimary: string
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetCreateRows
