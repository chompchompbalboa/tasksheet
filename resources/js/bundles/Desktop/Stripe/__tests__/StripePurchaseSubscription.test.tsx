//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { Elements, StripeProvider } from 'react-stripe-elements'

import { renderWithRedux } from '@/testing/library'
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
    global.Stripe = stripeMock
  })
  
  const settingsUserSubscriptionPurchaseSubscription = (monthlyOrLifetime: 'MONTHLY' | 'LIFETIME') => {
    const mockAppState = getMockAppStateByTasksheetSubscriptionType('TRIAL')
    const {
      queryByText
    } = renderWithRedux(
      <StripeProvider apiKey={mockEnvironment.stripeKey}>
        <Elements>
          <StripePurchaseSubscription
            monthlyOrLifetimeSubscription={monthlyOrLifetime}/>
        </Elements>
      </StripeProvider>
    , { store: createMockStore(mockAppState) })
    return {
      queryByText
    }
  }

  it("correctly displays the form to purchase a MONTHLY subscription", () => {
    const { queryByText } = settingsUserSubscriptionPurchaseSubscription('MONTHLY')
    expect(queryByText('Subscribe To Monthly Access')).toBeTruthy()
  })

  it("correctly displays the form to purchase a LIFETIME subscription", () => {
    const { queryByText } = settingsUserSubscriptionPurchaseSubscription('LIFETIME')
    expect(queryByText('Purchase Lifetime Access')).toBeTruthy()
  })

})
