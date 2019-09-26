//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { batch, connect } from 'react-redux'
import styled from 'styled-components'
import { v4 as createUuid } from 'uuid'

import clone from '@/utils/clone'
import { ThunkDispatch } from '@app/state/types'
import { Sheet, SheetColumn, IAllSheetColumns, SheetFilter, SheetFilters, SheetFilterType, SheetFilterUpdates } from '@app/state/sheet/types'
import { 
  createSheetFilter as createSheetFilterAction,
  deleteSheetFilter as deleteSheetFilterAction,
  updateSheetFilter as updateSheetFilterAction,
  allowSelectedCellEditing as allowSelectedCellEditingAction,
  preventSelectedCellEditing as preventSelectedCellEditingAction,
  allowSelectedCellNavigation as allowSelectedCellNavigationAction,
  preventSelectedCellNavigation as preventSelectedCellNavigationAction,
} from '@app/state/sheet/actions'

import AutosizeInput from 'react-input-autosize'
import SheetAction from '@app/bundles/Sheet/SheetAction'

import SheetActionFilterExistingFilters from '@app/bundles/Sheet/SheetActionFilterExistingFilters'

//-----------------------------------------------------------------------------
// Redux
//-----------------------------------------------------------------------------
const mapDispatchToProps = (dispatch: ThunkDispatch, props: SheetActionFilterProps) => ({
  createSheetFilter: (sheetId: string, newFilter: SheetFilter) => dispatch(createSheetFilterAction(sheetId, newFilter)),
  deleteSheetFilter: (sheetId: string, filterId: string) => dispatch(deleteSheetFilterAction(sheetId, filterId)),
  updateSheetFilter: (sheetId: string, filterId: string, updates: SheetFilterUpdates) => dispatch(updateSheetFilterAction(sheetId, filterId, updates)),
  allowSelectedCellEditing: (sheetId: Sheet['id']) => dispatch(allowSelectedCellEditingAction(sheetId)),
  preventSelectedCellEditing: (sheetId: Sheet['id']) => dispatch(preventSelectedCellEditingAction(sheetId)),
  allowSelectedCellNavigation: (sheetId: Sheet['id']) => dispatch(allowSelectedCellNavigationAction(sheetId)),
  preventSelectedCellNavigation: (sheetId: Sheet['id']) => dispatch(preventSelectedCellNavigationAction(sheetId)),
})

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionFilter = ({
  allowSelectedCellEditing,
  allowSelectedCellNavigation,
  columns,
  createSheetFilter,
  deleteSheetFilter,
  filters,
  preventSelectedCellEditing,
  preventSelectedCellNavigation,
  sheetFilters,
  sheetId,
  sheetVisibleColumns,
  updateSheetFilter
}: SheetActionFilterProps) => {

  // Filter Types  
  const filterTypes: SheetFilterType[] = ['!=', '>=', '<=', '=', '>', '<'] // The multicharacter items need to be before the single character items in this array for the validator to work correctly
  // Column Names
  const columnNames = sheetVisibleColumns && sheetVisibleColumns.map(columnId => {
    if(columns && columns[columnId]) {
      return columns[columnId].name
    }
  })
  // Set a local value for existing filters to allow for a quick ui update when the user presses enter
  const [ localSheetFilters, setLocalSheetFilters ] = useState(sheetFilters)
  const [ localFilters, setLocalFilters ] = useState(filters)
  useEffect(() => {
    setLocalFilters(filters)
    setLocalSheetFilters(sheetFilters)
  }, [ filters, sheetFilters ])
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
        allowSelectedCellEditing(sheetId)
        allowSelectedCellNavigation(sheetId)
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
        setLocalFilters({ ...localFilters, [newSheetFilter.id]: newSheetFilter })
        setLocalSheetFilters([ ...localSheetFilters, newSheetFilter.id ])
        setTimeout(() => createSheetFilter(sheetId, newSheetFilter), 10)
      }
    }
  }
  
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
  
  const handleAutosizeInputFocus = () => {
    setIsDropdownVisible(true)
    setTimeout(() => batch(() => {
      preventSelectedCellEditing(sheetId)
      preventSelectedCellNavigation(sheetId)
    }), 10)
  }

  const validateColumnName = (nextAutosizeInputValue: string) => {
    // Combine the next input value into a single unspaced string
    const valueToTest = nextAutosizeInputValue.split(' ').join('')
    // Find all of the column names that are included in the next input value
    const columnIndices = columnNames.reduce((returnArray, columnName, index) => columnName && valueToTest.includes(columnName.split(' ').join('')) ? returnArray.concat(index) : returnArray, [])
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
              const columnNameArray = columnNames[currentColumnIndex].split(' ')
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

  const validateFilterType = (nextAutosizeInputValue: string) => {
    const valueToTest = nextAutosizeInputValue.split(' ').join('')
    const filterTypeIndex = filterTypes.findIndex(filterType => valueToTest.includes(filterType))
    const filterType = filterTypeIndex > -1 ? filterTypes[filterTypeIndex] : null
    return {
      isFilterTypeValidated: filterTypeIndex > -1,
      filterType: filterType
    }
  }

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
  
  const handleDeleteSheetFilter = (filterId: string) => {
    const { [filterId]: deletedFilter, ...nextLocalFilters } = localFilters
    const nextLocalSheetFilters = localSheetFilters.filter(localSheetFilterId => localSheetFilterId !== filterId)
    setLocalFilters(nextLocalFilters)
    setLocalSheetFilters(nextLocalSheetFilters)
    setTimeout(() => deleteSheetFilter(sheetId, filterId), 10)
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
                columns={columns}
                deleteSheetFilter={handleDeleteSheetFilter}
                updateSheetFilter={updateSheetFilter}
                filter={localFilters[filterId]}/>
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
                  {!(isColumnNameValid && columns[filterColumnId]) ? 'Column' : columns[filterColumnId].name }
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
  columns: IAllSheetColumns
  createSheetFilter?(sheetId: string, newFilter: SheetFilter): void
  deleteSheetFilter?(sheetId: Sheet['id'], filterId: SheetFilter['id']): void
  filters: SheetFilters
  sheetId: string
  sheetFilters: SheetFilter['id'][]
  sheetVisibleColumns: SheetColumn['id'][]
  updateSheetFilter?(sheetId: Sheet['id'], filterId: SheetFilter['id'], updates: SheetFilterUpdates): void
  allowSelectedCellEditing?(sheetId: Sheet['id']): void
  preventSelectedCellEditing?(sheetId: Sheet['id']): void
  allowSelectedCellNavigation?(sheetId: Sheet['id']): void
  preventSelectedCellNavigation?(sheetId: Sheet['id']): void
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
export default connect(
  null,
  mapDispatchToProps
)(SheetActionFilter)
