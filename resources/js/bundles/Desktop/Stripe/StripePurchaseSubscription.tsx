//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { FormEvent, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { injectStripe } from 'react-stripe-elements'
import styled from 'styled-components'

import { action } from '@/api'
import { IAppState } from '@/state'
import { IUserSortsheetSubscription } from '@/state/user/types'
import {
  updateUserSortsheetSubscription
} from '@/state/user/actions'

import StripeAgreeToChargeCheckbox from '@desktop/Stripe/StripeAgreeToChargeCheckbox'
import StripeCardInput from '@desktop/Stripe/StripeCardInput'
import StripeForm from '@desktop/Stripe/StripeForm'
import StripeSubmitButton from '@desktop/Stripe/StripeSubmitButton'
import StripeTermsOfServiceCheckbox from '@desktop/Stripe/StripeTermsOfServiceCheckbox'

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
  const userSubscriptionStripePaymentIntentClientSecret = useSelector((state: IAppState) => state.user.sortsheetSubscription.stripeSetupIntentClientSecret)
  
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
    const cardNumberElement = stripeElements.getElement('cardNumber')
    // Purchase a monthly susbcription
    if(monthlyOrLifetimeSubscription === 'MONTHLY') {
      // Get the Stripe setupIntent
      const { setupIntent, error } = await stripe.confirmCardSetup(userSubscriptionStripePaymentIntentClientSecret, {
        payment_method: {
          card: cardNumberElement,
        }
      })
      if(error) {
        setTimeout(() => {
          setStripeErrorMessage(error.message)
          setIsChargeBeingProcessed(false)
        }, 350)
      }
      else {
        // Send the setupIntent to the backend to process the subscription
        action.userSubscriptionPurchaseMonthly(userId, setupIntent.payment_method).then(response => {
          const error = response.status === 500
          if(error) {
            setIsChargeBeingProcessed(false)
            setStripeErrorMessage(response.data.message || 'We were unable to process your card. Please try again.')
          }
          else {
            dispatch(updateUserSortsheetSubscription({ type: 'MONTHLY' }))
          }
        })
      }
    }
    // Purchase a lifetime subscription
    if(monthlyOrLifetimeSubscription === 'LIFETIME') {
      // Get the Stripe paymentMethod
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
        // Send the payment method to the backend to be processed
        action.userSubscriptionPurchaseLifetime(userId, paymentMethod.id).then(response => {
          const error = response.status === 500
          if(error) {
            setIsChargeBeingProcessed(false)
            setStripeErrorMessage(response.data.message || 'We were unable to process your card. Please try again.')
          }
          // If the purchase is successful, update the user subscription
          else {
            const nextUserSubscription = response.data as IUserSortsheetSubscription
            dispatch(updateUserSortsheetSubscription({ 
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
      agreeToCharge: "I agree to be charged $5 each month",
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
