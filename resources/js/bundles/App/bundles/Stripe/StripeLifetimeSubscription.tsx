//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { FormEvent, useState } from 'react'

import StripeCardInput from '@app/bundles/Stripe/StripeCardInput'
import StripeForm from '@app/bundles/Stripe/StripeForm'
import StripeSubmitButton from '@app/bundles/Stripe/StripeSubmitButton'
import StripeTermsOfServiceCheckbox from '@app/bundles/Stripe/StripeTermsOfServiceCheckbox'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const StripeLifetimeSubscription = () => { 
  
  const [ termsOfServiceCheckboxValue, setTermsOfServiceCheckboxValue ] = useState(false)
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    console.log('handleSubmit')
  }
  
  return (
    <StripeForm 
      onSubmit={handleSubmit}>
      <StripeCardInput />
      <StripeTermsOfServiceCheckbox
        checkboxValue={termsOfServiceCheckboxValue}
        updateCheckboxValue={setTermsOfServiceCheckboxValue}/>
      <StripeSubmitButton 
        isDisabled={!termsOfServiceCheckboxValue}
        text="Purchase Lifetime Access"/>
    </StripeForm>
  )
}

export default StripeLifetimeSubscription
