//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useRef, useState } from 'react'
import moment from 'moment'
import { batch, useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { v4 as createUuid } from 'uuid'

import { useSheetEditingPermissions } from '@/hooks'

import clone from '@/utils/clone'

import { IAppState } from '@/state'
import { 
  ISheet, 
  ISheetFilter, ISheetFilterType, ISheetFilterUpdates 
} from '@/state/sheet/types'

import { createMessengerMessage } from '@/state/messenger/actions'
import { 
  allowSelectedCellEditing,
  allowSelectedCellNavigation,
  createSheetFilter,
  deleteSheetFilter,
  preventSelectedCellEditing,
  preventSelectedCellNavigation
} from '@/state/sheet/actions'

import AutosizeInput from 'react-input-autosize'
import SheetAction from '@desktop/Sheet/SheetAction'
import SheetActionFilterExistingFilters from '@desktop/Sheet/SheetActionFilterExistingFilters'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionFilter = ({
  sheetId
}: SheetActionFilterProps) => {

  // Refs
  const autosizeInput = useRef(null)
  const container = useRef(null)
  const dropdown = useRef(null)

  // Redux
  const dispatch = useDispatch()
  const allSheetColumns = useSelector((state: IAppState) => state.sheet.allSheetColumns)
  const allSheetFilters = useSelector((state: IAppState) => state.sheet.allSheetFilters)
  const sheetActiveSheetViewId = useSelector((state: IAppState) => state.sheet.allSheets && state.sheet.allSheets[sheetId] && state.sheet.allSheets[sheetId].activeSheetViewId)
  const activeSheetViewVisibleColumns = useSelector((state: IAppState) => state.sheet.allSheetViews && state.sheet.allSheetViews[sheetActiveSheetViewId] && state.sheet.allSheetViews[sheetActiveSheetViewId].visibleColumns)
  const activeSheetViewFilters = useSelector((state: IAppState) => state.sheet.allSheetViews && state.sheet.allSheetViews[sheetActiveSheetViewId] && state.sheet.allSheetViews[sheetActiveSheetViewId].filters)
  const userColorPrimary = useSelector((state: IAppState) => state.user.color.primary)

  // State
  const [ localSheetFilters, setLocalSheetFilters ] = useState(activeSheetViewFilters)
  const [ localAllSheetFilters, setLocalAllSheetFilters ] = useState(allSheetFilters)

  const [ autosizeInputValue, setAutosizeInputValue ] = useState('')
  const [ isDropdownVisible, setIsDropdownVisible ] = useState(false)
  const [ dropdownHighlightedOptionIndex, setDropdownHighlightedOptionIndex ] = useState(null)
  const [ dropdownOptions, setDropdownOptions ] = useState(null)

  const [ isColumnNameValid, setIsColumnNameValid ] = useState(false)
  const [ isFilterTypeValid, setIsFilterTypeValid ] = useState(false)
  const [ isFilterValid, setIsFilterValid ] = useState(false)
  const [ filterColumnId, setFilterColumnId ] = useState(null)
  const [ filterFilterType, setFilterFilterType ] = useState(null)
  const [ filterValue, setFilterValue ] = useState(null)

  // Permissions
  const {
    userHasPermissionToEditSheet,
    userHasPermissionToEditSheetErrorMessage
  } = useSheetEditingPermissions(sheetId)
  
  // Update local filters as needed
  useEffect(() => {
    setLocalAllSheetFilters(allSheetFilters)
    setLocalSheetFilters(activeSheetViewFilters)
  }, [ allSheetFilters, activeSheetViewFilters ])

  // Add event listeners when the dropdown is visible
  useEffect(() => {
    isDropdownVisible ? addEventListener('mousedown', closeDropdownOnClickOutside) : removeEventListener('mousedown', closeDropdownOnClickOutside)
    return () => removeEventListener('mousedown', closeDropdownOnClickOutside)
  }, [ isDropdownVisible ])

  // When the filter is valid, listen for Enter
  useEffect(() => {
    isFilterValid ? addEventListener('keypress', handleKeypressWhileFilterIsValid) : removeEventListener('keypress', handleKeypressWhileFilterIsValid)
    return () => removeEventListener('keypress', handleKeypressWhileFilterIsValid)
  }, [ autosizeInputValue, isFilterValid ])

  // Filter Types
  const validFilterTypes: ISheetFilterType[] = ['!<>', '<>', '<=', '>=', '!=', '<', '>', '=' ] // The multicharacter items need to be before the single character items in this array for the validator to work correctly
  const filterNames = {
    "!<>": "(Does Not Include)",
    "<>": " (Includes)",
    "!=": " (Does Not Equal)",
    ">=": " (Greater Than Or Equal To)",
    "<=": " (Less Than Or Equal To)",
    "=": "  (Equals)",
    ">": "  (Greater Than)",
    "<": "  (Less Than)"
  }

  // Column Names
  const sheetColumnNames = activeSheetViewVisibleColumns && activeSheetViewVisibleColumns.map(columnId => {
    if(columnId !== 'COLUMN_BREAK' && allSheetColumns && allSheetColumns[columnId]) {
      return allSheetColumns[columnId].name
    }
  })

  // Close the dropdown on click outside
  const closeDropdownOnClickOutside = (e: Event) => {
    if(!dropdown.current.contains(e.target) && !container.current.contains(e.target)) {
      setIsDropdownVisible(false)
      setTimeout(() => batch(() => {
        dispatch(allowSelectedCellEditing(sheetId))
        dispatch(allowSelectedCellNavigation(sheetId))
      }), 10)
    }
  }

  // Get the dropdown options
  const getDropdownOptions = (nextAutosizeInputValue: string, isColumnNameValid: boolean, isFilterTypeValid: boolean, isFilterValid: boolean, validColumnId: string, filterType: ISheetFilterType) => {
    // Get all available dropdown options
    let options: { id: string, value: string }[] = []
    if(!isColumnNameValid) {
      options = activeSheetViewVisibleColumns && activeSheetViewVisibleColumns.map(columnId => { 
        if(columnId !== 'COLUMN_BREAK') {
          return { 
            id: columnId,
            value: allSheetColumns[columnId] && allSheetColumns[columnId].name + ' '
          }
        }
      }).filter(Boolean)
    }
    else if (isColumnNameValid && !isFilterTypeValid) {
      options = validFilterTypes.map(validFilterType => {
        return {
          id: validFilterType,
          value: nextAutosizeInputValue.trim() + ' ' + validFilterType + ' ',
          suffix: filterNames[validFilterType]
        }
      })
    }
    else {
      const validColumn = allSheetColumns[validColumnId || filterColumnId]
      if(validColumn) {
        options = [ ...validColumn.allCellValues ].map(validCellValue => {
          return {
            id: validCellValue,
            value: validColumn.name + ' ' + (filterType || filterFilterType) + ' ' + validCellValue
          }
        }).sort((a, b) => b.value.localeCompare(a.value, undefined, { numeric: true }))
      }
    }
    // Filter the available dropdown options to only display ones the current input value matches
    const dropdownOptions = options && options.filter(option => {
      if(nextAutosizeInputValue) {
        const searchString = nextAutosizeInputValue.trim().toLowerCase().split(' ').join('')
        const optionValueString = option.value.trim().toLowerCase().split(' ').join('')
        if(!isColumnNameValid) {
          return optionValueString.includes(searchString)
        }
        else if(isColumnNameValid && !isFilterTypeValid) {
          return !validFilterTypes.some(validFilterType => validFilterType.split('').some(character => searchString.includes(character)))
        }
        else {
          return optionValueString.includes(searchString)
        }
      }
      return true
    })
    return !isColumnNameValid ? dropdownOptions : dropdownOptions.reverse()
  }

  // Get the filter value
  const getFilterValue = (nextAutosizeInputValue: string) => {
    const reverseNextValue = clone(nextAutosizeInputValue).split('').reverse().join('')
    const reverseValueStartArray = ['!', '>', '=', '<'].map(filterTypeCharacter => {
      const index = reverseNextValue.indexOf(filterTypeCharacter)
      return index > -1 ? index : null
    }).filter(value => value !== null)
    const reverseValueStartIndex = reverseValueStartArray.length === 0 ? null : Math.min(...reverseValueStartArray)
    const valueStartIndex = reverseValueStartIndex !== null ? nextAutosizeInputValue.length - reverseValueStartIndex : null
    return valueStartIndex !== null && valueStartIndex < nextAutosizeInputValue.trim().length ? clone(nextAutosizeInputValue).slice(valueStartIndex).trim() : null
  }
  
  // Handle creating a sheet filter
  const handleCreateSheetFilter = (columnId: string, filterType: ISheetFilterType, value: string) => {
    if(!userHasPermissionToEditSheet) {
      dispatch(createMessengerMessage(userHasPermissionToEditSheetErrorMessage))
    }
    else {
      // Reset state
      setAutosizeInputValue('')
      setIsDropdownVisible(false)
      setIsColumnNameValid(false)
      setIsFilterTypeValid(false)
      setIsFilterValid(false)
      setFilterColumnId(null)
      setFilterFilterType(null)
      setFilterValue(null)
      // New Filter
      const newSheetFilter: ISheetFilter = {
        id: createUuid(), 
        createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        sheetId: sheetId,
        sheetViewId: sheetActiveSheetViewId,
        columnId: columnId, 
        value: value, 
        type: filterType,
        isLocked: false
      }
      setLocalAllSheetFilters({ ...localAllSheetFilters, [newSheetFilter.id]: newSheetFilter })
      setLocalSheetFilters([ ...localSheetFilters, newSheetFilter.id ])
      setTimeout(() => dispatch(createSheetFilter(sheetId, newSheetFilter)), 10)
    }
  }
  
  // Handle the input value changing
  const handleAutosizeInputChange = (nextAutosizeInputValue: string) => {
    const { isColumnNameValidated, columnId } = validateColumnName(nextAutosizeInputValue)
    const { isFilterTypeValidated, filterType } = validateFilterType(nextAutosizeInputValue)
    const nextFilterValue = getFilterValue(nextAutosizeInputValue)
    const isFilterValidated = isColumnNameValidated && isFilterTypeValidated && nextFilterValue !== null
    const nextDropdownOptions = getDropdownOptions(nextAutosizeInputValue, isColumnNameValidated, isFilterTypeValidated, isFilterValidated, columnId, filterType)
    setDropdownOptions(nextDropdownOptions)
    setIsDropdownVisible(true)
    setIsColumnNameValid(isColumnNameValidated)
    setFilterColumnId(columnId)
    setIsFilterTypeValid(isFilterTypeValidated)
    setFilterFilterType(filterType)
    setFilterValue(nextFilterValue)
    setIsFilterValid(isFilterValidated)
    setAutosizeInputValue(nextAutosizeInputValue)
    setTimeout(() => autosizeInput.current.focus(), 10)
  }
  
  // Handle the input focusing
  const handleAutosizeInputFocus = () => {
    setDropdownOptions(getDropdownOptions(autosizeInputValue, isColumnNameValid, isFilterTypeValid, isFilterValid, null, null))
    setIsDropdownVisible(true)
    setTimeout(() => batch(() => {
      dispatch(preventSelectedCellEditing(sheetId))
      dispatch(preventSelectedCellNavigation(sheetId))
    }), 10)
  }
  
  // Handle a filter delete
  const handleDeleteSheetFilter = (filterId: string) => {
    if(!userHasPermissionToEditSheet) {
      dispatch(createMessengerMessage(userHasPermissionToEditSheetErrorMessage))
    }
    else {
      const { [filterId]: deletedFilter, ...nextLocalFilters } = localAllSheetFilters
      const nextLocalSheetFilters = localSheetFilters.filter(localSheetFilterId => localSheetFilterId !== filterId)
      setLocalAllSheetFilters(nextLocalFilters)
      setLocalSheetFilters(nextLocalSheetFilters)
      setTimeout(() => dispatch(deleteSheetFilter(sheetId, filterId)), 10)
    }
  }
  
  // Handle dropdown option click
  const handleDropdownOptionClick = (option: IDropdownOption) => {
    if(isColumnNameValid && isFilterTypeValid) {
      const { columnId } = validateColumnName(option.value)
      const { filterType } = validateFilterType(option.value)
      const filterValue = getFilterValue(option.value)
      handleCreateSheetFilter(columnId, filterType, filterValue)
    }
    else {
      handleAutosizeInputChange(option.value)
    }
  }

  // Create a filter when the input value is a valid filter and the user presses enter
  const handleKeypressWhileFilterIsValid = (e: KeyboardEvent) => {
    if(e.key === 'Enter') {
      if(isFilterValid) {
        handleCreateSheetFilter(filterColumnId, filterFilterType, filterValue)
      }
    }
  }
  
  // Check to see if the input contains a valid column name
  const validateColumnName = (nextAutosizeInputValue: string) => {
    // Combine the next input value into a single unspaced string
    const valueToTest = nextAutosizeInputValue.split(' ').join('')
    // Find all of the column names that are included in the next input value
    const columnIndices = sheetColumnNames.reduce((returnArray, columnName, index) => columnName && valueToTest.includes(columnName.split(' ').join('')) ? returnArray.concat(index) : returnArray, [])
    // Most of the time, this will only return a single column name. However,
    // when one column name is included in another column name (e.g. IP & WHIP
    // both contain 'IP') we need to figure out which one is the exact match.
    // We do this by comparing the first and last letters of the qualifying
    // column names to the input value and returning 
    const columnIndicesIndex = 
      columnIndices.length === 0
        ? -1
        : columnIndices.length === 1
          ? 0
          : columnIndices.findIndex(currentColumnIndex => {
              const columnNameArray = sheetColumnNames[currentColumnIndex].split(' ')
              const lastWordIndex = columnNameArray.length - 1
              const nextAutosizeInputValueArray = nextAutosizeInputValue.split(' ')
              const isFirstLetterSame = columnNameArray[0].charAt(0) === nextAutosizeInputValueArray[0].charAt(0)
              const isLastLetterSame = columnNameArray[lastWordIndex].slice(-1) === nextAutosizeInputValueArray[lastWordIndex].slice(-1)
              return isFirstLetterSame && isLastLetterSame
            })
    const isColumnNameValidated = columnIndicesIndex > -1
    const columnId = isColumnNameValidated ? activeSheetViewVisibleColumns[columnIndices[columnIndicesIndex]] : null
    return {
      isColumnNameValidated: isColumnNameValidated,
      columnId: columnId
    }
  }

  // Check to see if the input contains a valid filter type
  const validateFilterType = (nextAutosizeInputValue: string) => {
    const valueToTest = nextAutosizeInputValue.split(' ').join('')
    const filterTypeIndex = validFilterTypes.findIndex(filterType => valueToTest.includes(filterType))
    const filterType = filterTypeIndex > -1 ? validFilterTypes[filterTypeIndex] : null
    return {
      isFilterTypeValidated: filterTypeIndex > -1,
      filterType: filterType
    }
  }

  return (
    <SheetAction>
      <Container
        ref={container}
        isDropdownVisible={isDropdownVisible}>
        <Wrapper>
          <ExistingFilters>
            {localSheetFilters && localSheetFilters.map(filterId => (
              <SheetActionFilterExistingFilters 
                key={filterId}
                sheetId={sheetId}
                handleDeleteSheetFilter={handleDeleteSheetFilter}
                filter={localAllSheetFilters[filterId]}/>
            ))}
          </ExistingFilters>
          <InputContainer>
            <AutosizeInput
              ref={autosizeInput}
              placeholder="Filter..."
              value={autosizeInputValue}
              onChange={e => handleAutosizeInputChange(e.target.value)}
              onFocus={handleAutosizeInputFocus}
              inputStyle={{
                marginRight: '0.25rem',
                padding: '0.1rem 0',
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
                <DropdownTextContainer
                  userColorPrimary={userColorPrimary}
                  isFilterValid={isFilterValid}>
                  <DropdownText
                    isBold={!isColumnNameValid}
                    isFilterValid={isFilterValid}
                    isGrayedOut={false}
                    isItalic={!isColumnNameValid}>
                    {!(isColumnNameValid && allSheetColumns[filterColumnId]) ? 'Column' : allSheetColumns[filterColumnId].name }
                  </DropdownText>
                  &nbsp;
                  <DropdownText
                    isBold={isColumnNameValid && !isFilterTypeValid}
                    isFilterValid={isFilterValid} 
                    isGrayedOut={!isColumnNameValid}
                    isItalic={!isFilterTypeValid}>
                    {!isColumnNameValid || isColumnNameValid && !isFilterTypeValid ? 'Filter' : filterFilterType }
                  </DropdownText>
                  &nbsp;
                  <DropdownText 
                    isBold={isColumnNameValid && isFilterTypeValid && !isFilterValid}
                    isFilterValid={isFilterValid}
                    isGrayedOut={!isColumnNameValid || !isFilterTypeValid}
                    isItalic={!isFilterValid}>
                    {isFilterValid ? filterValue : 'Value'}
                  </DropdownText>
                </DropdownTextContainer>
                <DropdownOptions>
                  {dropdownOptions && dropdownOptions.map((dropdownOption: IDropdownOption, index: number) => (
                    <DropdownOption
                      key={index}
                      isHighlighted={dropdownHighlightedOptionIndex === index}
                      onClick={() => handleDropdownOptionClick(dropdownOption)}
                      onMouseEnter={() => setDropdownHighlightedOptionIndex(index)}>{dropdownOption.value}{dropdownOption.suffix || ''}</DropdownOption>
                  ))}
                </DropdownOptions>
              </Dropdown>
          </InputContainer>
        </Wrapper>
      </Container>
    </SheetAction>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetActionFilterProps {
  sheetId: string
  createSheetFilter?(sheetId: string, newFilter: ISheetFilter): void
  deleteSheetFilter?(sheetId: ISheet['id'], filterId: ISheetFilter['id']): void
  updateSheetFilter?(sheetId: ISheet['id'], filterId: ISheetFilter['id'], updates: ISheetFilterUpdates): void
  allowSelectedCellEditing?(sheetId: ISheet['id']): void
  preventSelectedCellEditing?(sheetId: ISheet['id']): void
  allowSelectedCellNavigation?(sheetId: ISheet['id']): void
  preventSelectedCellNavigation?(sheetId: ISheet['id']): void
}

interface IDropdownOption {
  id: string
  value: string
  suffix?: string
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  z-index: ${ ({ isDropdownVisible }: IContainer ) => isDropdownVisible ? '100' : '50'};
  position: relative;
  width: 100%;
  height: 100%;
  margin-right: 0.25rem;
  background-color: rgb(225, 225, 225);
  border: 1px solid rgb(210, 210, 210);
  border-radius: 4px;
`
interface IContainer {
  isDropdownVisible: boolean
}

const Wrapper = styled.div`
  padding: 0.1875rem;
  display: flex;
  align-items: center;
`

const ExistingFilters = styled.div`
  display: flex;
`

const InputContainer = styled.div`
  position: relative;
  padding-left: 0.125rem;
`

const Dropdown = styled.div`
  display: ${ ({ isDropdownVisible }: IDropdown ) => isDropdownVisible ? 'block' : 'none'};
  background-color: rgb(253, 253, 253);
  position: absolute;
  left: -0.25rem;
  top: calc(100% + 0.25rem);
  border-radius: 5px;
  box-shadow: 3px 3px 10px 0px rgba(150,150,150,1);
  max-height: 50vh;
	overflow-y: scroll;
	scrollbar-width: none;
	-ms-overflow-style: none;
	&::-webkit-scrollbar {
		width: 0;
		height: 0;
	}
`
interface IDropdown {
  isDropdownVisible: boolean
}

const DropdownTextContainer = styled.div`
  padding: 0.1875rem 0.3rem;
  padding-right: 0.25rem;
  min-width: 5rem;
  background-color: ${ ({ isFilterValid, userColorPrimary }: IDropdownTextContainer ) => isFilterValid ? userColorPrimary : 'rgb(233, 233, 233)'};
  color: ${ ({ isFilterValid }: IDropdownTextContainer ) => isFilterValid ? 'white' : 'inherit'};
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
`
interface IDropdownTextContainer {
  isFilterValid: boolean
  userColorPrimary: string
}

const DropdownText = styled.span`
  color: ${ ({ isFilterValid, isGrayedOut }: IDropdownText ) => isGrayedOut ? 'rgb(150, 150, 150)' : (isFilterValid ? 'white' : 'black')};
  font-style: ${ ({ isItalic }: IDropdownText ) => isItalic ? 'italic' : 'auto'};
  font-weight: ${ ({ isBold }: IDropdownText ) => isBold ? 'bold' : 'auto'};
  white-space: nowrap;
  max-width: 15rem;
  overflow: hidden;
`
interface IDropdownText {
  isBold: boolean
  isFilterValid: boolean
  isGrayedOut: boolean
  isItalic: boolean
}

const DropdownOptions = styled.div``


const DropdownOption = styled.div`
  padding: 0.15rem 0.3rem;
  cursor: default;
  padding: 0.15rem 0.25rem;
  background-color: ${ ({ isHighlighted }: IStyledDropdownOption ) => isHighlighted ? 'rgb(240, 240, 240)' : 'transparent'};
  white-space: nowrap;
`
interface IStyledDropdownOption {
  isHighlighted: boolean
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetActionFilter
