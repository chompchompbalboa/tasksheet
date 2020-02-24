//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import axiosMock from 'axios'

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
// react-stripe-elements doesn't provide access to the invididual inputs (all I 
// was able to get while writing the tests was an empty <div>). Therefore, we 
// need to trust that the inputs work correctly and instead focus on testing the 
// app's response to Stripe's success / error codes.
describe('StripePurchaseSubscription', () => {

  beforeAll(() => {
    // @ts-ignore
    global.environment = mockEnvironment
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
      <StripePurchaseSubscription />, 
    { store: createMockStore(mockAppState) })
    const stripeForm = getByTestId('StripeForm')
    return {
      queryByText,
      stripeForm
    }
  }
         
  it("correctly submits the Stripe form", async () => {
    // @ts-ignore
    axiosMock.post.mockResolvedValueOnce({})
    const { stripeForm } = stripePurchaseSubscription('LIFETIME')
    fireEvent.submit(stripeForm)
  })

})
