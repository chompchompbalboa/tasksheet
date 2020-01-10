//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { IAppState } from '@/state'
import {
  allowSelectedCellEditing,
  allowSelectedCellNavigation,
  preventSelectedCellEditing,
  preventSelectedCellNavigation
} from '@/state/sheet/actions'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SiteFormInput = ({
  isInputValueValid,
  onChange,
  placeholder,
  type = "text",
  value
}: ISiteFormInput) => {

  // Redux
  const dispatch = useDispatch()
  const activeSheetId = useSelector((state: IAppState) => {
    if(state.tab.activeTab && state.folder.files[state.tab.activeTab]) {
      return state.folder.files[state.tab.activeTab].typeId
    }
    return null
  })

  // State
  const [ isActiveInput, setIsActiveInput ] = useState(false)

  // Handle Input Blur
  const handleInputBlur = () => {
    setIsActiveInput(false)
    dispatch(allowSelectedCellEditing(activeSheetId))
    dispatch(allowSelectedCellNavigation(activeSheetId))
  }

  // Handle Input Focus
  const handleInputFocus = () => {
    setIsActiveInput(true)
    dispatch(preventSelectedCellEditing(activeSheetId))
    dispatch(preventSelectedCellNavigation(activeSheetId))
  }

  return (
    <StyledInput
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
      onFocus={handleInputFocus}
      onBlur={handleInputBlur}
      isInputValueValid={isActiveInput || isInputValueValid}/>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface ISiteFormInput {
  isInputValueValid: boolean
  onChange(nextValue: string): void
  placeholder: string
  type?: string
  value: string
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const StyledInput = styled.input`
  margin: 0 0.375rem;
  padding: 0.5rem 0.25rem;
  border: none;
  border: ${ ({ isInputValueValid }: StyledInputProps ) => isInputValueValid ? '2px solid transparent' : '2px solid red'};
  border-radius: 4px;
  outline: none;
  font-size: 0.9rem;
  @media (max-width: 480px) {
    width: 100%;
    margin: 0.375rem 0;
  }
`
interface StyledInputProps {
  isInputValueValid: boolean
}

export default SiteFormInput
