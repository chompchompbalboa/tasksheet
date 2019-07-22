//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import ContentEditable from 'react-sane-contenteditable'

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
  options,
  placeholder = '...',
  selectedOptions,
  userColorPrimary
}: SheetActionDropdownProps) => {

  const [ contentEditableValue, setContentEditableValue ] = useState(placeholder)
  const [ isDropdownVisible, setIsDropdownVisible ] = useState(false)
  //const [ visibleOptions, setVisibleOptions ] = useState(options)

  const contentEditable = useRef(null)
  const dropdown = useRef(null)

  useEffect(() => {
    window.addEventListener('mousedown', closeContextMenuOnClickOutside)
    return () => {
      window.removeEventListener('mousedown', closeContextMenuOnClickOutside)
    }
  }, [])

  const closeContextMenuOnClickOutside = (e: Event) => {
    if(dropdown !== null && dropdown.current !== null && !dropdown.current.contains(e.target)) {
      setIsDropdownVisible(false)
    }
  }

  const handleContentEditableChange = (e: Event, value: string) => {
    setContentEditableValue(value)
  }

  const handleContentEditableClick = () => {
    const range = document.createRange();
    range.selectNodeContents(contentEditable.current._element);
    let selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }

  return (
    <Container>
      <Wrapper
        onClick={() => setIsDropdownVisible(true)}>
        <SelectedOptions>
          {selectedOptions && selectedOptions.map(option => (
            <SelectedOption
              optionBackgroundColor={userColorPrimary}>Name</SelectedOption>
          ))}
        </SelectedOptions>
        <StyledContentEditable
          ref={contentEditable}
          content={contentEditableValue}
          onChange={handleContentEditableChange}
          onClick={handleContentEditableClick}/>
      </Wrapper>
      {isDropdownVisible &&
        <Dropdown
          ref={dropdown}>
          {options && options.map(option => (
            <DropdownOption
              key={option.value}>
              {option.label}
            </DropdownOption>
          ))}
        </Dropdown>
      }
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetActionDropdownProps {
  options: SheetActionDropdownOptions
  placeholder: string
  selectedOptions: SheetActionDropdownOptions
  userColorPrimary: string
}

interface SheetActionDropdownOption {
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
`

const SelectedOption = styled.div`
  padding: 0.125rem 0.25rem;
  margin-right: 0.25rem;
  background-color: ${ ({ optionBackgroundColor }: SelectedOptionProps ) => optionBackgroundColor};
  color: white;
  border-radius: 50%;
  font-size: 0.75rem;
`
interface SelectedOptionProps {
  optionBackgroundColor: string
}

const StyledContentEditable = styled(ContentEditable)`
  margin-right: 0.25rem;
  height: 100%;
  outline: none;
  user-select: all;
`

const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0.25rem;
  min-width: 5rem;
  background-color: white;
  border-radius: 5px;
  box-shadow: 3px 3px 10px 0px rgba(150,150,150,1);
`

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
