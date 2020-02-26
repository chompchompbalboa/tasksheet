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
import { stripeGenericErrorMessage } from '@desktop/Stripe/StripeErrorMessage'

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
      container,
      getByTestId,
      getByText,
      queryByText,
      store: {
        getState
      }
    } = renderWithRedux(
      <StripePurchaseSubscription />, 
    { store: createMockStore(mockAppState) })
    const stripeForm = getByTestId('StripeForm')
    const stripeSubmitButton = getByTestId('StripeSubmitButton')
    const stripeAgreeToChargeCheckbox = getByTestId('StripeAgreeToChargeCheckbox')
    const stripeTermsOfServiceCheckbox = getByTestId('StripeTermsOfServiceCheckbox')
    const selectMonthlySubscriptionType = getByText('Monthly')
    const selectLifetimeSubscriptionType = getByText('Lifetime')
    return {
      container,
      getState,
      queryByText,
      selectMonthlySubscriptionType,
      selectLifetimeSubscriptionType,
      stripeAgreeToChargeCheckbox,
      stripeForm,
      stripeSubmitButton,
      stripeTermsOfServiceCheckbox
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
         
  it("prevents the user from submitting the form if they haven't agreed to the Terms of Service", () => {
    const { stripeAgreeToChargeCheckbox, stripeForm, stripeSubmitButton } = stripePurchaseSubscription()
    fireEvent.click(stripeAgreeToChargeCheckbox)
    fireEvent.submit(stripeForm)
    expect(stripeSubmitButton.textContent).not.toContain('Processing...')
  })
         
  it("prevents the user from submitting the form if they haven't agreed to the charge", () => {
    const { stripeTermsOfServiceCheckbox, stripeForm, stripeSubmitButton } = stripePurchaseSubscription()
    fireEvent.click(stripeTermsOfServiceCheckbox)
    fireEvent.submit(stripeForm)
    expect(stripeSubmitButton.textContent).not.toContain('Processing...')
  })
         
  it("submits the form if the user has agreed to the Terms of Service and agreed to the charge", () => {
    const { stripeAgreeToChargeCheckbox, stripeTermsOfServiceCheckbox, stripeForm, stripeSubmitButton } = stripePurchaseSubscription()
    fireEvent.click(stripeTermsOfServiceCheckbox)
    fireEvent.click(stripeAgreeToChargeCheckbox)
    fireEvent.submit(stripeForm)
    expect(stripeSubmitButton.textContent).toContain('Processing...')
  })
         
  it("attempts to create a Stripe SetupIntent when purchasing a MONTHLY subscription", () => {
    const { selectMonthlySubscriptionType, stripeAgreeToChargeCheckbox, stripeTermsOfServiceCheckbox, stripeForm } = stripePurchaseSubscription()
    fireEvent.click(selectMonthlySubscriptionType)
    fireEvent.click(stripeTermsOfServiceCheckbox)
    fireEvent.click(stripeAgreeToChargeCheckbox)
    fireEvent.submit(stripeForm)
    expect(stripeMock().confirmCardSetup).toHaveBeenCalled()
  })
         
  it("displays a generic error message if the Stripe SetupIntent is not created when purchasing a MONTHLY subscription", async () => {
    const { container, selectMonthlySubscriptionType, stripeAgreeToChargeCheckbox, stripeTermsOfServiceCheckbox, stripeForm } = stripePurchaseSubscription()
    stripeMock().confirmCardSetup.mockResolvedValueOnce({
      setupIntent: null,
      error: { code: 'Any error code' }
    })
    fireEvent.click(selectMonthlySubscriptionType)
    fireEvent.click(stripeTermsOfServiceCheckbox)
    fireEvent.click(stripeAgreeToChargeCheckbox)
    await act(async () => {
      fireEvent.submit(stripeForm)
      await flushPromises()
      jest.advanceTimersByTime(500)
    })
    expect(container.textContent).toContain(stripeGenericErrorMessage)
  })
         
  it("displays the correct error message if the Stripe SetupIntent returns a 'card_declined' code when purchasing a MONTHLY subscription", async () => {
    const { container, selectMonthlySubscriptionType, stripeAgreeToChargeCheckbox, stripeTermsOfServiceCheckbox, stripeForm } = stripePurchaseSubscription()
    const error = {
      code: 'card_declined',
      message: 'Your card was declined.'
    }
    stripeMock().confirmCardSetup.mockResolvedValueOnce({
      setupIntent: null,
      error: error
    })
    fireEvent.click(selectMonthlySubscriptionType)
    fireEvent.click(stripeTermsOfServiceCheckbox)
    fireEvent.click(stripeAgreeToChargeCheckbox)
    await act(async () => {
      fireEvent.submit(stripeForm)
      await flushPromises()
      jest.advanceTimersByTime(500)
    })
    expect(container.textContent).toContain(error.message)
  })
  
  it("displays the correct error message if the Stripe SetupIntent returns an 'expired_card' code when purchasing a MONTHLY subscription", async () => {
    const { container, selectMonthlySubscriptionType, stripeAgreeToChargeCheckbox, stripeTermsOfServiceCheckbox, stripeForm } = stripePurchaseSubscription()
    const error = {
      code: 'expired_card',
      message: 'Your card is expired.'
    }
    stripeMock().confirmCardSetup.mockResolvedValueOnce({
      setupIntent: null,
      error: error
    })
    fireEvent.click(selectMonthlySubscriptionType)
    fireEvent.click(stripeTermsOfServiceCheckbox)
    fireEvent.click(stripeAgreeToChargeCheckbox)
    await act(async () => {
      fireEvent.submit(stripeForm)
      await flushPromises()
      jest.advanceTimersByTime(500)
    })
    expect(container.textContent).toContain(error.message)
  })
  
  it("displays the correct error message if the Stripe SetupIntent returns an 'incomplete_cvc' code when purchasing a MONTHLY subscription", async () => {
    const { container, selectMonthlySubscriptionType, stripeAgreeToChargeCheckbox, stripeTermsOfServiceCheckbox, stripeForm } = stripePurchaseSubscription()
    const error = {
      code: 'incomplete_cvc',
      message: 'Your CVC is not complete'
    }
    stripeMock().confirmCardSetup.mockResolvedValueOnce({
      setupIntent: null,
      error: error
    })
    fireEvent.click(selectMonthlySubscriptionType)
    fireEvent.click(stripeTermsOfServiceCheckbox)
    fireEvent.click(stripeAgreeToChargeCheckbox)
    await act(async () => {
      fireEvent.submit(stripeForm)
      await flushPromises()
      jest.advanceTimersByTime(500)
    })
    expect(container.textContent).toContain(error.message)
  })
  
  it("displays the correct error message if the Stripe SetupIntent returns an 'incomplete_expiry' code when purchasing a MONTHLY subscription", async () => {
    const { container, selectMonthlySubscriptionType, stripeAgreeToChargeCheckbox, stripeTermsOfServiceCheckbox, stripeForm } = stripePurchaseSubscription()
    const error = {
      code: 'incomplete_expiry',
      message: 'Your expiration date is not complete'
    }
    stripeMock().confirmCardSetup.mockResolvedValueOnce({
      setupIntent: null,
      error: error
    })
    fireEvent.click(selectMonthlySubscriptionType)
    fireEvent.click(stripeTermsOfServiceCheckbox)
    fireEvent.click(stripeAgreeToChargeCheckbox)
    await act(async () => {
      fireEvent.submit(stripeForm)
      await flushPromises()
      jest.advanceTimersByTime(500)
    })
    expect(container.textContent).toContain(error.message)
  })
  
  it("displays the correct error message if the Stripe SetupIntent returns an 'incomplete_number' code when purchasing a MONTHLY subscription", async () => {
    const { container, selectMonthlySubscriptionType, stripeAgreeToChargeCheckbox, stripeTermsOfServiceCheckbox, stripeForm } = stripePurchaseSubscription()
    const error = {
      code: 'incomplete_number',
      message: 'Your card number is not complete'
    }
    stripeMock().confirmCardSetup.mockResolvedValueOnce({
      setupIntent: null,
      error: error
    })
    fireEvent.click(selectMonthlySubscriptionType)
    fireEvent.click(stripeTermsOfServiceCheckbox)
    fireEvent.click(stripeAgreeToChargeCheckbox)
    await act(async () => {
      fireEvent.submit(stripeForm)
      await flushPromises()
      jest.advanceTimersByTime(500)
    })
    expect(container.textContent).toContain(error.message)
  })
  
  it("displays the correct error message if the Stripe SetupIntent returns an 'incorrect_cvc' code when purchasing a MONTHLY subscription", async () => {
    const { container, selectMonthlySubscriptionType, stripeAgreeToChargeCheckbox, stripeTermsOfServiceCheckbox, stripeForm } = stripePurchaseSubscription()
    const error = {
      code: 'incorrect_cvc',
      message: 'Your CVC is not correct'
    }
    stripeMock().confirmCardSetup.mockResolvedValueOnce({
      setupIntent: null,
      error: error
    })
    fireEvent.click(selectMonthlySubscriptionType)
    fireEvent.click(stripeTermsOfServiceCheckbox)
    fireEvent.click(stripeAgreeToChargeCheckbox)
    await act(async () => {
      fireEvent.submit(stripeForm)
      await flushPromises()
      jest.advanceTimersByTime(500)
    })
    expect(container.textContent).toContain(error.message)
  })
  
  it("attempts to send a successfully created Stripe SetupIntent to the back end when purchasing a MONTHLY subscription", async () => {
    const { getState, selectMonthlySubscriptionType, stripeAgreeToChargeCheckbox, stripeTermsOfServiceCheckbox, stripeForm } = stripePurchaseSubscription()
    const setupIntent = { 
      payment_method: 'stripeSetupIntentPaymentMethod' 
    }
    stripeMock().confirmCardSetup.mockResolvedValueOnce({
      setupIntent: setupIntent,
      error: null
    })
    fireEvent.click(selectMonthlySubscriptionType)
    fireEvent.click(stripeTermsOfServiceCheckbox)
    fireEvent.click(stripeAgreeToChargeCheckbox)
    await act(async () => {
      fireEvent.submit(stripeForm)
      await flushPromises()
    })
    expect(axiosMock.post).toHaveBeenCalledWith(
      '/app/user/' + getState().user.id + '/subscription/purchase/monthly',
      { stripeSetupIntentPaymentMethodId: setupIntent.payment_method }
    )
  })
  
  it("displays an error message when the attempt to send a successfully created Stripe SetupIntent to the back end is not successful when purchasing a MONTHLY subscription", async () => {
    const { container, selectMonthlySubscriptionType, stripeAgreeToChargeCheckbox, stripeSubmitButton, stripeTermsOfServiceCheckbox, stripeForm } = stripePurchaseSubscription()
    // @ts-ignore
    axiosMock.post.mockRejectedValueOnce({})
    const setupIntent = { 
      payment_method: 'stripeSetupIntentPaymentMethod' 
    }
    stripeMock().confirmCardSetup.mockResolvedValueOnce({
      setupIntent: setupIntent,
      error: null
    })
    fireEvent.click(selectMonthlySubscriptionType)
    fireEvent.click(stripeTermsOfServiceCheckbox)
    fireEvent.click(stripeAgreeToChargeCheckbox)
    await act(async () => {
      fireEvent.submit(stripeForm)
      await flushPromises()
    })
    expect(stripeSubmitButton.textContent).not.toContain('Processing...')
    expect(container.textContent).toContain(stripeGenericErrorMessage)
  })
  
  it("updates the user tasksheetSubscription type to MONTHLY when a MONTHLY subscription is succesfully purchased", async () => {
    const { getState, selectMonthlySubscriptionType, stripeAgreeToChargeCheckbox, stripeTermsOfServiceCheckbox, stripeForm } = stripePurchaseSubscription()
    // @ts-ignore
    axiosMock.post.mockResolvedValueOnce({})
    const setupIntent = { 
      payment_method: 'stripeSetupIntentPaymentMethod' 
    }
    stripeMock().confirmCardSetup.mockResolvedValueOnce({
      setupIntent: setupIntent,
      error: null
    })
    
    expect(getState().user.tasksheetSubscription.type).toBe('TRIAL')
    fireEvent.click(selectMonthlySubscriptionType)
    fireEvent.click(stripeTermsOfServiceCheckbox)
    fireEvent.click(stripeAgreeToChargeCheckbox)
    await act(async () => {
      fireEvent.submit(stripeForm)
      await flushPromises()
    })
    expect(getState().user.tasksheetSubscription.type).toBe('MONTHLY')
  })

})
