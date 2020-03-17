//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import axiosMock from 'axios'
import moment from 'moment'
import 'jest-styled-components'

import { renderWithRedux, fireEvent } from '@/testing/library'
import { 
  createMockStore,
  getMockAppStateByTasksheetSubscriptionType
} from '@/testing/mocks'

import { IUserTasksheetSubscription } from '@/state/user/types'

import SettingsUserSubscriptionMonthly from '@desktop/Settings/SettingsUserSubscriptionMonthly'

//-----------------------------------------------------------------------------
// Tests
//-----------------------------------------------------------------------------
describe('SettingsUserSubscriptionMonthly', () => {
  
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
    const cancelSubscriptionButton = getByText("Cancel Subscription")
    const passwordInput = getByPlaceholderText("Enter your password") as HTMLInputElement
    const closePasswordInputButton = getByTestId("ClosePasswordInputButton")
    return {
      cancelSubscriptionButton,
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
    const { cancelSubscriptionButton, passwordInput } = settingsUserSubscriptionMonthly('MONTHLY')
    expect(passwordInput).toHaveStyleRule('display', 'none')
    cancelSubscriptionButton.click()
    expect(passwordInput).toHaveStyleRule('display', 'block')
    expect(cancelSubscriptionButton.textContent).toContain("Confirm Cancellation")
  })

  it("displays a button that hides the 'Enter your password' input when clicked", () => {
    const { cancelSubscriptionButton, closePasswordInputButton, passwordInput  } = settingsUserSubscriptionMonthly('MONTHLY')
    expect(closePasswordInputButton).toHaveStyleRule('display', 'none')
    expect(passwordInput).toHaveStyleRule('display', 'none')
    cancelSubscriptionButton.click()
    expect(closePasswordInputButton).toHaveStyleRule('display', 'block')
    expect(passwordInput).toHaveStyleRule('display', 'block')
    closePasswordInputButton.click()
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
    const { cancelSubscriptionButton, getState, passwordInput } = settingsUserSubscriptionMonthly('MONTHLY')
    const testPassword = "Test Password"
    cancelSubscriptionButton.click()
    fireEvent.change(passwordInput, { target: { value: testPassword } })
    cancelSubscriptionButton.click()
    expect(axiosMock.post).toHaveBeenCalledWith('/app/user/' + getState().user.id + '/subscription/cancel/monthly', { password: testPassword })
  })

})
