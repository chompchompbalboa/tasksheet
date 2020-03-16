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
      queryByTestId,
      store: { 
        getState 
      }
    } = renderWithRedux(<SettingsUserSubscriptionMonthly />, { store: createMockStore(mockAppState) })
    return {
      container,
      getState,
      queryByTestId
    }
  }

  it("displays the next billing date correctly for a MONTHLY user whose subscription is active", () => {
    const { container, getState } = settingsUserSubscriptionMonthly('MONTHLY')
    const expectedBillingDate = moment.localeData().ordinal(getState().user.tasksheetSubscription.billingDayOfMonth)
    expect(container.textContent).toContain(expectedBillingDate)
  })

  it("displays a button allowing the user to cancel their subscription", () => {
    const { queryByTestId } = settingsUserSubscriptionMonthly('MONTHLY')
    expect(queryByTestId('SettingsUserSubscriptionMonthlyCancelSubscription')).toBeTruthy()
  })

})
