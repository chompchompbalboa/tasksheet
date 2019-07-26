//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'

import { SheetFilterUpdates } from '@app/state/sheet/actions'
import { SheetFilter, SheetFilters } from '@app/state/sheet/types'
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
    
    const handleOptionClick = (filter: SheetFilter) => {
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
  filters: SheetFilters
  updateFilter(filterId: string, updates: SheetFilterUpdates): void
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