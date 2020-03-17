//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import moment from 'moment'

import { renderWithRedux } from '@/testing/library'
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
      getByText,
      queryByPlaceholderText,
      queryByText,
      store: { 
        getState 
      }
    } = renderWithRedux(<SettingsUserSubscriptionMonthly />, { store: createMockStore(mockAppState) })
    return {
      container,
      debug,
      getByText,
      getState,
      queryByPlaceholderText,
      queryByText
    }
  }

  it("displays the next billing date correctly for a MONTHLY user whose subscription is active", () => {
    const { container, getState } = settingsUserSubscriptionMonthly('MONTHLY')
    const expectedBillingDate = moment.localeData().ordinal(getState().user.tasksheetSubscription.billingDayOfMonth)
    expect(container.textContent).toContain(expectedBillingDate)
  })

  it("displays a 'Cancel Subscription' button", () => {
    const { queryByText } = settingsUserSubscriptionMonthly('MONTHLY')
    expect(queryByText("Cancel Subscription")).toBeTruthy()
  })

  it("displays an input prompting users to enter their password to confirm cancellation when the 'Cancel Subscription' button is clicked", () => {
    const { getByText, queryByPlaceholderText } = settingsUserSubscriptionMonthly('MONTHLY')
    const cancelSubscriptionButton = getByText("Cancel Subscription")
    cancelSubscriptionButton.click()
    expect(queryByPlaceholderText("Enter your password")).toBeTruthy()
    expect(cancelSubscriptionButton.textContent).toContain("Confirm Cancellation")
  })

})
