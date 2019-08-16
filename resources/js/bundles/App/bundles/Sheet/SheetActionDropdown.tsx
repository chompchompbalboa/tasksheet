//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { ChangeEvent, FocusEvent, useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { AppState } from '@app/state'
import { selectUserColorPrimary } from '@app/state/user/selectors'

import AutosizeInput from 'react-input-autosize'
import SheetActionDropdownSelectedOption from '@app/bundles/Sheet/SheetActionDropdownSelectedOption'

//-----------------------------------------------------------------------------
// Redux
//-----------------------------------------------------------------------------
const mapStateToProps = (state: AppState) => ({
  userColorPrimary: selectUserColorPrimary(state)
})

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionDropdown = ({
  onInputChange,
  onOptionSelect,
  onOptionDelete,
  options,
  placeholder,
  selectedOptions,
  userColorPrimary,
  selectedOptionComponent,
  value = ""
}: SheetActionDropdownProps) => {

  const container = useRef(null)
  const dropdown = useRef(null)

  const getVisibleOptions = (value: string) => {
    return options && options.filter(option => {
      const searchString = value.toLowerCase().replace(/ /g, "")
      return option.label.toLowerCase().replace(/ /g, "").includes(searchString)
    })
  }
  
  const [ autosizeInputValue, setAutosizeInputValue ] = useState(value)
  const [ isDropdownVisible, setIsDropdownVisible ] = useState(false)
  const [ visibleOptions, setVisibleOptions ] = useState(getVisibleOptions(value))
  const [ highlightedOptionIndex, setHighlightedOptionIndex ] = useState(null)
  const [ visibleSelectedOptions, setVisibleSelectedOptions ] = useState(selectedOptions || [])

  useEffect(() => {
    if(isDropdownVisible) {
      !visibleOptions && setVisibleOptions(options)
      window.addEventListener('mousedown', closeContextMenuOnClickOutside)
      window.addEventListener('keydown', handleKeydownWhileDropdownIsVisible)
    } 
    else {
      window.removeEventListener('mousedown', closeContextMenuOnClickOutside)
      window.removeEventListener('keydown', handleKeydownWhileDropdownIsVisible)
    }
    return () => {
      window.removeEventListener('mousedown', closeContextMenuOnClickOutside)
      window.removeEventListener('keydown', handleKeydownWhileDropdownIsVisible)
    }
  }, [ highlightedOptionIndex, isDropdownVisible, visibleOptions ])

  useEffect(() => {
    setVisibleOptions(getVisibleOptions(value))
    value === '' && setIsDropdownVisible(false)
  }, [ options ])

  useEffect(() => {
    setVisibleSelectedOptions(selectedOptions)
    setAutosizeInputValue("")
  }, [ selectedOptions ])

  useEffect(() => {
    setAutosizeInputValue(value)
    setVisibleOptions(getVisibleOptions(value))
  }, [ value ])

  const closeContextMenuOnClickOutside = (e: Event) => {
    if(!dropdown.current.contains(e.target) && !container.current.contains(e.target)) {
      setIsDropdownVisible(false)
      setHighlightedOptionIndex(null)
    }
  }

  const handleAutosizeInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const nextAutosizeInputValue = e.target.value
    const nextVisibleOptions = getVisibleOptions(nextAutosizeInputValue)
    onInputChange && onInputChange(nextAutosizeInputValue)
    setIsDropdownVisible(true)
    setAutosizeInputValue(nextAutosizeInputValue)
    setVisibleOptions(nextVisibleOptions)
    nextVisibleOptions && nextVisibleOptions.length === 1 && setHighlightedOptionIndex(0)
  }

  const handleAutosizeInputFocus = (e: FocusEvent<HTMLInputElement>) => {
    e.preventDefault()
    setIsDropdownVisible(true)
  }
  
  const handleOptionDelete = (option: SheetActionDropdownOption) => {
    const nextVisibleSelectedOptions = visibleSelectedOptions.filter(visibleSelectedOption => visibleSelectedOption.value !== option.value)
    setVisibleSelectedOptions(nextVisibleSelectedOptions)
    setTimeout(() => onOptionDelete(option), 50)
  }
  
  const handleOptionSelect = (option: SheetActionDropdownOption) => {
    setIsDropdownVisible(false)
    setHighlightedOptionIndex(null)
    setVisibleSelectedOptions([...visibleSelectedOptions, option])
    setAutosizeInputValue("")
    setVisibleOptions(options)
    setTimeout(() => onOptionSelect(option), 50)
  }

  const handleKeydownWhileDropdownIsVisible = (e: KeyboardEvent) => {
    if(e.key === "Enter") {
      if(visibleOptions) {
        handleOptionSelect(visibleOptions[highlightedOptionIndex || 0])
      }
    }
    if(e.key === "ArrowUp") {
      setHighlightedOptionIndex(highlightedOptionIndex === null ? null : Math.max(highlightedOptionIndex - 1, 0))
    }
    if(e.key === "ArrowDown") {
      setHighlightedOptionIndex(highlightedOptionIndex === null ? 0 : Math.min(highlightedOptionIndex + 1, visibleOptions.length - 1))
    }
    if(e.key === ";") {
      setIsDropdownVisible(false)
      setHighlightedOptionIndex(null)
    }
  }
  
  const SelectedOption = selectedOptionComponent
  console.log(isDropdownVisible)
  return (
    <Container
      ref={container}
      isDropdownVisible={isDropdownVisible}>
      <Wrapper>
        <SelectedOptions>
          {visibleSelectedOptions && visibleSelectedOptions.map(option => (
            <SheetActionDropdownSelectedOption
              key={option.value}
              onOptionDelete={() => handleOptionDelete(option)}
              optionBackgroundColor={userColorPrimary}>
              <SelectedOption option={option}/>
            </SheetActionDropdownSelectedOption>
          ))}
        </SelectedOptions>
        <InputContainer>
          <AutosizeInput
            placeholder={placeholder}
            value={autosizeInputValue}
            onChange={handleAutosizeInputChange}
            onFocus={handleAutosizeInputFocus}
            inputStyle={{
              marginRight: '0.25rem',
              padding: '0.125rem 0',
              height: '100%',
              minWidth: '4rem',
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
  onInputChange?(nextValue: string): void
  onOptionDelete(optionToDelete: SheetActionDropdownOption): void
  onOptionSelect(selectedOption: SheetActionDropdownOption): void
  options: SheetActionDropdownOptions
  placeholder: string
  selectedOptions: SheetActionDropdownOptions
  userColorPrimary: string
  selectedOptionComponent: any
  value?: string
}

export interface SheetActionDropdownOption {
  label: string
  value: string
}

export type SheetActionDropdownOptions = SheetActionDropdownOption[]

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  z-index: ${ ({ isDropdownVisible }: ContainerProps ) => isDropdownVisible ? '100' : '50'};
  position: relative;
  width: 100%;
  height: 100%;
  margin-right: 0.25rem;
`
interface ContainerProps {
  isDropdownVisible: boolean
}

const Wrapper = styled.div`
  padding: 0.25rem;
  border: 0.5px solid rgb(180, 180, 180);
  display: flex;
  align-items: center;
  border-radius: 5px;
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
  background-color: white;
  border-radius: 5px;
  background-color: rgb(253, 253, 253);
  box-shadow: 3px 3px 10px 0px rgba(150,150,150,1);
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
export default connect(
  mapStateToProps
)(SheetActionDropdown)
