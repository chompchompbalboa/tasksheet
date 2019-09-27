//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useState } from 'react'
import styled from 'styled-components'

import { 
  ARROW_DOWN,
  ARROW_UP, 
} from '@app/assets/icons'

import { 
  ISheetSort, IAllSheetSorts, SheetSortUpdates 
} from '@app/state/sheet/types'

import Icon from '@/components/Icon'
import { SheetActionDropdownOption } from '@app/bundles/Sheet/SheetActionDropdown'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionSortSelectedOption = ({ 
  option,
  sorts,
  updateSheetSort
}: SheetActionSortSelectedOptionProps) => {
    const sort = sorts[option.value]
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
  sorts: IAllSheetSorts
  updateSheetSort(sortId: string, updates: SheetSortUpdates): void
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  cursor: ${ ({ isLocked }: ContainerProps ) => isLocked ? 'not-allowed' : 'pointer' };
  display: flex;
  align-items: center;
`
interface ContainerProps {
  isLocked: boolean
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetActionSortSelectedOption