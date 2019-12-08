//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { 
  ISheet
} from '@app/state/sheet/types'
import {  
  allowSelectedCellEditing,
  allowSelectedCellNavigation,
  preventSelectedCellEditing,
  preventSelectedCellNavigation
} from '@app/state/sheet/actions'

import AutosizeInput from 'react-input-autosize'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const ContextMenuItemInput = ({
  sheetId,
  inputValue,
  placeholder,
  setInputValue,
  text = 'Input'
}: IContextMenuItemInputProps) => {

  useEffect(() => {
    return () => {
      dispatch(allowSelectedCellEditing(sheetId))
      dispatch(allowSelectedCellNavigation(sheetId))
    }
  }, [])

  const dispatch = useDispatch()
  
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
      <TextContainer>
        {text}
      </TextContainer>
      <AutosizeInput
        value={inputValue}
        onBlur={() => handleAutosizeInputBlur()}
        onChange={e => setInputValue(e.target.value)}
        onFocus={() => handleAutosizeInputFocus()}
        placeholder={placeholder}
        inputStyle={{
          margin: '0 0.25rem',
          padding: '0.125rem 0.25rem',
          height: '100%',
          minWidth: '0.5rem',
          border: '0.5px solid rgb(180, 180, 180)',
          borderRadius: '3px',
          backgroundColor: 'transparent',
          outline: 'none',
          fontFamily: 'inherit',
          fontSize: 'inherit',
          fontWeight: 'inherit'}}/>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface IContextMenuItemInputProps {
  sheetId: ISheet['id']
  inputValue: string
  placeholder: string
  setInputValue(nextInputValue: string): void
  text: string
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
  justify-content: flex-start;
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

const TextContainer = styled.span`
  margin-right: 0.25rem;
  white-space: nowrap;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default ContextMenuItemInput
