//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { IAppState } from '@/state'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SettingsButton = ({
  testId = "SettingsButton",
  children,
  className,
  backgroundColorHover = 'rgb(0, 150, 25)',
  isDisabled = false,
  onClick,
  text
}: ISettingsButton) => { 
  
  const userColorPrimary = useSelector((state: IAppState) => state.user.color.primary)
  
  return (
    <StyledButton
      data-testid={testId}
      backgroundColorHover={backgroundColorHover}
      className={className}
      disabled={isDisabled}
      isDisabled={isDisabled}
      onClick={onClick}
      userColorPrimary={userColorPrimary}>
      {text || children}
    </StyledButton>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface ISettingsButton {
  testId?: string
  backgroundColorHover?: string
  children?: any
  className?: string
  isDisabled?: boolean
  onClick?(...args: any): void
  text?: string
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const StyledButton = styled.button`
  cursor: ${ ({ isDisabled }: IStyledButton) => isDisabled ? 'not-allowed' : 'pointer' };
  padding: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
  border: 1px solid rgb(150, 150, 150);
  outline: 0;
  background-color: ${ ({ isDisabled, userColorPrimary }: IStyledButton) => isDisabled ? 'rgb(175, 175, 175)' : userColorPrimary };
  color: white;
  font-size: 0.8rem;
  border-radius: 5px;
  text-decoration: none;
  transition: all 0.15s;
  opacity: 1;
  &:hover {
    background-color: ${ ({ backgroundColorHover, isDisabled }: IStyledButton) => isDisabled ? 'rgb(175, 175, 175)' : backgroundColorHover };
    border: ${ ({ backgroundColorHover, isDisabled }: IStyledButton) => isDisabled ? '1px solid rgb(150, 150, 150)' : '1px solid ' + backgroundColorHover };
  }
`
interface IStyledButton {
  backgroundColorHover: string
  isDisabled: boolean
  userColorPrimary: string
}

export default SettingsButton
