//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useState } from 'react'
import { batch } from 'react-redux'
import styled from 'styled-components'

import { PLUS_SIGN } from '@app/assets/icons'

import { Sheet } from '@app/state/sheet/types'

import AutosizeInput from 'react-input-autosize'
import Icon from '@/components/Icon'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetCreateRows = ({
  createSheetRow,
  sheetId,
  sourceSheetId
}: SheetCreateRowsProps) => {

  const [ inputValue, setInputValue ] = useState(1)

  const handleAddRowButtonClick = () => {
    batch(() => {
      for(let i = 1; i <= inputValue; i++) {
        createSheetRow(sheetId, sourceSheetId)
      }
    })
  }

  return (
    <Container>
      Add
      <AutosizeInput
        value={inputValue === 0 ? '' : inputValue}
        onChange={e => setInputValue(Math.min(Number(e.target.value), 25))}
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
      <AddRowButton
        onClick={() => handleAddRowButtonClick()}>
        <Icon
          icon={PLUS_SIGN}/>
      </AddRowButton>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetCreateRowsProps {
  createSheetRow(sheetId: Sheet['id'], sourceSheetId: Sheet['id']): void
  sheetId: Sheet['id']
  sourceSheetId: Sheet['id']
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  height: 100%;
  color: rgb(110, 110, 110);
  display: flex;
  align-items: center;
`

const AddRowButton = styled.div`
  margin-left: 0.375rem;
  cursor: pointer;  
  display: inline-flex;
  justify-content: center;
  align-items: center;
  background-color: rgb(210, 210, 210);
  color: rgb(80, 80, 80);
  border-radius: 3px;
  padding: 0.25rem;
  transition: all 0.05s;
  &:hover {
    background-color: rgb(0, 120, 0);
    color: rgb(240, 240, 240);
  }
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetCreateRows
