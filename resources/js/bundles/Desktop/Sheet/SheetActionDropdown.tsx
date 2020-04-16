//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { ChangeEvent, FocusEvent, useEffect, useRef, useState } from 'react'
import { batch, useDispatch } from 'react-redux'
import styled from 'styled-components'

import { useSheetEditingPermissions } from '@/hooks'

import { ISheet } from '@/state/sheet/types'

import { createMessengerMessage } from '@/state/messenger/actions'
import { 
  allowSelectedCellEditing,
  preventSelectedCellEditing,
  allowSelectedCellNavigation,
  preventSelectedCellNavigation,
} from '@/state/sheet/actions'

import AutosizeInput from 'react-input-autosize'
import SheetActionDropdownSelectedOption from '@desktop/Sheet/SheetActionDropdownSelectedOption'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionDropdown = ({
  sheetId,
  isLast = false,
  onInputChange,
  onOptionSelect,
  onOptionDelete,
  onOptionUpdate,
  options,
  placeholder,
  selectedOptions,
  selectedOptionComponent,
  value = ""
}: SheetActionDropdownProps) => {

  // Refs
  const container = useRef(null)
  const dropdown = useRef(null)
  
  // Redux
  const dispatch = useDispatch()

  // Get visible options
  const getVisibleOptions = (value: string) => {
    return options && options.filter(option => {
      const searchString = value.toLowerCase().replace(/ /g, "")
      return (option.label || "").toLowerCase().replace(/ /g, "").includes(searchString)
    })
  }
  
  // State
  const [ autosizeInputValue, setAutosizeInputValue ] = useState(value)
  const [ isDropdownVisible, setIsDropdownVisible ] = useState(false)
  const [ visibleOptions, setVisibleOptions ] = useState(getVisibleOptions(value))
  const [ highlightedOptionIndex, setHighlightedOptionIndex ] = useState(null)
  const [ visibleSelectedOptions, setVisibleSelectedOptions ] = useState(selectedOptions || [])

  // Permissions
  const {
    userHasPermissionToEditSheet,
    userHasPermissionToEditSheetErrorMessage
  } = useSheetEditingPermissions(sheetId)

  // Add event listeners when the dropdown is visible
  useEffect(() => {
    if(isDropdownVisible) {
      !visibleOptions && setVisibleOptions(options)
      window.addEventListener('mousedown', closeDropdownOnClickOutside)
      window.addEventListener('keydown', handleKeydownWhileDropdownIsVisible)
    } 
    else {
      window.removeEventListener('mousedown', closeDropdownOnClickOutside)
      window.removeEventListener('keydown', handleKeydownWhileDropdownIsVisible)
    }
    return () => {
      window.removeEventListener('mousedown', closeDropdownOnClickOutside)
      window.removeEventListener('keydown', handleKeydownWhileDropdownIsVisible)
    }
  }, [ highlightedOptionIndex, isDropdownVisible, visibleOptions ])

  // Update the visible options when the options are updateed
  useEffect(() => {
    setVisibleOptions(getVisibleOptions(value))
    value === '' && setIsDropdownVisible(false)
  }, [ options ])

  // Update the visible selected options when the selected options are updated
  useEffect(() => {
    setVisibleSelectedOptions(selectedOptions)
    setAutosizeInputValue("")
  }, [ selectedOptions ])

  // Update the input value as needed
  useEffect(() => {
    setAutosizeInputValue(value)
    setVisibleOptions(getVisibleOptions(value))
  }, [ value ])

  // Close Dropdown On Click Outside
  const closeDropdownOnClickOutside = (e: Event) => {
    if(!dropdown.current.contains(e.target) && !container.current.contains(e.target)) {
      setIsDropdownVisible(false)
      setHighlightedOptionIndex(null)
    }
  }

  // Handle Autosize Input Blur
  const handleAutosizeInputBlur = (e: FocusEvent<HTMLInputElement>) => {
    setTimeout(() => batch(() => {
      dispatch(allowSelectedCellEditing(sheetId))
      dispatch(allowSelectedCellNavigation(sheetId))
    }), 10)
  }

  // Handle Autosize Input Change
  const handleAutosizeInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const nextAutosizeInputValue = e.target.value
    const nextVisibleOptions = getVisibleOptions(nextAutosizeInputValue)
    onInputChange && onInputChange(nextAutosizeInputValue)
    setIsDropdownVisible(true)
    setAutosizeInputValue(nextAutosizeInputValue)
    setVisibleOptions(nextVisibleOptions)
    nextVisibleOptions && nextVisibleOptions.length === 1 && setHighlightedOptionIndex(0)
  }

  // Handle Autosize Input Focus
  const handleAutosizeInputFocus = (e: FocusEvent<HTMLInputElement>) => {
    e.preventDefault()
    setIsDropdownVisible(true)
    setTimeout(() => batch(() => {
      dispatch(preventSelectedCellEditing(sheetId))
      dispatch(preventSelectedCellNavigation(sheetId))
    }), 10)
  }
  
  // Handle Option Delete
  const handleOptionDelete = (option: SheetActionDropdownOption) => {
    if(!userHasPermissionToEditSheet) {
      dispatch(createMessengerMessage(userHasPermissionToEditSheetErrorMessage))
    }
    else {
      const nextVisibleSelectedOptions = visibleSelectedOptions.filter(visibleSelectedOption => visibleSelectedOption.value !== option.value)
      setVisibleSelectedOptions(nextVisibleSelectedOptions)
      setTimeout(() => onOptionDelete(option), 50)
    }
  }
  
  // Handle Option Select
  const handleOptionSelect = (option: SheetActionDropdownOption) => {
    setIsDropdownVisible(false)
    if(!userHasPermissionToEditSheet) {
      dispatch(createMessengerMessage(userHasPermissionToEditSheetErrorMessage))
    }
    else {
      setHighlightedOptionIndex(null)
      setVisibleSelectedOptions([...visibleSelectedOptions, { ...option, isLocked: false }])
      setAutosizeInputValue("")
      setVisibleOptions(options)
      setTimeout(() => onOptionSelect(option), 50)
    }
  }

  // Handle Keydown While Dropdown Is Visible
  const handleKeydownWhileDropdownIsVisible = (e: KeyboardEvent) => {
    if(e.key === "Enter") {
      if(visibleOptions && visibleOptions[highlightedOptionIndex || 0]) {
        handleOptionSelect(visibleOptions[highlightedOptionIndex || 0])
      }
    }
    if(e.key === "ArrowUp") {
      setHighlightedOptionIndex(highlightedOptionIndex === null ? null : Math.max(highlightedOptionIndex - 1, 0))
    }
    if(e.key === "ArrowDown") {
      setHighlightedOptionIndex(highlightedOptionIndex === null ? 0 : Math.min(highlightedOptionIndex + 1, visibleOptions.length - 1))
    }
  }
  
  const SelectedOption = selectedOptionComponent

  return (
    <Container
      ref={container}
      isDropdownVisible={isDropdownVisible}
      isLast={isLast}>
      <Wrapper>
        <SelectedOptions>
          {visibleSelectedOptions && visibleSelectedOptions.map(option => (
            <SheetActionDropdownSelectedOption
              key={option.value}
              isLocked={option.isLocked}
              onOptionDelete={() => handleOptionDelete(option)}
              onOptionUpdate={updates => onOptionUpdate(option.value, updates)}>
              <SelectedOption option={option}/>
            </SheetActionDropdownSelectedOption>
          ))}
        </SelectedOptions>
        <InputContainer>
          <AutosizeInput
            placeholder={placeholder}
            value={autosizeInputValue}
            onBlur={handleAutosizeInputBlur}
            onChange={handleAutosizeInputChange}
            onFocus={handleAutosizeInputFocus}
            inputStyle={{
              marginRight: '0.25rem',
              padding: '0.125rem 0',
              height: '100%',
              minWidth: '4.25rem',
              border: 'none',
              backgroundColor: 'transparent',
              outline: 'none',
              fontFamily: 'inherit',
              fontSize: 'inherit',
              fontWeight: 'inherit'}}/>
            <Dropdown
              ref={dropdown}
              isDropdownVisible={isDropdownVisible}>
              {visibleOptions && visibleOptions.map((option, index) => (
                <DropdownOption
                  key={option.value}
                  isHighlighted={highlightedOptionIndex === index}
                  onMouseEnter={() => setHighlightedOptionIndex(index)}
                  onClick={() => handleOptionSelect(option)}>
                  {option.label}
                </DropdownOption>
              ))}
            </Dropdown>
        </InputContainer>
      </Wrapper>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetActionDropdownProps {
  sheetId: ISheet['id']
  isLast?: boolean
  onInputChange?(nextValue: string): void
  onOptionDelete(optionToDelete: SheetActionDropdownOption): void
  onOptionSelect(selectedOption: SheetActionDropdownOption): void
  onOptionUpdate(optionId: string, updates: any): void
  options: SheetActionDropdownOptions
  placeholder: string
  selectedOptions: SheetActionDropdownSelectedOptions
  selectedOptionComponent: any
  value?: string
}

export interface SheetActionDropdownOption {
  label: string
  value: string
}
export type SheetActionDropdownOptions = SheetActionDropdownOption[]

export interface SheetActionDropdownSelectedOption {
  label: string
  value: string
  isLocked: boolean
}
export type SheetActionDropdownSelectedOptions = SheetActionDropdownSelectedOption[]

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  z-index: ${ ({ isDropdownVisible }: ContainerProps ) => isDropdownVisible ? '100' : '50'};
  position: relative;
  width: 100%;
  height: 100%;
  margin-right: ${ ({ isLast }: ContainerProps ) => isLast ? '0' : '0.25rem'};
`
interface ContainerProps {
  isDropdownVisible: boolean
  isLast: boolean
}

const Wrapper = styled.div`
  padding:  0.25rem;
  border: 0.5px solid rgb(180, 180, 180);
  display: flex;
  align-items: center;
  border-radius: 4px;
`

const SelectedOptions = styled.div`
  display: flex;
`

const InputContainer = styled.div`
  position: relative;
`

const Dropdown = styled.div`
  display: ${ ({ isDropdownVisible }: DropdownProps ) => isDropdownVisible ? 'block' : 'none'};
  position: absolute;
  left: -0.25rem;
  top: calc(100% + 0.25rem);
  min-width: 7.5rem;
  border-radius: 5px;
  background-color: rgb(250, 250, 250);
  box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.5);
`
interface DropdownProps {
  isDropdownVisible: boolean
}

const DropdownOption = styled.div`
  cursor: default;
  width: 100%;
  padding: 0.15rem 0.25rem;
  background-color: ${ ({ isHighlighted }: DropdownOptionProps ) => isHighlighted ? 'rgb(240, 240, 240)' : 'transparent'};
`
interface DropdownOptionProps {
  isHighlighted: boolean
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetActionDropdown
