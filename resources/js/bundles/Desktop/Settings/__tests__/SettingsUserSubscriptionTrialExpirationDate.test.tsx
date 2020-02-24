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

import SettingsUserSubscriptionTrialExpirationDate from '@desktop/Settings/SettingsUserSubscriptionTrialExpirationDate'

//-----------------------------------------------------------------------------
// Tests
//-----------------------------------------------------------------------------
describe('SettingsUserSubscriptionTrialExpirationDate', () => {
  
  const settingsUserSubscriptionMonthly = () => {
    const mockAppState = getMockAppStateByTasksheetSubscriptionType('TRIAL')
    const {
      container, 
      store: { 
        getState 
      }
    } = renderWithRedux(<SettingsUserSubscriptionTrialExpirationDate />, { store: createMockStore(mockAppState) })
    return {
      container,
      getState
    }
  }

  it("displays the expiration date correctly", () => {
    const { container, getState } = settingsUserSubscriptionMonthly()
    const trialEndDate = moment(getState().user.tasksheetSubscription.trialEndDate).format('MMMM Do, YYYY')
    expect(container.textContent).toContain(trialEndDate)
  })

})
