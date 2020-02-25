//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import axiosMock from 'axios'

import { act, fireEvent, renderWithRedux } from '@/testing/library'
import { 
  createMockStore,
  getMockAppStateByTasksheetSubscriptionType,
  mockEnvironment,
  stripeMock
} from '@/testing/mocks'
import { flushPromises } from '@/testing/utils'

import StripePurchaseSubscription from '@desktop/Stripe/StripePurchaseSubscription'
import { stripeErrorMessages } from '@desktop/Stripe/StripeErrorMessage'

//-----------------------------------------------------------------------------
// Setup
//-----------------------------------------------------------------------------
// @ts-ignore
axiosMock.post.mockResolvedValue({})

//-----------------------------------------------------------------------------
// Tests
//-----------------------------------------------------------------------------
describe('StripePurchaseSubscription', () => {

  beforeAll(() => {
    // @ts-ignore
    global.environment = mockEnvironment
    // @ts-ignore
    global.Stripe = stripeMock
    jest.useFakeTimers()
  })

  afterAll(() => {
    jest.useRealTimers()
  })
  
  const stripePurchaseSubscription = () => {
    const mockAppState = getMockAppStateByTasksheetSubscriptionType('TRIAL')
    const {
      debug,
      container,
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
      debug,
      container,
      queryByText,
      selectMonthlySubscriptionType,
      selectLifetimeSubscriptionType,
      stripeForm
    }
  }

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
         
  it("attempts to create a Stripe SetupIntent when purchasing a MONTHLY subscription", () => {
    const { stripeForm } = stripePurchaseSubscription()
    fireEvent.submit(stripeForm)
    expect(stripeMock().confirmCardSetup).toHaveBeenCalled()
  })
         
  it("displays an error message if the Stripe SetupIntent is not created when purchasing a MONTHLY subscription", async () => {
    stripeMock().confirmCardSetup.mockResolvedValueOnce({
      setupIntent: null,
      error: { code: 'Any error code' }
    })
    const { container, stripeForm } = stripePurchaseSubscription()
    await act(async () => {
      fireEvent.submit(stripeForm)
      await flushPromises()
      jest.advanceTimersByTime(500)
    })
    expect(container.textContent).toContain(stripeErrorMessages.GENERIC_ERROR)
  })

})
