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

import SettingsUserSubscriptionLifetime from '@desktop/Settings/SettingsUserSubscriptionLifetime'

//-----------------------------------------------------------------------------
// Tests
//-----------------------------------------------------------------------------
describe('SettingsUserSubscriptionLifetime', () => {
  
  it("correctly displays the date the user purchased their LIFETIME subscription", async () => {
    const { 
      store: { 
        getState 
      }, 
      queryByText
    } = renderWithRedux(<SettingsUserSubscriptionLifetime />, { store: createMockStore(getMockAppStateByTasksheetSubscriptionType('LIFETIME')) })
    expect(queryByText(moment(getState().user.tasksheetSubscription.subscriptionStartDate).format('MMMM Do, YYYY'))).toBeTruthy()
  })

})
