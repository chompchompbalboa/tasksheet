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
    const monthlyUserAppState = getMockAppStateByTasksheetSubscriptionType('MONTHLY')
    const mockAppState = {
      ...monthlyUserAppState,
      user: {
        ...monthlyUserAppState.user,
        tasksheetSubscription: {
          ...monthlyUserAppState.user.tasksheetSubscription,
          type: tasksheetSubscriptionType
        }
      }
    }
  
    const {
      container, 
      store: { 
        getState 
      }
    } = renderWithRedux(<SettingsUserSubscriptionMonthly />, { store: createMockStore(mockAppState) })
    return {
      container,
      getState
    }
  }

  it("displays the next billing date correctly for a MONTHLY user whose subscription is active, but whose trial has not expired", () => {
    const { container, getState } = settingsUserSubscriptionMonthly('MONTHLY_STILL_IN_TRIAL')
    const expectedBillingDate = moment(getState().user.tasksheetSubscription.trialEndDate).format('MMMM Do, YYYY')
    expect(container.textContent).toContain('first')
    expect(container.textContent).toContain(expectedBillingDate)
  })

  it("displays the next billing date correctly for a MONTHLY user whose subscription is active", () => {
    const { container, getState } = settingsUserSubscriptionMonthly('MONTHLY')
    const expectedBillingDate = moment(getState().user.tasksheetSubscription.subscriptionEndDate).format('MMMM Do, YYYY')
    expect(container.textContent).toContain('next')
    expect(container.textContent).toContain(expectedBillingDate)
  })

})
