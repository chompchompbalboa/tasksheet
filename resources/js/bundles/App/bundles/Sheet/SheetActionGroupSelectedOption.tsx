//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useState } from 'react'
import styled from 'styled-components'

import { ARROW_UP, ARROW_DOWN } from '@app/assets/icons'

import { ISheetGroup, IAllSheetGroups, ISheetGroupUpdates } from '@app/state/sheet/types'

import Icon from '@/components/Icon'
import { SheetActionDropdownOption } from '@app/bundles/Sheet/SheetActionDropdown'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionGroupSelectedOption = ({ 
  option,
  groups,
  updateSheetGroup
}: ISheetActionGroupSelectedOptionProps) => {
  
    const group = groups[option.value]
    const [ groupOrder, setGroupOrder ] = useState(group ? group.order : 'ASC')
    
    const handleOptionClick = (group: ISheetGroup) => {
      if(!group.isLocked) {
        const nextGroupOrder = group.order === 'ASC' ? 'DESC' : 'ASC'
        setGroupOrder(nextGroupOrder)
        window.setTimeout(() => updateSheetGroup(group.id, { order: nextGroupOrder }), 50)
      }
    }
    
    return (
      <Container
        isLocked={group && group.isLocked}
        onClick={() => handleOptionClick(group)}>
        <Icon icon={groupOrder === 'ASC' ? ARROW_UP : ARROW_DOWN} size="0.8rem"/>{option.label}
      </Container>
    )
  }

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface ISheetActionGroupSelectedOptionProps {
  option: SheetActionDropdownOption
  groups: IAllSheetGroups
  updateSheetGroup(groupId: string, updates: ISheetGroupUpdates): void
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
export default SheetActionGroupSelectedOption