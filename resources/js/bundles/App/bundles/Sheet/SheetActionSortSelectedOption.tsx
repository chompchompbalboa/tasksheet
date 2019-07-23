//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useState } from 'react'
import styled from 'styled-components'

import { ARROW_UP, ARROW_DOWN } from '@app/assets/icons'

import { SortUpdates } from '@app/state/sheet/actions'
import { Sort, Sorts } from '@app/state/sheet/types'

import Icon from '@/components/Icon'
import { SheetActionDropdownOption } from '@app/bundles/Sheet/SheetActionDropdown'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionSortSelectedOption = ({ 
  option,
  sorts,
  updateSort
}: SheetActionSortSelectedOptionProps) => {
    const sort = sorts.find(sort => sort.columnId === option.value)
    const [ sortOrder, setSortOrder ] = useState(sort ? sort.order : 'ASC')
    
    const handleOptionClick = (sort: Sort) => {
      const nextSortOrder = sort.order === 'ASC' ? 'DESC' : 'ASC'
      setSortOrder(nextSortOrder)
      window.setTimeout(() => updateSort(sort.id, { order: nextSortOrder }), 50)
    }
    
    return (
      <Container
        onClick={() => handleOptionClick(sort)}>
        <Icon icon={sortOrder === 'ASC' ? ARROW_UP : ARROW_DOWN} size="0.8rem"/>{option.label}
      </Container>
    )
  }

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetActionSortSelectedOptionProps {
  option: SheetActionDropdownOption
  sorts: Sorts
  updateSort(sortId: string, updates: SortUpdates): void
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
export default SheetActionSortSelectedOption