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

import SettingsUserSubscriptionPurchaseSubscription from '@desktop/Settings/SettingsUserSubscriptionPurchaseSubscription'

//-----------------------------------------------------------------------------
// Tests
//-----------------------------------------------------------------------------
describe('SettingsUserSubscriptionPurchaseSubscription', () => {

  beforeAll(() => {
    // @ts-ignore
    global.environment = mockEnvironment
    // @ts-ignore
    global.Stripe = stripeMock
  })
  
  const settingsUserSubscriptionPurchaseSubscription = () => {
    const mockAppState = getMockAppStateByTasksheetSubscriptionType('TRIAL')
    const {
      container, 
      getByText,
      store: { 
        getState 
      }
    } = renderWithRedux(<SettingsUserSubscriptionPurchaseSubscription />, { store: createMockStore(mockAppState) })
    const selectMonthlySubscriptionType = getByText('Monthly')
    const selectLifetimeSubscriptionType = getByText('Lifetime')
    return {
      container,
      getState,
      selectMonthlySubscriptionType,
      selectLifetimeSubscriptionType
    }
  }

  it("displays the expiration date correctly", () => {
    const { container, getState } = settingsUserSubscriptionPurchaseSubscription()
    const trialEndDate = moment(getState().user.tasksheetSubscription.trialEndDate).format('MMMM Do, YYYY')
    expect(container.textContent).toContain(trialEndDate)
  })

  it("displays the form to purchase a MONTHLY subscription when the user selects the MONTHLY option", () => {
    const { container, selectMonthlySubscriptionType } = settingsUserSubscriptionPurchaseSubscription()
    selectMonthlySubscriptionType.click()
    expect(container.textContent).toContain('Subscribe To Monthly Access')
  })

})
