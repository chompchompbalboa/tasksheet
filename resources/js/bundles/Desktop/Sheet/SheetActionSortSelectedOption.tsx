//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useState } from 'react'
import styled from 'styled-components'

import { 
  ARROW_DOWN,
  ARROW_UP, 
} from '@/assets/icons'

import { 
  ISheetSort, IAllSheetSorts, ISheetSortUpdates 
} from '@/state/sheet/types'

import Icon from '@/components/Icon'
import { SheetActionDropdownOption } from '@desktop/Sheet/SheetActionDropdown'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionSortSelectedOption = ({ 
  option,
  allSheetSorts,
  updateSheetSort
}: SheetActionSortSelectedOptionProps) => {

    const sort = allSheetSorts[option.value]
    const [ sortOrder, setSortOrder ] = useState(sort ? sort.order : 'ASC')
    
    const handleOptionClick = (sort: ISheetSort) => {
      if(!sort.isLocked) {
        const nextSortOrder = sort.order === 'ASC' ? 'DESC' : 'ASC'
        setSortOrder(nextSortOrder)
        window.setTimeout(() => updateSheetSort(sort.id, { order: nextSortOrder }), 50)
      }
    }
    
    return (
      <Container
        isLocked={sort && sort.isLocked}
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
  allSheetSorts: IAllSheetSorts
  updateSheetSort(sortId: string, updates: ISheetSortUpdates): void
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  cursor: ${ ({ isLocked }: ContainerProps ) => isLocked ? 'not-allowed' : 'pointer' };
  display: flex;
  align-items: center;
  white-space: nowrap;
`
interface ContainerProps {
  isLocked: boolean
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetActionSortSelectedOption