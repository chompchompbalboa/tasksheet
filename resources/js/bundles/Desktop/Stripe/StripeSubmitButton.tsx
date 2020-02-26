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
const StripeSubmitButton = ({
  isDisabled,
  text
}: IStripeSubmitButton) => { 
  
  const userColorPrimary = useSelector((state: IAppState) => state.user.color.primary)
  
  return (
    <StyledButton
      data-testid="StripeSubmitButton"
      disabled={isDisabled}
      isDisabled={isDisabled}
      userColorPrimary={userColorPrimary}>
      {text}
    </StyledButton>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface IStripeSubmitButton {
  isDisabled: boolean
  text: string
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const StyledButton = styled.button`
  cursor: ${ ({ isDisabled }: IStyledButton) => isDisabled ? 'not-allowed' : 'pointer' };
  min-width: 6rem;
  padding: 0.5rem;
  white-space: nowrap;
  border: 1px solid rgb(150, 150, 150);
  outline: 0;
  background-color: ${ ({ isDisabled, userColorPrimary }: IStyledButton) => isDisabled ? 'rgb(175, 175, 175)' : userColorPrimary };
  color: white;
  font-size: 0.85rem;
  border-radius: 4px;
  text-decoration: none;
  transition: all 0.15s;
  opacity: 1;
  &:hover {
    background-color: ${ ({ isDisabled }: IStyledButton) => isDisabled ? 'rgb(175, 175, 175)' : 'rgb(0, 150, 25)' };
    border: ${ ({ isDisabled }: IStyledButton) => isDisabled ? '1px solid rgb(150, 150, 150)' : '1px solid rgb(0, 150, 25)' };
  }
`
interface IStyledButton {
  isDisabled: boolean
  userColorPrimary: string
}

export default StripeSubmitButton
