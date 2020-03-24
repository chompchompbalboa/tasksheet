//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { KeyboardEvent, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { 
  ISheet
} from '@/state/sheet/types'
import {  
  allowSelectedCellEditing,
  allowSelectedCellNavigation,
  preventSelectedCellEditing,
  preventSelectedCellNavigation
} from '@/state/sheet/actions'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const ContextMenutItemWithInput = ({
  testId,
  sheetId,
  inputValue,
  inputPlaceholder,
  isFirstItem = false,
  isLastItem = false,
  onClick,
  onInputBlur,
  onInputChange,
  onInputFocus,
  onInputKeyPress,
  textAfterInput,
  textBeforeInput,
}: IContextMenutItemWithInputProps) => {

  // Redux
  const dispatch = useDispatch()

  // Effects
  useEffect(() => {
    return () => {
      dispatch(allowSelectedCellEditing(sheetId))
      dispatch(allowSelectedCellNavigation(sheetId))
    }
  }, [])
  
  // Handle Input Blur
  const handleInputBlur = () => {
    dispatch(allowSelectedCellEditing(sheetId))
    dispatch(allowSelectedCellNavigation(sheetId))
    onInputBlur && onInputBlur()
  }
  
  // Handle Input Focus
  const handleInputFocus = () => {
    dispatch(preventSelectedCellEditing(sheetId))
    dispatch(preventSelectedCellNavigation(sheetId))
    onInputFocus && onInputFocus()
  }

  // Handle Input Key Press
  const handleInputKeyPress = (e: KeyboardEvent) => {
    onInputKeyPress && onInputKeyPress(e.key)
  }

  return (
    <Container
      data-testid={testId + "Container"}
      isFirstItem={isFirstItem}
      isLastItem={isLastItem}>
      <LeftPadding  />
      <TextContainer 
        onClick={() => onClick()}>
        {textBeforeInput}
      </TextContainer>
      <StyledInput
        data-testid={testId + "Input"}
        onBlur={handleInputBlur}
        onChange={e => onInputChange(e.target.value)}
        onFocus={handleInputFocus}
        onKeyPress={handleInputKeyPress}
        placeholder={inputPlaceholder}
        value={inputValue}/>
      <TextContainer 
        onClick={() => onClick()}>
        {textAfterInput}
      </TextContainer>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface IContextMenutItemWithInputProps {
  testId: string
  sheetId: ISheet['id']
  inputValue: string
  inputPlaceholder?: string
  isFirstItem?: boolean
  isLastItem?: boolean
  onClick?(): void
  onInputBlur?(): void
  onInputChange(nextInputValue: string): void
  onInputFocus?(): void
  onInputKeyPress?(key: string): void
  textAfterInput?: string
  textBeforeInput?: string
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  cursor: default;
  min-width: 8rem;
  width: 100%;
  padding: ${ ({ isFirstItem, isLastItem }: IContainer ) => isFirstItem ? '0.55rem 0.75rem 0.425rem 0' : (isLastItem ? '0.425rem 0.75rem 0.55rem 0' : '0.425rem 0.75rem 0.425rem 0') };
  display: flex;
  justify-content: flex-start;
  align-items: center;
  transition: background-color 0.05s;
  border-radius: ${ ({ isFirstItem, isLastItem }: IContainer ) => isFirstItem ? '3px 3px 0 0' : (isLastItem ? '0 0 3px 3px' : 'none') };
  &:hover {
    background-color: rgb(242, 242, 242);
  }
`
interface IContainer {
  isFirstItem: boolean
  isLastItem: boolean
}

const StyledInput = styled.input`
  margin: 0 0.35rem;
  padding: 0.125rem 0;
  height: 100%;
  width: 1.5rem;
  border: none;
  border-bottom: 0.5px solid rgb(180, 180, 180);
  color: rgb(110, 110, 110);
  background-color: transparent;
  outline: none;
  font-family: inherit;
  font-size: inherit;
  font-weight: inherit;
  text-align: center;
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
export default ContextMenutItemWithInput
