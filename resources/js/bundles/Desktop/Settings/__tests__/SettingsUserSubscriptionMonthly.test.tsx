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

import SettingsUserSubscriptionMonthly from '@desktop/Settings/SettingsUserSubscriptionMonthly'

//-----------------------------------------------------------------------------
// Tests
//-----------------------------------------------------------------------------
describe('SettingsUserSubscriptionMonthly', () => {
  
  const settingsUserSubscriptionMonthly = () => {
    const monthlyUserAppState = getMockAppStateByTasksheetSubscriptionType('MONTHLY')
    const { 
      store: { 
        getState 
      }, 
      queryByText
    } = renderWithRedux(<SettingsUserSubscriptionMonthly />, { store: createMockStore(monthlyUserAppState) })
    return {
      getState,
      queryByText
    }
  }

})
