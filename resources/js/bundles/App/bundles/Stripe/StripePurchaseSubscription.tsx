//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { FormEvent, useEffect, useState } from 'react'
import { injectStripe } from 'react-stripe-elements'
import styled from 'styled-components'

import StripeCardInput from '@app/bundles/Stripe/StripeCardInput'
import StripeForm from '@app/bundles/Stripe/StripeForm'
import StripeSubmitButton from '@app/bundles/Stripe/StripeSubmitButton'
import StripeAgreeToChargeCheckbox from '@app/bundles/Stripe/StripeAgreeToChargeCheckbox'
import StripeTermsOfServiceCheckbox from '@app/bundles/Stripe/StripeTermsOfServiceCheckbox'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const StripePurchaseSubscription = ({
  elements: stripeElements,
  monthlyOrLifetimeSubscription,
  stripe
}: IStripePurchaseSubscription) => { 
  
  const [ isChargeAgreedTo, setIsChargeAgreedTo ] = useState(false)
  const [ isTermsOfServiceAccepted, setIsTermsOfServiceAccepted ] = useState(false)
  const [ stripeErrorMessage, setStripeErrorMessage] = useState(null)
  
  useEffect(() => {
    setIsChargeAgreedTo(false)
  }, [ monthlyOrLifetimeSubscription ])
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if(monthlyOrLifetimeSubscription === 'MONTHLY') {
      console.log('handleSubmit: MONTHLY')
    }
    if(monthlyOrLifetimeSubscription === 'LIFETIME') {
      setStripeErrorMessage(null)
      const cardNumberElement = stripeElements.getElement('cardNumber')
      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardNumberElement
      })
      if(error) {
        setStripeErrorMessage(error.message)
      }
      else {
        console.log(paymentMethod)
      }
    }
  }
  
  const text = {
    MONTHLY: {
      agreeToCharge: "I agree to be charged $5 on the 1st of every month",
      submitButton: "Subscribe To Monthly Access"
    },
    LIFETIME: {
      agreeToCharge: "I agree to be charged $100 immediately",
      submitButton: "Purchase Lifetime Access"
    }
  }
  
  return (
    <StripeForm 
      onSubmit={handleSubmit}>
      <StripeCardInput />
      <StripeTermsOfServiceCheckbox
        checkboxValue={isTermsOfServiceAccepted}
        updateCheckboxValue={setIsTermsOfServiceAccepted}/>
      <StripeAgreeToChargeCheckbox
        checkboxValue={isChargeAgreedTo}
        updateCheckboxValue={setIsChargeAgreedTo}
        text={text[monthlyOrLifetimeSubscription].agreeToCharge}/>
      <StripeSubmitButton 
        isDisabled={!isChargeAgreedTo || !isTermsOfServiceAccepted}
        text={text[monthlyOrLifetimeSubscription].submitButton}/>
      {stripeErrorMessage && 
        <StripeErrorMessage>
          {stripeErrorMessage}
        </StripeErrorMessage>
      }
    </StripeForm>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface IStripePurchaseSubscription {
  monthlyOrLifetimeSubscription: 'MONTHLY' | 'LIFETIME'
  stripe?: any // TODO: Stripe's type definitions are unuseable as-is. Contribute the needed changes or write my own definitions.
  elements?: any // TODO: Stripe's type definitions are unuseable as-is. Contribute the needed changes or write my own definitions.
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const StripeErrorMessage = styled.div`
  color: rgb(150, 0, 0);
`

export default injectStripe(StripePurchaseSubscription)
