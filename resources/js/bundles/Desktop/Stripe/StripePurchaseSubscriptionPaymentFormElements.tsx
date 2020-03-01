//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { FormEvent, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useElements, useStripe } from '@stripe/react-stripe-js'

import { action } from '@/api'
import { IAppState } from '@/state'
import { 
  IUserTasksheetSubscription,
  ITasksheetSubscriptionPlan
} from '@/state/user/types'
import {
  updateUserTasksheetSubscription
} from '@/state/user/actions'

import StripeAgreeToChargeCheckbox from '@desktop/Stripe/StripeAgreeToChargeCheckbox'
import StripeCardInput from '@desktop/Stripe/StripeCardInput'
import StripeErrorMessage, { IStripeError } from '@desktop/Stripe/StripeErrorMessage'
import StripeForm from '@desktop/Stripe/StripeForm'
import StripeSubmitButton from '@desktop/Stripe/StripeSubmitButton'
import StripeTermsOfServiceCheckbox from '@desktop/Stripe/StripeTermsOfServiceCheckbox'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const StripePurchaseSubscriptionPaymentFormElements = ({
  subscriptionPlan
}: IStripePurchaseSubscriptionPaymentFormElements) => { 
  
  // Stripe
  const stripeElements = useElements()
  const stripe = useStripe()

  // Redux
  const dispatch = useDispatch()
  const userId = useSelector((state: IAppState) => state.user.id)
  const userSubscriptionStripePaymentIntentClientSecret = useSelector((state: IAppState) => state.user.tasksheetSubscription.stripeSetupIntentClientSecret)
  
  // State
  const [ isChargeAgreedTo, setIsChargeAgreedTo ] = useState(false)
  const [ isTermsOfServiceAccepted, setIsTermsOfServiceAccepted ] = useState(false)
  const [ isChargeBeingProcessed, setIsChargeBeingProcessed ] = useState(false)
  const [ stripeError, setStripeError] = useState(null as IStripeError)

  // Effects
  useEffect(() => {
    setIsChargeAgreedTo(false)
    setStripeError(null)
  }, [ subscriptionPlan ])
  
  // Handle Submit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if(isChargeAgreedTo && isTermsOfServiceAccepted) {
      setStripeError(null)
      setIsChargeBeingProcessed(true)

      const cardNumberElement = stripeElements.getElement('cardNumber')
      // Purchase a monthly susbcription
      if(subscriptionPlan === 'MONTHLY') {
        // Get the Stripe setupIntent
        const { setupIntent, error } = await stripe.confirmCardSetup(userSubscriptionStripePaymentIntentClientSecret, {
          payment_method: {
            card: cardNumberElement,
          }
        })
        if(error) {
          setTimeout(() => {
            setStripeError(error as IStripeError)
            setIsChargeBeingProcessed(false)
          }, 500)
        }
        else {
          // Send the setupIntent to the backend to process the subscription
          action.userSubscriptionPurchaseMonthly(userId, setupIntent.payment_method)
            .then(response => {
              const nextUserSubscription = response.data as IUserTasksheetSubscription
              dispatch(updateUserTasksheetSubscription({ 
                type: 'MONTHLY', 
                billingDayOfMonth: nextUserSubscription.billingDayOfMonth,
                subscriptionStartDate: nextUserSubscription.subscriptionStartDate,
                subscriptionEndDate: nextUserSubscription.subscriptionEndDate
              }))
            })
            .catch(() => {
              setIsChargeBeingProcessed(false)
              setStripeError({ code: 'error', message: null }) // This will display a generic error message in StripeErrorMessage
            })
        }
      }
      // Purchase a lifetime subscription
      if(subscriptionPlan === 'LIFETIME') {
        // Get the Stripe paymentMethod
        const { paymentMethod, error } = await stripe.createPaymentMethod({
          type: 'card',
          card: cardNumberElement
        })
        if(error) {
          setTimeout(() => {
            setStripeError(error as IStripeError)
            setIsChargeBeingProcessed(false)
          }, 500)
        }
        else {
          // Send the payment method to the backend to be processed
          action.userSubscriptionPurchaseLifetime(userId, paymentMethod.id)
            .then(response => {
              const nextUserSubscription = response.data as IUserTasksheetSubscription
              dispatch(updateUserTasksheetSubscription({ 
                type: 'LIFETIME', 
                billingDayOfMonth: nextUserSubscription.billingDayOfMonth,
                subscriptionStartDate: nextUserSubscription.subscriptionStartDate,
                subscriptionEndDate: nextUserSubscription.subscriptionEndDate
              }))
            })
            .catch(() => {
              setIsChargeBeingProcessed(false)
              setStripeError({ code: 'error', message: null }) // This will display a generic error message in StripeErrorMessage
            })
        }
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
          text={text[subscriptionPlan].agreeToCharge}/>
        <StripeSubmitButton 
          isDisabled={!isChargeAgreedTo || !isTermsOfServiceAccepted}
          text={isChargeBeingProcessed ? 'Processing...' : text[subscriptionPlan].submitButton}/>
        <StripeErrorMessage
          error={stripeError}/>
      </StripeForm>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface IStripePurchaseSubscriptionPaymentFormElements {
  subscriptionPlan: ITasksheetSubscriptionPlan
}

export default StripePurchaseSubscriptionPaymentFormElements
