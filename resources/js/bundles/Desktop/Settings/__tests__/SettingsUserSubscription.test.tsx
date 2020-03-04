//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'

import { renderWithRedux } from '@/testing/library'
import { 
  createMockStore,
  getMockAppStateByTasksheetSubscriptionType,
  mockEnvironment,
  stripeMock
} from '@/testing/mocks'

import SettingsUserSubscription from '@desktop/Settings/SettingsUserSubscription'

//-----------------------------------------------------------------------------
// Tests
//-----------------------------------------------------------------------------
describe('SettingsUserSubscription', () => {

  beforeAll(() => {
    // @ts-ignore
    global.environment = mockEnvironment
    // @ts-ignore
    global.Stripe = stripeMock
  })
  
  it("renders the correct children for 'DEMO' users", async () => {
    const { queryByTestId } = renderWithRedux(<SettingsUserSubscription />, { store: createMockStore(getMockAppStateByTasksheetSubscriptionType('DEMO')) })
    expect(queryByTestId('SettingsUserSubscriptionDemo')).toBeTruthy()
  })
  
  it("renders the correct children for 'TRIAL' users", async () => {
    const { queryByTestId } = renderWithRedux(<SettingsUserSubscription />, { store: createMockStore(getMockAppStateByTasksheetSubscriptionType('TRIAL')) })
    expect(queryByTestId('SettingsUserSubscriptionTrial')).toBeTruthy()
  })
  
  it("renders the correct children for 'TRIAL_EXPIRED' users", async () => {
    const { queryByTestId } = renderWithRedux(<SettingsUserSubscription />, { store: createMockStore(getMockAppStateByTasksheetSubscriptionType('TRIAL_EXPIRED')) })
    expect(queryByTestId('SettingsUserSubscriptionExpired')).toBeTruthy()
  })
  
  it("renders the correct children for 'MONTHLY' users", async () => {
    const { queryByTestId } = renderWithRedux(<SettingsUserSubscription />, { store: createMockStore(getMockAppStateByTasksheetSubscriptionType('MONTHLY')) })
    expect(queryByTestId('SettingsUserSubscriptionMonthly')).toBeTruthy()
  })
  
  it("renders the correct children for 'MONTHLY_EXPIRED' users", async () => {
    const { queryByTestId } = renderWithRedux(<SettingsUserSubscription />, { store: createMockStore(getMockAppStateByTasksheetSubscriptionType('MONTHLY_EXPIRED')) })
    expect(queryByTestId('SettingsUserSubscriptionExpired')).toBeTruthy()
  })
  
  it("renders the correct children for 'LIFETIME' users", async () => {
    const { queryByTestId } = renderWithRedux(<SettingsUserSubscription />, { store: createMockStore(getMockAppStateByTasksheetSubscriptionType('LIFETIME')) })
    expect(queryByTestId('SettingsUserSubscriptionLifetime')).toBeTruthy()
  })

})
