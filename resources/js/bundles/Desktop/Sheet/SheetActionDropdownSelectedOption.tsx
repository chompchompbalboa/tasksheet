//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { IAppState } from '@/state'

import { CLOSE, LOCK_CLOSED } from '@/assets/icons'

import Icon from '@/components/Icon'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionDropdownSelectedOption = ({
  children,
  isLocked,
  onOptionDelete,
  onOptionUpdate
}: SheetActionDropdownSelectedOptionProps) => {

  const userColorPrimary = useSelector((state: IAppState) => state.user.color.primary)

  return (
    <Container
      isLocked={isLocked}
      onDoubleClick={isLocked ? () => onOptionUpdate({ isLocked: !isLocked }) : () => null}
      optionBackgroundColor={userColorPrimary}>
      <Option>
        {children}
      </Option>
      <Delete
        isLocked={isLocked}
        onClick={isLocked ? () => null : () => onOptionDelete()}>
        <Icon
          icon={isLocked ? LOCK_CLOSED : CLOSE}
          size="0.75rem"/>
      </Delete>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetActionDropdownSelectedOptionProps {
  children?: any
  isLocked: boolean
  onOptionDelete?(...args: any[]): void
  onOptionUpdate?(...args: any[]): void
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  cursor: ${ ({ isLocked }: ContainerProps ) => isLocked ? 'not-allowed' : 'default' };
  padding: 0.1rem 0.25rem;
  margin-right: 0.25rem;
  background-color: ${ ({ optionBackgroundColor }: ContainerProps ) => optionBackgroundColor };
  color: white;
  border-radius: 4px;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  white-space: nowrap;
`
interface ContainerProps {
  isLocked: boolean
  optionBackgroundColor: string
}

const Option = styled.div`
  display: flex;
  align-items: center;
`

const Delete = styled.div`
  padding: 0.125rem;
  margin-left: 0.125rem;
  cursor: ${ ({ isLocked }: DeleteProps ) => isLocked ? 'not-allowed' : 'pointer' };
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0.5;
  &:hover {
    opacity: ${ ({ isLocked }: DeleteProps ) => isLocked ? '0.5' : '1' };
  }
`
interface DeleteProps {
  isLocked: boolean
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetActionDropdownSelectedOption

