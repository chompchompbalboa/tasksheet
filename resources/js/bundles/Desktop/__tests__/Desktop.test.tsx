//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import 'jest-styled-components'
import '@testing-library/jest-dom/extend-expect'
import axiosMock from 'axios'

import { renderWithRedux } from '@/testing/library'
import { 
  createMockStore,
  getMockAppStateByTasksheetSubscriptionType, 
  IMockAppStateFactoryInput,
  mockAppStateFactory, 
  mockEnvironment
} from '@/testing/mocks'

import { Desktop } from '@desktop/Desktop'

//-----------------------------------------------------------------------------
// Setup
//-----------------------------------------------------------------------------
const {
  allFiles,
  allFileIds,
  allSheetsFromDatabase
} = mockAppStateFactory({} as IMockAppStateFactoryInput)

const fileId = allFileIds[0]
const sheetId = allFiles[fileId].typeId
const sheetFromDatabase = allSheetsFromDatabase[sheetId]

// @ts-ignore
axiosMock.get.mockResolvedValue({ data: sheetFromDatabase })

console.warn = jest.fn()
console.error = jest.fn()

//-----------------------------------------------------------------------------
// Tests
//-----------------------------------------------------------------------------
describe('Desktop', () => {

  beforeAll(() => {
    // @ts-ignore
    global.environment = mockEnvironment
  })

  it("does not show the desktop site when a 'LIFETIME' user is logged in", async () => {
    const lifetimeUserAppState = getMockAppStateByTasksheetSubscriptionType('LIFETIME')
    const { queryByTestId } = renderWithRedux(<Desktop />, { store: createMockStore(lifetimeUserAppState) })
    expect(queryByTestId('DesktopSite')).toBeNull()
  })

  it("does not show the desktop site when a 'MONTHLY' user is logged in", async () => {
    const monthlyUserAppState = getMockAppStateByTasksheetSubscriptionType('MONTHLY')
    const { queryByTestId } = renderWithRedux(<Desktop />, { store: createMockStore(monthlyUserAppState) })
    expect(queryByTestId('DesktopSite')).toBeNull()
  })

  it("does not show the desktop site when a 'TRIAL' user is logged in", async () => {
    const trialUserAppState = getMockAppStateByTasksheetSubscriptionType('TRIAL')
    const { queryByTestId } = renderWithRedux(<Desktop />, { store: createMockStore(trialUserAppState) })
    expect(queryByTestId('DesktopSite')).toBeNull()
  })

  it("shows the desktop site when a 'DEMO' user is logged in", async () => {
    const demoUserAppState = getMockAppStateByTasksheetSubscriptionType('DEMO')
    const { queryByTestId } = renderWithRedux(<Desktop />, { store: createMockStore(demoUserAppState) })
    expect(queryByTestId('DesktopSite')).toBeTruthy()
  })

})
