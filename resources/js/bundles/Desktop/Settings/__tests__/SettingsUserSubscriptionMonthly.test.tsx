//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import axiosMock from 'axios'
import moment from 'moment'
import 'jest-styled-components'

import { act, renderWithRedux, fireEvent } from '@/testing/library'
import { 
  createMockStore,
  getMockAppStateByTasksheetSubscriptionType
} from '@/testing/mocks'
import { flushPromises } from '@/testing/utils'

import { IUserTasksheetSubscription } from '@/state/user/types'

import SettingsUserSubscriptionMonthly from '@desktop/Settings/SettingsUserSubscriptionMonthly'
import { 
  cancelSubscriptionMessages, 
  cancelSubscriptionButtonText, 
} from '@desktop/Settings/SettingsUserSubscriptionMonthlyCancelSubscription'

//-----------------------------------------------------------------------------
// Tests
//-----------------------------------------------------------------------------
describe('SettingsUserSubscriptionMonthly', () => {

  beforeAll(() => {
    jest.useFakeTimers()
  })

  afterAll(() => {
    jest.useRealTimers()
  })
  
  const settingsUserSubscriptionMonthly = (tasksheetSubscriptionType: IUserTasksheetSubscription['type']) => {
    const mockAppState = getMockAppStateByTasksheetSubscriptionType(tasksheetSubscriptionType)
    const {
      container, 
      debug,
      getByPlaceholderText,
      getByText,
      getByTestId,
      store: { 
        getState 
      }
    } = renderWithRedux(<SettingsUserSubscriptionMonthly />, { store: createMockStore(mockAppState) })
    const cancelSubscriptionButton = getByText(cancelSubscriptionButtonText['READY'])
    const passwordInput = getByPlaceholderText("Enter your password") as HTMLInputElement
    const closePasswordInputButton = getByTestId("ClosePasswordInputButton")
    const cancelSubscriptionMessage = getByTestId("CancelSubscriptionMessage")
    return {
      cancelSubscriptionButton,
      cancelSubscriptionMessage,
      closePasswordInputButton,
      container,
      debug,
      getState,
      passwordInput
    }
  }

  it("displays the next billing date correctly for a MONTHLY user whose subscription is active", () => {
    const { container, getState } = settingsUserSubscriptionMonthly('MONTHLY')
    const expectedBillingDate = moment.localeData().ordinal(getState().user.tasksheetSubscription.billingDayOfMonth)
    expect(container.textContent).toContain(expectedBillingDate)
  })

  it("displays a 'Cancel Subscription' button", () => {
    const { cancelSubscriptionButton } = settingsUserSubscriptionMonthly('MONTHLY')
    expect(cancelSubscriptionButton).toBeTruthy()
  })

  it("displays an 'Enter your password' input when the 'Cancel Subscription' button is clicked", () => {
    const { cancelSubscriptionButton, cancelSubscriptionMessage, passwordInput } = settingsUserSubscriptionMonthly('MONTHLY')
    expect(cancelSubscriptionButton.textContent).toContain(cancelSubscriptionButtonText['READY'])
    expect(cancelSubscriptionMessage.textContent).toContain(cancelSubscriptionMessages['READY'])
    expect(passwordInput).toHaveStyleRule('display', 'none')
    cancelSubscriptionButton.click()
    expect(cancelSubscriptionButton.textContent).toContain(cancelSubscriptionButtonText['CONFIRM_CANCELLATION'])
    expect(cancelSubscriptionMessage.textContent).toContain(cancelSubscriptionMessages['CONFIRM_CANCELLATION'])
    expect(passwordInput).toHaveStyleRule('display', 'block')
  })

  it("displays a button that hides the 'Enter your password' input when clicked", () => {
    const { cancelSubscriptionButton, cancelSubscriptionMessage, closePasswordInputButton, passwordInput  } = settingsUserSubscriptionMonthly('MONTHLY')
    cancelSubscriptionButton.click()
    expect(cancelSubscriptionButton.textContent).toContain(cancelSubscriptionButtonText['CONFIRM_CANCELLATION'])
    expect(cancelSubscriptionMessage.textContent).toContain(cancelSubscriptionMessages['CONFIRM_CANCELLATION'])
    expect(closePasswordInputButton).toHaveStyleRule('display', 'block')
    expect(passwordInput).toHaveStyleRule('display', 'block')
    closePasswordInputButton.click()
    expect(cancelSubscriptionButton.textContent).toContain(cancelSubscriptionButtonText['READY'])
    expect(cancelSubscriptionMessage.textContent).toContain(cancelSubscriptionMessages['READY'])
    expect(closePasswordInputButton).toHaveStyleRule('display', 'none')
    expect(passwordInput).toHaveStyleRule('display', 'none')
  })

  it("correctly updates the 'Enter your password' input value", () => {
    const { cancelSubscriptionButton, passwordInput } = settingsUserSubscriptionMonthly('MONTHLY')
    const testPassword = "Test Password"
    cancelSubscriptionButton.click()
    expect(passwordInput.value).toEqual("")
    fireEvent.change(passwordInput, { target: { value: testPassword } })
    expect(passwordInput.value).toEqual(testPassword)
  })

  it("attempts to submit the cancellation request when 'Confirm Cancellation' is clicked", () => {
    (axiosMock.post as jest.Mock).mockResolvedValueOnce({})
    const { cancelSubscriptionButton, cancelSubscriptionMessage, getState, passwordInput } = settingsUserSubscriptionMonthly('MONTHLY')
    const testPassword = "Test Password"
    cancelSubscriptionButton.click()
    fireEvent.change(passwordInput, { target: { value: testPassword } })
    cancelSubscriptionButton.click()
    expect(cancelSubscriptionButton.textContent).toContain(cancelSubscriptionButtonText['CANCELLING'])
    expect(cancelSubscriptionMessage.textContent).toContain(cancelSubscriptionMessages['CANCELLING'])
    expect(axiosMock.post).toHaveBeenCalledWith('/app/user/' + getState().user.id + '/subscription/cancel/monthly', { password: testPassword })
  })

  it("displays an error message when the user has submitted an incorrect password", async () => {
    (axiosMock.post as jest.Mock).mockRejectedValueOnce({ response: { status: 401 } })
    const { cancelSubscriptionButton, cancelSubscriptionMessage, passwordInput } = settingsUserSubscriptionMonthly('MONTHLY')
    const testPassword = "Test Password"
    cancelSubscriptionButton.click()
    fireEvent.change(passwordInput, { target: { value: testPassword } })
    expect(passwordInput.placeholder).not.toEqual("Incorrect Password")
    expect(passwordInput).not.toHaveStyleRule("1px solid red")
    await act(async () => {
      cancelSubscriptionButton.click()
      await flushPromises()
      jest.advanceTimersByTime(500)
    })
    expect(cancelSubscriptionButton.textContent).toContain(cancelSubscriptionButtonText['INCORRECT_PASSWORD'])
    expect(cancelSubscriptionMessage.textContent).toContain(cancelSubscriptionMessages['INCORRECT_PASSWORD'])
    expect(passwordInput.value).toEqual("")
    expect(passwordInput.placeholder).toEqual("Incorrect Password")
    expect(passwordInput).toHaveStyleRule("1px solid red")
  })

  it("displays a generic error message when the cancellation request returns an unknown error", async () => {
    (axiosMock.post as jest.Mock).mockRejectedValueOnce({ response: { status: 500 } })
    const { cancelSubscriptionButton, cancelSubscriptionMessage, passwordInput } = settingsUserSubscriptionMonthly('MONTHLY')
    const testPassword = "Test Password"
    cancelSubscriptionButton.click()
    fireEvent.change(passwordInput, { target: { value: testPassword } })
    await act(async () => {
      cancelSubscriptionButton.click()
      await flushPromises()
      jest.advanceTimersByTime(500)
    })
    expect(cancelSubscriptionButton.textContent).toContain(cancelSubscriptionButtonText['ERROR'])
    expect(cancelSubscriptionMessage.textContent).toContain(cancelSubscriptionMessages['ERROR'])
    expect(passwordInput.value).toEqual("")
    expect(passwordInput.placeholder).toEqual("Enter your password")
    expect(passwordInput).toHaveStyleRule("1px solid red")
  })

  it("successfully updates the app state when the cancellation request succeeds", async () => {
    const nextUserTasksheetSubscription: IUserTasksheetSubscription = {
      id: 'id',
      type: 'MONTHLY_EXPIRED',
      billingDayOfMonth: null,
      subscriptionStartDate: '2020-01-01 12:00:00',
      subscriptionEndDate:'2020-02-01 12:00:00',
      trialStartDate: '2020-01-01 12:00:00',
      trialEndDate: '2020-01-01 12:00:00',
    };
    (axiosMock.post as jest.Mock).mockResolvedValueOnce({ data: nextUserTasksheetSubscription })
    const { cancelSubscriptionButton, getState, passwordInput } = settingsUserSubscriptionMonthly('MONTHLY')
    const testPassword = "Test Password"
    cancelSubscriptionButton.click()
    fireEvent.change(passwordInput, { target: { value: testPassword } })
    await act(async () => {
      cancelSubscriptionButton.click()
      await flushPromises()
    })
    expect(getState().user.tasksheetSubscription.type).toBe(nextUserTasksheetSubscription.type)
    expect(getState().user.tasksheetSubscription.billingDayOfMonth).toBe(nextUserTasksheetSubscription.billingDayOfMonth)
    expect(getState().user.tasksheetSubscription.subscriptionEndDate).toBe(nextUserTasksheetSubscription.subscriptionEndDate)
  })
})
