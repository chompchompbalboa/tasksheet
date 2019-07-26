//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useState } from 'react'
import styled from 'styled-components'

import { ARROW_UP, ARROW_DOWN } from '@app/assets/icons'

import { SheetGroupUpdates } from '@app/state/sheet/actions'
import { SheetGroup, SheetGroups } from '@app/state/sheet/types'

import Icon from '@/components/Icon'
import { SheetActionDropdownOption } from '@app/bundles/Sheet/SheetActionDropdown'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionGroupSelectedOption = ({ 
  option,
  groups,
  updateSheetGroup
}: SheetActionGroupSelectedOptionProps) => {
    const group = groups.find(group => group.columnId === option.value)
    const [ groupOrder, setGroupOrder ] = useState(group ? group.order : 'ASC')
    
    const handleOptionClick = (group: SheetGroup) => {
      const nextGroupOrder = group.order === 'ASC' ? 'DESC' : 'ASC'
      setGroupOrder(nextGroupOrder)
      window.setTimeout(() => updateSheetGroup(group.id, { order: nextGroupOrder }), 50)
    }
    
    return (
      <Container
        onClick={() => handleOptionClick(group)}>
        <Icon icon={groupOrder === 'ASC' ? ARROW_UP : ARROW_DOWN} size="0.8rem"/>{option.label}
      </Container>
    )
  }

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetActionGroupSelectedOptionProps {
  option: SheetActionDropdownOption
  groups: SheetGroups
  updateSheetGroup(groupId: string, updates: SheetGroupUpdates): void
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
export default SheetActionGroupSelectedOption