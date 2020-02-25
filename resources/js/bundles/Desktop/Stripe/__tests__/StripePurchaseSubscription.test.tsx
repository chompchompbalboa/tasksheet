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
describe('StripePurchaseSubscription', () => {

  beforeAll(() => {
    // @ts-ignore
    global.environment = mockEnvironment
    // @ts-ignore
    global.Stripe = stripeMock
  })
  
  const stripePurchaseSubscription = () => {
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
    const { stripeForm } = stripePurchaseSubscription()
    fireEvent.submit(stripeForm)
  })

})
