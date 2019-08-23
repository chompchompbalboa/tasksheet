//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { v4 as createUuid } from 'uuid'

import clone from '@/utils/clone'
import { ThunkDispatch } from '@app/state/types'
import { Sheet, SheetColumn, SheetColumns, SheetFilter, SheetFilters, SheetFilterType } from '@app/state/sheet/types'
import { 
  createSheetFilter as createSheetFilterAction,
  deleteSheetFilter as deleteSheetFilterAction,
  //updateSheetFilter as updateSheetFilterAction 
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
  //updateSheetFilter: (filterId: string, updates: SheetFilterUpdates) => dispatch(updateSheetFilterAction(filterId, updates))
})

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionFilter = ({
  columns,
  createSheetFilter,
  deleteSheetFilter,
  filters,
  sheetFilters,
  sheetId,
  sheetVisibleColumns
}: SheetActionFilterProps) => {

  // Filter Types  
  const filterTypes: SheetFilterType[] = ['!=', '>=', '<=', '=', '>', '<'] // The multcharacter items need to be before the single character items in this array for the validator to work correctly
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

  const closeDropdownOnClickOutside = (e: Event) => {
    if(!dropdown.current.contains(e.target) && !container.current.contains(e.target)) {
      setIsDropdownVisible(false)
    }
  }

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
          type: filterFilterType
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
  
  const handleAutosizeInputFocus = () => setIsDropdownVisible(true)

  const validateColumnName = (nextAutosizeInputValue: string) => {
    const valueToTest = nextAutosizeInputValue.split(' ').join('')
    const columnIndex = columnNames.findIndex(columnName => columnName && valueToTest.includes(columnName.split(' ').join('')))
    const columnId = columnIndex > -1 ? sheetVisibleColumns[columnIndex] : null
    return {
      isColumnNameValidated: columnIndex > -1,
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
                columns={columns}
                deleteSheetFilter={handleDeleteSheetFilter}
                filter={localFilters[filterId]}
                sheetId={sheetId}/>
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
  columns: SheetColumns
  createSheetFilter?(sheetId: string, newFilter: SheetFilter): void
  deleteSheetFilter?(sheetId: Sheet['id'], filterId: SheetFilter['id']): void
  filters: SheetFilters
  sheetId: string
  sheetFilters: SheetFilter['id'][]
  sheetVisibleColumns: SheetColumn['id'][]
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
