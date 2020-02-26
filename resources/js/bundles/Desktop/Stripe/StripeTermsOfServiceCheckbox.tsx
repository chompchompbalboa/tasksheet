//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import StripeTermsOfServiceText from '@desktop/Stripe/StripeTermsOfServiceText'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const StripeTermsAndConditionsCheckbox = ({
  checkboxValue,
  updateCheckboxValue
}: IStripeTermsAndConditionsCheckbox) => {
  
  const termsOfServiceContainer = useRef(null)
  
  const [ isTermsOfServiceVisible, setIsTermsOfServiceVisible ] = useState(false)
  
  useEffect(() => {
    if(isTermsOfServiceVisible) {
      window.addEventListener('mousedown', closeTermsOfServiceOnClickOutside)
    }
    else {
      window.removeEventListener('mousedown', closeTermsOfServiceOnClickOutside)
    }
    return () => {
      window.removeEventListener('mousedown', closeTermsOfServiceOnClickOutside)
    }
  })

  const closeTermsOfServiceOnClickOutside = (e: Event) => {
    if(!termsOfServiceContainer.current.contains(e.target)) {
      setIsTermsOfServiceVisible(false)
    }
  }
  
  return (
    <Container>
      <CheckboxContainer>
        <StyledInput
          data-testid="StripeTermsOfServiceCheckbox"
          type='checkbox'
          checked={checkboxValue}
          onChange={e => updateCheckboxValue(e.target.checked)}/>
        <AcceptTermsAndServiceText>
          I accept the&nbsp;
          <TermsOfServiceLink
            onClick={() => setIsTermsOfServiceVisible(!isTermsOfServiceVisible)}>
            Terms of Service
          </TermsOfServiceLink>
        </AcceptTermsAndServiceText>
      </CheckboxContainer>
      {isTermsOfServiceVisible && 
        <TermsOfServiceContainer
          ref={termsOfServiceContainer}>
          <StripeTermsOfServiceText />
        </TermsOfServiceContainer>
      }
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface IStripeTermsAndConditionsCheckbox {
  checkboxValue: boolean
  updateCheckboxValue(nextCheckboxValue: boolean): void
}
//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  z-index: 100;
  position: relative;
  margin: 0.5rem 0;
`

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
`

const StyledInput = styled.input`
  margin-right: 0.25rem;
`

const AcceptTermsAndServiceText = styled.div``

const TermsOfServiceLink = styled.span`
  cursor: pointer;
  font-weight: bold;
  opacity: 0.7;
  border-bottom: 1px dashed black;
  &:hover {
    opacity: 1;
  }
`

const TermsOfServiceContainer = styled.div`
  position: absolute;
  max-height: 40vh;
  min-width: 15rem;
  top: 100%;
  left: 0;
  padding: 0.5rem;
  border-radius: 3px;
  background-color: white;
  border: 1px solid rgb(150, 150, 150);
  box-shadow: 2px 2px 15px 0px rgba(0,0,0,0.3);
  overflow-y: scroll;
	scrollbar-width: none;
	-ms-overflow-style: none;
	&::-webkit-scrollbar {
		width: 0;
		height: 0;
	}
`

export default StripeTermsAndConditionsCheckbox
