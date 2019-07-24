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
  onOptionSelect,
  onOptionDelete,
  options,
  placeholder = '...',
  selectedOptions,
  userColorPrimary,
  selectedOptionComponent
}: SheetActionDropdownProps) => {

  const [ autosizeInputValue, setAutosizeInputValue ] = useState("")
  const [ isDropdownVisible, setIsDropdownVisible ] = useState(false)
  const [ visibleOptions, setVisibleOptions ] = useState(options)
  const [ visibleSelectedOptions, setVisibleSelectedOptions ] = useState(selectedOptions || [])

  const container = useRef(null)
  const dropdown = useRef(null)

  useEffect(() => {
    if(isDropdownVisible) {
      if (!visibleOptions) { setVisibleOptions(options) }
      window.addEventListener('mousedown', closeContextMenuOnClickOutside)
    }
    else {
      window.removeEventListener('mousedown', closeContextMenuOnClickOutside)
    }
    return () => {
      window.removeEventListener('mousedown', closeContextMenuOnClickOutside)
    }
  }, [ isDropdownVisible ])

  const closeContextMenuOnClickOutside = (e: Event) => {
    if(!dropdown.current.contains(e.target) && !container.current.contains(e.target)) {
      setIsDropdownVisible(false)
    }
  }

  const handleAutosizeInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAutosizeInputValue(e.target.value)
    setVisibleOptions(options && options.filter(option => {
      const searchString = e.target.value.toLowerCase().replace(/ /g, "")
      return option.label.toLowerCase().replace(/ /g, "").includes(searchString)
    }))
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
    setVisibleSelectedOptions([...visibleSelectedOptions, option])
    setAutosizeInputValue("")
    setVisibleOptions(options)
    setTimeout(() => onOptionSelect(option), 50)
  }
  
  const SelectedOption = selectedOptionComponent
  
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
              border: 'none',
              backgroundColor: 'transparent',
              outline: 'none',
              fontFamily: 'inherit',
              fontSize: 'inherit',
              fontWeight: 'inherit',
            }}/>
            <Dropdown
              ref={dropdown}
              isDropdownVisible={isDropdownVisible}>
              {visibleOptions && visibleOptions.map(option => (
                <DropdownOption
                  key={option.value}
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
  onOptionDelete(optionToDelete: SheetActionDropdownOption): void
  onOptionSelect(selectedOption: SheetActionDropdownOption): void
  options: SheetActionDropdownOptions
  placeholder: string
  selectedOptions: SheetActionDropdownOptions
  userColorPrimary: string
  selectedOptionComponent: any
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
  height: 100%;
  padding: 0.25rem;
  border: 0.5px solid rgb(180, 180, 180);
  display: flex;
  align-items: center;
  border-radius: 5px;
`

const SelectedOptions = styled.div`
  height: 100%;
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
  padding: 0.125rem;
  &:hover {
    background-color: rgb(240, 240, 240);
  }
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default connect(
  mapStateToProps
)(SheetActionDropdown)
