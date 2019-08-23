//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { ThunkDispatch } from '@app/state/types'
import { Sheet, SheetColumn, SheetColumns, SheetFilter, SheetFilters } from '@app/state/sheet/types'
import { 
  //createSheetFilter as createSheetFilterAction,
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
  //createSheetFilter: (sheetId: string, newFilter: SheetFilter) => dispatch(createSheetFilterAction(props.sheetId, newFilter)),
  deleteSheetFilter: (filterId: string) => dispatch(deleteSheetFilterAction(props.sheetId, filterId)),
  //updateSheetFilter: (filterId: string, updates: SheetFilterUpdates) => dispatch(updateSheetFilterAction(filterId, updates))
})

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionFilter = ({
  columns,
  deleteSheetFilter,
  filters,
  sheetFilters,
  sheetId
}: SheetActionFilterProps) => {
  
  // Refs
  const container = useRef(null)
  const dropdown = useRef(null)
  // Input and dropdown
  const [ autosizeInputValue, setAutosizeInputValue ] = useState('')
  const [ isDropdownVisible, setIsDropdownVisible ] = useState(false)
  // Validate filters
  //const [ isColumnNameValid, setIsColumnNameValid ] = useState(false)
  //const [ isFilterTypeValid, setIsFilterTypeValid ] = useState(false)
  //const [ isValueValid, setIsValueValid ] = useState(false)
  // Add event listeners when the dropdown is visible
  useEffect(() => {
    if(isDropdownVisible) {
      addEventListener('mousedown', closeDropdownOnClickOutside)
      addEventListener('keydown', handleKeydownWhileDropdownIsVisible)
    } 
    else {
      removeEventListener('mousedown', closeDropdownOnClickOutside)
      removeEventListener('keydown', handleKeydownWhileDropdownIsVisible)
    }
    return () => {
      removeEventListener('mousedown', closeDropdownOnClickOutside)
      removeEventListener('keydown', handleKeydownWhileDropdownIsVisible)
    }
  }, [ isDropdownVisible ])

  const closeDropdownOnClickOutside = (e: Event) => {
    if(!dropdown.current.contains(e.target) && !container.current.contains(e.target)) {
      setIsDropdownVisible(false)
    }
  }

  const handleKeydownWhileDropdownIsVisible = (e: KeyboardEvent) => {
    console.log(e.key)
  }
  
  const handleAutosizeInputChange = (e: ChangeEvent<HTMLInputElement>) => setAutosizeInputValue(e.target.value)
  
  const handleAutosizeInputFocus = () => setIsDropdownVisible(true)

  return (
    <SheetAction>
      <Container
        ref={container}
        isDropdownVisible={isDropdownVisible}>
        <Wrapper>
          <ExistingFilters>
            {sheetFilters && sheetFilters.map(filterId => (
              <SheetActionFilterExistingFilters 
                key={filterId}
                columns={columns}
                deleteSheetFilter={deleteSheetFilter}
                filter={filters[filterId]}
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
                isDropdownVisible={isDropdownVisible}>
                Dropdown
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

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default connect(
  null,
  mapDispatchToProps
)(SheetActionFilter)
