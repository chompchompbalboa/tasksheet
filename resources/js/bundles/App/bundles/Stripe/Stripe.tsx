//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useSelector } from 'react-redux'
import { injectStripe, CardElement } from 'react-stripe-elements'
import styled from 'styled-components'

import { IAppState } from '@app/state'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const Stripe = () => { 
  
  const userColorPrimary = useSelector((state: IAppState) => state.user.color.primary)
  
  const handleSubmit = () => {
    console.log('handleSubmit')
  }
  
  const createOptions = () => {
    return {
      style: {
        base: {
          fontSize: '16px',
          color: '#424770',
          fontFamily: 'Open Sans, sans-serif',
          letterSpacing: '0.025em',
          backgroundColor: 'white',
          '::placeholder': {
            color: '#aab7c4',
          }
        },
        invalid: {
          color: '#c23d4b',
        },
      }
    }
  };
  
  return (
    <Container>
      <StyledForm onSubmit={handleSubmit}>
        <CardElement
          onChange={() => null}
          {...createOptions()}/>
        <StyledButton
          userColorPrimary={userColorPrimary}>
          Purchase
        </StyledButton>
      </StyledForm>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  min-width: 20rem;
`

const StyledForm = styled.form``

const StyledButton = styled.button`
  cursor: pointer;
  margin-top: 0.5rem;
  min-width: 6rem;
  padding: 0.5rem;
  white-space: nowrap;
  border: 1px solid rgb(150, 150, 150);
  outline: 0;
  background-color:${ ({ userColorPrimary }: IStyledButton) => userColorPrimary };
  color: white;
  border-radius: 4px;
  text-decoration: none;
  transition: all 0.15s;
  opacity: 1;
  &:hover {
    background-color: rgb(0, 150, 25);
    border: 1px solid rgb(0, 150, 25);
  }
`
interface IStyledButton {
  userColorPrimary: string
}

export default injectStripe(Stripe)
