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
      container,
      //debug,
      getByTestId,
      getByText,
      queryByText
    } = renderWithRedux(
      <StripePurchaseSubscription />, 
    { store: createMockStore(mockAppState) })
    const stripeForm = getByTestId('StripeForm')
    const selectMonthlySubscriptionType = getByText('Monthly')
    const selectLifetimeSubscriptionType = getByText('Lifetime')
    return {
      container,
      queryByText,
      selectMonthlySubscriptionType,
      selectLifetimeSubscriptionType,
      stripeForm
    }
  }
         
  it("correctly submits the Stripe form", async () => {
    // @ts-ignore
    axiosMock.post.mockResolvedValueOnce({})
    const { stripeForm } = stripePurchaseSubscription()
    fireEvent.submit(stripeForm)
  })

  it("displays the form to purchase a MONTHLY subscription when the user selects the MONTHLY option", () => {
    const { container, selectMonthlySubscriptionType } = stripePurchaseSubscription()
    selectMonthlySubscriptionType.click()
    expect(container.textContent).toContain('Subscribe To Monthly Access')
  })

  it("displays the form to purchase a LIFETIME subscription when the user selects the LIFETIME option", () => {
    const { container, selectLifetimeSubscriptionType } = stripePurchaseSubscription()
    selectLifetimeSubscriptionType.click()
    expect(container.textContent).toContain('Purchase Lifetime Access')
  })

})
