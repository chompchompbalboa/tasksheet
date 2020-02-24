//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { Elements, StripeProvider } from 'react-stripe-elements'

import { fireEvent, renderWithRedux } from '@/testing/library'
import { 
  createMockStore,
  getMockAppStateByTasksheetSubscriptionType,
  mockEnvironment,
  stripeMock
} from '@/testing/mocks'

import StripePurchaseSubscription from '@desktop/Stripe/StripePurchaseSubscription'

//-----------------------------------------------------------------------------
// Tests
//-----------------------------------------------------------------------------
// A note on these tests:
// react-stripe-elements doesn't provide access to the invididual inputs (in
// production, I believe they are rendered server-side - regardless, all I 
// was able to get while writing the tests was an empty <div>). Therefore,
// we need to trust that the inputs work correctly and instead focus on 
// testing the app's response to Stripe's success / error codes.
describe('StripePurchaseSubscription', () => {

  beforeAll(() => {
    // @ts-ignore
    global.Stripe = stripeMock
  })
  
  const stripePurchaseSubscription = (monthlyOrLifetime: 'MONTHLY' | 'LIFETIME') => {
    const mockAppState = getMockAppStateByTasksheetSubscriptionType('TRIAL')
    const {
      //container,
      //debug,
      getByTestId,
      queryByText
    } = renderWithRedux(
      <StripeProvider apiKey={mockEnvironment.stripeKey}>
        <Elements>
          <StripePurchaseSubscription
            monthlyOrLifetimeSubscription={monthlyOrLifetime}/>
        </Elements>
      </StripeProvider>
    , { store: createMockStore(mockAppState) })
    const stripeForm = getByTestId('StripeForm')
    return {
      queryByText,
      stripeForm
    }
  }

  it("correctly displays the form to purchase a MONTHLY subscription", () => {
    const { queryByText } = stripePurchaseSubscription('MONTHLY')
    expect(queryByText('Subscribe To Monthly Access')).toBeTruthy()
  })

  it("correctly displays the form to purchase a LIFETIME subscription", () => {
    const { queryByText } = stripePurchaseSubscription('LIFETIME')
    expect(queryByText('Purchase Lifetime Access')).toBeTruthy()
  })

  it("correctly submits the Stripe form", () => {
    const { stripeForm } = stripePurchaseSubscription('LIFETIME')
    fireEvent.submit(stripeForm)
  })

})
