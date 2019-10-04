//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'

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

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetRowContextMenuCreateRows = ({
  sheetId,
  closeOnClick
}: ISheetRowContextMenuCreateRowsProps) => {

  const dispatch = useDispatch()

  const sheetVisibleRows = useSelector((state: IAppState) => state.sheet.allSheets && state.sheet.allSheets[sheetId] && state.sheet.allSheets[sheetId].visibleRows)

  const localStorageKey = 'tracksheet.SheetRowContextMenuCreateRows.inputValue'
  const [ inputValue, setInputValue ] = useState(Number(localStorage.getItem(localStorageKey)) || 1)

  const createRows = () => {
    localStorage.setItem(localStorageKey, inputValue + '')
    closeOnClick(() => {
      dispatch(allowSelectedCellEditing(sheetId))
      dispatch(allowSelectedCellNavigation(sheetId))
      dispatch(createSheetRows(sheetId, inputValue, sheetVisibleRows[0]))
    })
  }
  
  const handleAutosizeInputFocus = () => {
    dispatch(preventSelectedCellEditing(sheetId))
    dispatch(preventSelectedCellNavigation(sheetId))
  }
  const handleAutosizeInputBlur = () => {
    dispatch(allowSelectedCellEditing(sheetId))
    dispatch(allowSelectedCellNavigation(sheetId))
  }

  return (
    <Container>
      <LeftPadding  />
      <TextContainer onClick={() => createRows()}>
        Add
      </TextContainer>
      <AutosizeInput
        value={inputValue === 0 ? '' : inputValue}
        onBlur={() => handleAutosizeInputBlur()}
        onChange={e => setInputValue(Math.min(Number(e.target.value), 10))}
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
      <TextContainer onClick={() => createRows()}>
        row{inputValue > 1 ? 's' : ''} above
      </TextContainer>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface ISheetRowContextMenuCreateRowsProps {
  sheetId: ISheet['id']
  closeOnClick(...args: any): void
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  cursor: default;
  min-width: 8rem;
  width: 100%;
  padding: 0.55rem 0.75rem 0.425rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.05s;
  border-radius: 3px 3px 0 0;
  &:hover {
    background-color: rgb(242, 242, 242);
  }
`

const LeftPadding = styled.div`
margin: 0 0.5rem;
width: 0.75rem;
display: flex;
align-items: center;
justify-content: center;
`

const TextContainer = styled.span``

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetRowContextMenuCreateRows
