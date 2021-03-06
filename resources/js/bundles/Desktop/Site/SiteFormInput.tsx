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
  borderColor = 'rgb(150, 150, 150)',
  isInputValueValid,
  label = null,
  marginLeft = '0',
  onChange,
  placeholder,
  type = "text",
  value
}: ISiteFormInput) => {

  // Redux
  const dispatch = useDispatch()
  const activeSheetId = useSelector((state: IAppState) => {
    if(state.tab.activeTab && state.folder.allFiles[state.tab.activeTab]) {
      return state.folder.allFiles[state.tab.activeTab].typeId
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
    <Container
      marginLeft={marginLeft}>
      {label &&
        <Label>{label}:</Label>
      }
      <StyledInput
        type={type}
        borderColor={borderColor}
        isInputValueValid={isActiveInput || isInputValueValid}
        onChange={e => onChange(e.target.value)}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        placeholder={placeholder}
        value={value}/>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface ISiteFormInput {
  borderColor?: string
  isInputValueValid: boolean
  label?: string
  marginLeft?: string
  onChange(nextValue: string): void
  placeholder: string
  type?: string
  value: string
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  margin-left: ${ ({ marginLeft }: IContainer ) => marginLeft };
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`
interface IContainer {
  marginLeft: string
}

const Label = styled.label`
  width: 100%;
`

const StyledInput = styled.input`
  width: 100%;
  margin: 0.375rem;
  padding: 0.5rem 0.25rem;
  border: none;
  border: ${ ({ borderColor, isInputValueValid }: IStyledInput ) => isInputValueValid ? '1px solid ' + borderColor : '1px solid red'};
  border-radius: 4px;
  outline: none;
  font-size: 0.9rem;
  @media (max-width: 480px) {
    width: 100%;
    margin: 0.375rem 0;
  }
`
interface IStyledInput {
  borderColor: string
  isInputValueValid: boolean
}

export default SiteFormInput
