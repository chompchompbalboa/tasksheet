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

import { IUserStripeSubscription } from '@/state/user/types'

import SettingsUserSubscriptionMonthly from '@desktop/Settings/SettingsUserSubscriptionMonthly'

//-----------------------------------------------------------------------------
// Tests
//-----------------------------------------------------------------------------
describe('SettingsUserSubscriptionMonthly', () => {
  
  const settingsUserSubscriptionMonthly = (stripeSubscriptionStatus: IUserStripeSubscription['stripeStatus']) => {
    const monthlyUserAppState = getMockAppStateByTasksheetSubscriptionType('MONTHLY')
    const mockAppState = {
      ...monthlyUserAppState,
      user: {
        ...monthlyUserAppState.user,
        stripeSubscription: {
          ...monthlyUserAppState.user.stripeSubscription,
          stripeStatus: stripeSubscriptionStatus
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
    const { container, getState } = settingsUserSubscriptionMonthly('trialing')
    const expectedBillingDate = moment(getState().user.stripeSubscription.trialEndsAt).format('MMMM Do, YYYY')
    expect(container.textContent).toContain('first')
    expect(container.textContent).toContain(expectedBillingDate)
  })

  it("displays the next billing date correctly for a MONTHLY user whose subscription is active", () => {
    const { container, getState } = settingsUserSubscriptionMonthly('active')
    const expectedBillingDate = moment(getState().user.stripeSubscription.endsAt).format('MMMM Do, YYYY')
    expect(container.textContent).toContain('next')
    expect(container.textContent).toContain(expectedBillingDate)
  })

})
