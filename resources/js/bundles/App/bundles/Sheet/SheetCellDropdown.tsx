//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { ISheetCell, ISheetColumnType } from '@app/state/sheet/types'

import AutosizeTextArea from 'react-autosize-textarea'
import SheetCellContainer from '@app/bundles/Sheet/SheetCellContainer'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetCellDropdown = ({
  columnType,
  updateCellValue,
  value,
  ...passThroughProps
}: SheetCellDropdownProps) => {

  // Refs
  const textarea = useRef(null)

  // Local Variables
  const dropdownOptions = columnType.data.options
  const dropdownOptionsIds = Object.keys(dropdownOptions)
  const safeValue = value || ''

  // State
  const [ isDropdownVisible, setIsDropdownVisible ] = useState(false)
  const [ visibleDropdownOptionsIds, setVisibleDropdownOptionsIds ] = useState(dropdownOptionsIds || [])
  const [ highlightedDropdownOptionId, setHighlightedDropdownOptionId ] = useState(null)

  // Effects
  useEffect(() => {
    if(isDropdownVisible) { addEventListener('keydown', handleKeydownWhileDropdownIsVisible) }
    else { removeEventListener('keydown', handleKeydownWhileDropdownIsVisible) }
    return () => removeEventListener('keydown', handleKeydownWhileDropdownIsVisible)
  }, [ highlightedDropdownOptionId, isDropdownVisible, visibleDropdownOptionsIds ])
  
  // Focus Cell
  const focusCell = () => {
    setIsDropdownVisible(true)
    textarea.current.focus()
    const textareaLength = textarea && textarea.current && textarea.current.value && textarea.current.value.length || 0
    textarea.current.setSelectionRange(textareaLength, textareaLength) // Move cursor to end
  }

  // Get Visible Dropdown Options Ids
  const getVisibleDropdownOptionsIds = (value: string) => {
    return dropdownOptionsIds && dropdownOptionsIds.filter(optionId => {
      const searchString = value.toLowerCase().replace(/ /g, "")
      return dropdownOptions[optionId].value.toLowerCase().replace(/ /g, "").includes(searchString)
    })
  }

  // Handle Keydown While Dropdown is Visible
  const handleKeydownWhileDropdownIsVisible = (e: KeyboardEvent) => {
    if(e.key === 'Enter') {
      if(dropdownOptions && dropdownOptions[highlightedDropdownOptionId]) {
        const nextCellValue = dropdownOptions[highlightedDropdownOptionId].value
        updateCellValue(nextCellValue)
        handleCellEditingComplete()
      }
    }
    if(e.key === "ArrowUp") {
      e.preventDefault()
      const highlightedDropdownOptionIdIndex = visibleDropdownOptionsIds.findIndex(dropdownOptionId => highlightedDropdownOptionId === dropdownOptionId)
      const nextHighlightedDropdownOptionIdIndex = Math.max(highlightedDropdownOptionIdIndex - 1, 0)
      const nextHighlightedDropdownOptionId = visibleDropdownOptionsIds[nextHighlightedDropdownOptionIdIndex]
      setHighlightedDropdownOptionId(highlightedDropdownOptionId === null ? null : nextHighlightedDropdownOptionId)
    }
    if(e.key === "ArrowDown") {
      e.preventDefault()
      const highlightedDropdownOptionIdIndex = visibleDropdownOptionsIds.findIndex(dropdownOptionId => highlightedDropdownOptionId === dropdownOptionId)
      const nextHighlightedDropdownOptionIdIndex = Math.min(highlightedDropdownOptionIdIndex + 1, visibleDropdownOptionsIds.length - 1)
      const nextHighlightedDropdownOptionId = visibleDropdownOptionsIds[nextHighlightedDropdownOptionIdIndex]
      setHighlightedDropdownOptionId(highlightedDropdownOptionId === null ? visibleDropdownOptionsIds[0] : nextHighlightedDropdownOptionId)
    }
  }

  // Handle Cell Editing Complete
  const handleCellEditingComplete = () => {
    setIsDropdownVisible(false)
    setVisibleDropdownOptionsIds(dropdownOptionsIds)
    setHighlightedDropdownOptionId(null)
  }
  
  const handleDropdownOptionClick = (optionId: string) => {
    const nextCellValue = dropdownOptions[optionId].value
    updateCellValue(nextCellValue)
    handleCellEditingComplete()
  }

  // Handle Update Cell Value
  const handleUpdateCellValue = (nextValue: string) => {
    const nextVisibleDropdownOptionsIds = getVisibleDropdownOptionsIds(nextValue)
    nextVisibleDropdownOptionsIds.length === 1 && setHighlightedDropdownOptionId(nextVisibleDropdownOptionsIds[0])
    setVisibleDropdownOptionsIds(nextVisibleDropdownOptionsIds)
    updateCellValue(nextValue)
  }

  // Render
  return (
    <SheetCellContainer
      focusCell={focusCell}
      onCloseCell={() => setTimeout(() => handleCellEditingComplete(), 10)}
      updateCellValue={(nextValue: string) => handleUpdateCellValue(nextValue)}
      value={safeValue}
      {...passThroughProps}>
      <StyledTextarea
        ref={textarea}
        onChange={(e: any) => handleUpdateCellValue(e.target.value)}
        value={safeValue}/>
      <Dropdown
        isDropdownVisible={isDropdownVisible}>
        {visibleDropdownOptionsIds && visibleDropdownOptionsIds.map(dropdownOptionId => {
          const dropdownOption = dropdownOptions[dropdownOptionId]
          return (
            <DropdownOption
              key={dropdownOption.id}
              isHighlighted={highlightedDropdownOptionId === dropdownOptionId}
              onClick={() => handleDropdownOptionClick(dropdownOptionId)}
              onMouseEnter={() => setHighlightedDropdownOptionId(dropdownOptionId)}>
              {dropdownOption.value}
            </DropdownOption>
          )
        })}
      </Dropdown>
    </SheetCellContainer>
  )

}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetCellDropdownProps {
  sheetId: string
  cell: ISheetCell
  cellId: string
  columnType: ISheetColumnType
  isCellSelected: boolean
  updateCellValue(nextCellValue: string): void
  updateSheetSelectionFromArrowKey(cellId: string, moveSelectedCellDirection: 'UP' | 'RIGHT' | 'DOWN' | 'LEFT'): void
  value: string
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const StyledTextarea = styled(AutosizeTextArea)`
  width: 100%;
  height: 100%;
  font-size: inherit;
  font-weight: inherit;
  font-family: inherit;
  letter-spacing: inherit;
  border: none;
  outline: none;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  -moz-appearance: textfield;
  resize: none;
  white-space: nowrap;
  text-overflow: ellipsis;
`

const Dropdown = styled.div`
  display: ${ ({ isDropdownVisible }: IDropdown ) => isDropdownVisible ? 'block' : 'none' };
  position: absolute;
  top: calc(100% + 2px);
  left: -2px;
  min-width: calc(100% + 4px);
  border-radius: 5px;
  background-color: rgb(250, 250, 250);
  box-shadow: 1px 1px 10px 0px rgba(0,0,0,0.5);
`
interface IDropdown {
  isDropdownVisible: boolean
}

const DropdownOption = styled.div`
  cursor: default;
  width: 100%;
  padding: 0.15rem 0.25rem;
  background-color: ${ ({ isHighlighted }: IDropdownOption ) => isHighlighted ? 'rgb(240, 240, 240)' : 'transparent'};
`
interface IDropdownOption {
  isHighlighted: boolean
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetCellDropdown
