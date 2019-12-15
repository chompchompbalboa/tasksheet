//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { FormEvent, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { injectStripe } from 'react-stripe-elements'
import styled from 'styled-components'

import { action } from '@app/api'
import { IAppState } from '@app/state'
import { IUserSubscription } from '@app/state/user/types'
import {
  updateUserSubscription
} from '@app/state/user/actions'

import StripeAgreeToChargeCheckbox from '@app/bundles/Stripe/StripeAgreeToChargeCheckbox'
import StripeCardInput from '@app/bundles/Stripe/StripeCardInput'
import StripeForm from '@app/bundles/Stripe/StripeForm'
import StripeSubmitButton from '@app/bundles/Stripe/StripeSubmitButton'
import StripeTermsOfServiceCheckbox from '@app/bundles/Stripe/StripeTermsOfServiceCheckbox'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const StripePurchaseSubscription = ({
  elements: stripeElements,
  monthlyOrLifetimeSubscription,
  stripe
}: IStripePurchaseSubscription) => { 

  const dispatch = useDispatch()
  const userId = useSelector((state: IAppState) => state.user.id)
  
  const [ isChargeAgreedTo, setIsChargeAgreedTo ] = useState(false)
  const [ isTermsOfServiceAccepted, setIsTermsOfServiceAccepted ] = useState(false)
  const [ isChargeBeingProcessed, setIsChargeBeingProcessed ] = useState(false)
  const [ stripeErrorMessage, setStripeErrorMessage] = useState(null)
  
  useEffect(() => {
    setIsChargeAgreedTo(false)
    setStripeErrorMessage(null)
  }, [ monthlyOrLifetimeSubscription ])
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setStripeErrorMessage(null)
    setIsChargeBeingProcessed(true)
    if(monthlyOrLifetimeSubscription === 'MONTHLY') {
      console.log('handleSubmit: MONTHLY')
    }
    if(monthlyOrLifetimeSubscription === 'LIFETIME') {
      const cardNumberElement = stripeElements.getElement('cardNumber')
      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardNumberElement
      })
      if(error) {
        setTimeout(() => {
          setStripeErrorMessage(error.message)
          setIsChargeBeingProcessed(false)
        }, 350)
      }
      else {
        action.userSubscriptionPurchaseLifetime(userId, paymentMethod.id).then(response => {
          if(response.status === 500) {
            setIsChargeBeingProcessed(false)
            setStripeErrorMessage(response.data.message || 'We were unable to process your card. Please try again.')
          }
          else {
            const nextUserSubscription = response.data as IUserSubscription
            dispatch(updateUserSubscription({ 
              type: nextUserSubscription.type, 
              startDate: nextUserSubscription.startDate,
              endDate: nextUserSubscription.endDate
            }))
          }
        })
      }
    }
  }
  
  const text = {
    MONTHLY: {
      agreeToCharge: "I agree to be charged $5 on the 1st of each month",
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
        text={isChargeBeingProcessed ? 'Processing...' : text[monthlyOrLifetimeSubscription].submitButton}/>
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
