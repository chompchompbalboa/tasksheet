//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { batch, useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { v4 as createUuid } from 'uuid'

import clone from '@/utils/clone'
import { IAppState } from '@app/state'
import { 
  ISheet, 
  ISheetFilter, ISheetFilterType, ISheetFilterUpdates 
} from '@app/state/sheet/types'
import { 
  allowSelectedCellEditing,
  allowSelectedCellNavigation,
  createSheetFilter,
  deleteSheetFilter,
  preventSelectedCellEditing,
  preventSelectedCellNavigation
} from '@app/state/sheet/actions'

import AutosizeInput from 'react-input-autosize'
import SheetAction from '@app/bundles/Sheet/SheetAction'
import SheetActionFilterExistingFilters from '@app/bundles/Sheet/SheetActionFilterExistingFilters'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionFilter = ({
  sheetId
}: SheetActionFilterProps) => {

  // Redux
  const dispatch = useDispatch()

  const allSheetColumns = useSelector((state: IAppState) => state.sheet.allSheetColumns)
  const allSheetFilters = useSelector((state: IAppState) => state.sheet.allSheetFilters)

  const sheetVisibleColumns = useSelector((state: IAppState) => state.sheet.allSheets && state.sheet.allSheets[sheetId] && state.sheet.allSheets[sheetId].visibleColumns)
  const sheetFilters = useSelector((state: IAppState) => state.sheet.allSheets && state.sheet.allSheets[sheetId] && state.sheet.allSheets[sheetId].filters)

  // Filter Types  
  const validFilterTypes: ISheetFilterType[] = ['!=', '>=', '<=', '=', '>', '<'] // The multicharacter items need to be before the single character items in this array for the validator to work correctly

  // Column Names
  const sheetColumnNames = sheetVisibleColumns && sheetVisibleColumns.map(columnId => {
    if(allSheetColumns && allSheetColumns[columnId]) {
      return allSheetColumns[columnId].name
    }
  })

  // Set a local value for existing filters to allow for a quick ui update when the user presses enter
  const [ localSheetFilters, setLocalSheetFilters ] = useState(sheetFilters)
  const [ localAllSheetFilters, setLocalAllSheetFilters ] = useState(allSheetFilters)
  useEffect(() => {
    setLocalAllSheetFilters(allSheetFilters)
    setLocalSheetFilters(sheetFilters)
  }, [ allSheetFilters, sheetFilters ])

  // Refs
  const container = useRef(null)
  const dropdown = useRef(null)

  // Input and dropdown
  const [ autosizeInputValue, setAutosizeInputValue ] = useState('')
  const [ isDropdownVisible, setIsDropdownVisible ] = useState(false)

  // Validate filters
  const [ isColumnNameValid, setIsColumnNameValid ] = useState(false)
  const [ isFilterTypeValid, setIsFilterTypeValid ] = useState(false)
  const [ isFilterValid, setIsFilterValid ] = useState(false)
  const [ filterColumnId, setFilterColumnId ] = useState(null)
  const [ filterFilterType, setFilterFilterType ] = useState(null)
  const [ filterValue, setFilterValue ] = useState(null)

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

  // Create a filter when the input value is a valid filter and the user presses enter
  const handleKeypressWhileFilterIsValid = (e: KeyboardEvent) => {
    if(e.key === 'Enter') {
      if(isFilterValid) {
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
        const newSheetFilter = {
          id: createUuid(), 
          sheetId: sheetId,
          columnId: filterColumnId, 
          value: filterValue, 
          type: filterFilterType,
          isLocked: false
        }
        setLocalAllSheetFilters({ ...localAllSheetFilters, [newSheetFilter.id]: newSheetFilter })
        setLocalSheetFilters([ ...localSheetFilters, newSheetFilter.id ])
        setTimeout(() => dispatch(createSheetFilter(sheetId, newSheetFilter)), 10)
      }
    }
  }
  
  // Handle the input value changing
  const handleAutosizeInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const nextAutosizeInputValue = e.target.value
    const { isColumnNameValidated, columnId } = validateColumnName(nextAutosizeInputValue)
    const { isFilterTypeValidated, filterType } = validateFilterType(nextAutosizeInputValue)
    const nextFilterValue = getFilterValue(nextAutosizeInputValue)
    setIsDropdownVisible(true)
    setIsColumnNameValid(isColumnNameValidated)
    setFilterColumnId(columnId)
    setIsFilterTypeValid(isFilterTypeValidated)
    setFilterFilterType(filterType)
    setFilterValue(nextFilterValue)
    setIsFilterValid(isColumnNameValidated && isFilterTypeValidated && nextFilterValue !== null)
    setAutosizeInputValue(e.target.value)
  }
  
  // Handle the input focusing
  const handleAutosizeInputFocus = () => {
    setIsDropdownVisible(true)
    setTimeout(() => batch(() => {
      dispatch(preventSelectedCellEditing(sheetId))
      dispatch(preventSelectedCellNavigation(sheetId))
    }), 10)
  }

  // Check to see if the input contiains a valid column name
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
    const columnId = isColumnNameValidated ? sheetVisibleColumns[columnIndices[columnIndicesIndex]] : null
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
  
  // Handle a filter delete
  const handleDeleteSheetFilter = (filterId: string) => {
    const { [filterId]: deletedFilter, ...nextLocalFilters } = localAllSheetFilters
    const nextLocalSheetFilters = localSheetFilters.filter(localSheetFilterId => localSheetFilterId !== filterId)
    setLocalAllSheetFilters(nextLocalFilters)
    setLocalSheetFilters(nextLocalSheetFilters)
    setTimeout(() => dispatch(deleteSheetFilter(sheetId, filterId)), 10)
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
              placeholder="Filter By..."
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
                isDropdownVisible={isDropdownVisible}
                isFilterValid={isFilterValid}>
                <DropdownText 
                  isGrayedOut={false}>
                  {!(isColumnNameValid && allSheetColumns[filterColumnId]) ? 'Column' : allSheetColumns[filterColumnId].name }
                </DropdownText>
                &nbsp;
                <DropdownText 
                  isGrayedOut={!isColumnNameValid || isColumnNameValid && !isFilterTypeValid}>
                  {!isColumnNameValid || isColumnNameValid && !isFilterTypeValid ? 'Filter' : filterFilterType }
                </DropdownText>
                &nbsp;
                <DropdownText 
                  isGrayedOut={!isColumnNameValid || !isFilterTypeValid || isColumnNameValid && isFilterTypeValid && !isFilterValid}>
                  {isFilterValid ? filterValue : 'Value'}
                </DropdownText>
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

const ExistingFilters = styled.div`
  display: flex;
`

const InputContainer = styled.div`
  position: relative;
`

const Dropdown = styled.div`
  display: ${ ({ isDropdownVisible }: DropdownProps ) => isDropdownVisible ? 'block' : 'none'};
  background-color: rgb(253, 253, 253);
  position: absolute;
  left: -0.25rem;
  top: calc(100% + 0.25rem);
  padding: 0.5rem;
  border-radius: 5px;
  box-shadow: 3px 3px 10px 0px rgba(150,150,150,1);
`
interface DropdownProps {
  isDropdownVisible: boolean
  isFilterValid: boolean
}

const DropdownText = styled.span`
  color: ${ ({ isGrayedOut }: DropdownTextProps ) => isGrayedOut ? 'rgb(150, 150, 150)' : 'black'};
  white-space: nowrap;
`
interface DropdownTextProps {
  isGrayedOut: boolean
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetActionFilter
