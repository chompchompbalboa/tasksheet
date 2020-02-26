//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const StripeAgreeToChargeCheckbox = ({
  checkboxValue,
  updateCheckboxValue,
  text
}: IStripeAgreeToChargeCheckbox) => {
  
  return (
    <Container>
      <CheckboxContainer>
        <StyledInput
          data-testid="StripeAgreeToChargeCheckbox"
          type='checkbox'
          checked={checkboxValue}
          onChange={e => updateCheckboxValue(e.target.checked)}/>
        <AgreeToChargeText>
          {text}
        </AgreeToChargeText>
      </CheckboxContainer>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface IStripeAgreeToChargeCheckbox {
  checkboxValue: boolean
  updateCheckboxValue(nextCheckboxValue: boolean): void
  text: string
}
//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
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

const AgreeToChargeText = styled.div``

export default StripeAgreeToChargeCheckbox
