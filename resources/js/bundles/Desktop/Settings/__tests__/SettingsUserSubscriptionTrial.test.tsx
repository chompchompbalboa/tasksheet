//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import moment from 'moment'

import { renderWithRedux } from '@/testing/library'
import { 
  createMockStore,
  getMockAppStateByTasksheetSubscriptionType,
  mockEnvironment,
  stripeMock
} from '@/testing/mocks'

import SettingsUserSubscriptionTrial from '@desktop/Settings/SettingsUserSubscriptionTrial'

//-----------------------------------------------------------------------------
// Tests
//-----------------------------------------------------------------------------
describe('SettingsUserSubscriptionTrial', () => {

  beforeAll(() => {
    // @ts-ignore
    global.environment = mockEnvironment
    // @ts-ignore
    global.Stripe = stripeMock
  })
  
  const settingsUserSubscriptionTrial = () => {
    const mockAppState = getMockAppStateByTasksheetSubscriptionType('TRIAL')
    const {
      container, 
      store: { 
        getState 
      }
    } = renderWithRedux(<SettingsUserSubscriptionTrial />, { store: createMockStore(mockAppState) })
    return {
      container,
      getState
    }
  }

  it("displays the expiration date correctly", () => {
    const { container, getState } = settingsUserSubscriptionTrial()
    const trialEndDate = moment(getState().user.tasksheetSubscription.trialEndDate).format('MMMM Do, YYYY')
    expect(container.textContent).toContain(trialEndDate)
  })

})
