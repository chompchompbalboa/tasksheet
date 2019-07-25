//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'

import { FilterUpdates } from '@app/state/sheet/actions'
import { Filter, Filters } from '@app/state/sheet/types'
import { SheetActionDropdownOption } from '@app/bundles/Sheet/SheetActionDropdown'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionFilterSelectedOption = ({ 
  option,
  filters,
  updateFilter
}: SheetActionFilterSelectedOptionProps) => {
    const filter = filters.find(filter => filter.id === option.value)
    
    const handleOptionClick = (filter: Filter) => {
      console.log('filterClick')
    }
    
    return (
      <Container
        onClick={() => handleOptionClick(filter)}>
        {option.label} {filter.type} {filter.value}
      </Container>
    )
  }

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetActionFilterSelectedOptionProps {
  option: SheetActionDropdownOption
  filters: Filters
  updateFilter(filterId: string, updates: FilterUpdates): void
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetActionFilterSelectedOption