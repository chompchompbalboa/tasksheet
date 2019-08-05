//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'

import { SheetFilter, SheetFilters } from '@app/state/sheet/types'
import { SheetActionDropdownOption } from '@app/bundles/Sheet/SheetActionDropdown'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionFilterSelectedOption = ({ 
  option,
  filters
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