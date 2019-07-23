//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { ChangeEvent, FocusEvent, useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import AutosizeInput from 'react-input-autosize'

import { AppState } from '@app/state'
import { selectUserColorPrimary } from '@app/state/user/selectors'

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
  options,
  placeholder = '...',
  selectedOptions,
  userColorPrimary
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

  const handleAutosizeInputBlur = (e: FocusEvent<HTMLInputElement>) => {
    setAutosizeInputValue("")
    setVisibleOptions(options)
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
  
  const handleSheetActionClick = (option: SheetActionDropdownOption) => {
    setIsDropdownVisible(false)
    setVisibleSelectedOptions([...visibleSelectedOptions, option])
    setTimeout(() => onOptionSelect(option), 1)
  }
  
  return (
    <Container
      ref={container}>
      <Wrapper>
        <SelectedOptions>
          {visibleSelectedOptions && visibleSelectedOptions.map(option => (
            <SelectedOption
              key={option.value}
              optionBackgroundColor={userColorPrimary}>{option.label}</SelectedOption>
          ))}
        </SelectedOptions>
        <AutosizeInput
          placeholder={placeholder}
          value={autosizeInputValue}
          onBlur={handleAutosizeInputBlur}
          onChange={handleAutosizeInputChange}
          onFocus={handleAutosizeInputFocus}
          inputStyle={{
            marginRight: '0.25rem',
            height: '100%',
            border: 'none',
            backgroundColor: 'transparent',
            outline: 'none',
            fontFamily: 'inherit',
            fontSize: 'inherit',
            fontWeight: 'inherit',
          }}/>
      </Wrapper>
      <Dropdown
        ref={dropdown}
        isDropdownVisible={isDropdownVisible}>
        {visibleOptions && visibleOptions.map(option => (
          <DropdownOption
            key={option.value}
            onClick={() => handleSheetActionClick(option)}>
            {option.label}
          </DropdownOption>
        ))}
      </Dropdown>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetActionDropdownProps {
  onOptionSelect(selectedOption: SheetActionDropdownOption): void
  options: SheetActionDropdownOptions
  placeholder: string
  selectedOptions: SheetActionDropdownOptions
  userColorPrimary: string
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
  width: 100%;
  height: 100%;
`

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

const SelectedOption = styled.div`
  padding: 0.125rem 0.25rem;
  margin-right: 0.25rem;
  background-color: ${ ({ optionBackgroundColor }: SelectedOptionProps ) => optionBackgroundColor};
  color: white;
  border-radius: 10px;
  font-size: 0.75rem;
`
interface SelectedOptionProps {
  optionBackgroundColor: string
}

const Dropdown = styled.div`
  display: ${ ({ isDropdownVisible }: DropdownProps ) => isDropdownVisible ? 'block' : 'none'};
  position: absolute;
  top: 95%;
  left: 0.25rem;
  min-width: 7.5rem;
  background-color: white;
  border-radius: 5px;
  background-color: rgb(250, 250, 250);
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
