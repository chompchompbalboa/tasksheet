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
  mockAppState,
  mockEnvironment
} from '@/testing/mocks'
import { appStateFactory, IAppStateFactoryInput } from '@/testing/mocks/appState'

import { Desktop } from '@desktop/Desktop'
import { IUserTasksheetSubscription } from '@/state/user/types'

//-----------------------------------------------------------------------------
// Setup
//-----------------------------------------------------------------------------
const {
  allFiles,
  allFileIds,
  allSheetsFromDatabase
} = appStateFactory({} as IAppStateFactoryInput)

const fileId = allFileIds[0]
const sheetId = allFiles[fileId].typeId
const sheetFromDatabase = allSheetsFromDatabase[sheetId]

// @ts-ignore
axiosMock.get.mockResolvedValue({ data: sheetFromDatabase })

console.warn = jest.fn()
console.error = jest.fn()

const userAppState = (tasksheetSubscriptionType: IUserTasksheetSubscription['type']) => ({
  ...mockAppState,
  user: {
    ...mockAppState.user,
    tasksheetSubscription: {
      ...mockAppState.user.tasksheetSubscription,
      type: tasksheetSubscriptionType
    }
  }
})

//-----------------------------------------------------------------------------
// Tests
//-----------------------------------------------------------------------------
describe('Desktop', () => {

  beforeAll(() => {
    // @ts-ignore
    global.environment = mockEnvironment
  })
  
  it("renders without crashing", async () => {
    const container = renderWithRedux(<Desktop />)
    expect(container).toMatchSnapshot()
  })

  it("does not show the desktop site when a 'LIFETIME' user is logged in", async () => {
    const lifetimeUserAppState = userAppState('LIFETIME')
    const { queryByTestId } = renderWithRedux(<Desktop />, { store: createMockStore(lifetimeUserAppState) })
    expect(queryByTestId('DesktopSite')).toBeNull()
  })

  it("does not show the desktop site when a 'MONTHLY' user is logged in", async () => {
    const monthlyUserAppState = userAppState('MONTHLY')
    const { queryByTestId } = renderWithRedux(<Desktop />, { store: createMockStore(monthlyUserAppState) })
    expect(queryByTestId('DesktopSite')).toBeNull()
  })

  it("does not show the desktop site when a 'TRIAL' user is logged in", async () => {
    const trialUserAppState = userAppState('TRIAL')
    const { queryByTestId } = renderWithRedux(<Desktop />, { store: createMockStore(trialUserAppState) })
    expect(queryByTestId('DesktopSite')).toBeNull()
  })

  it("shows the desktop site when a 'DEMO' user is logged in", async () => {
    const demoUserAppState = userAppState('DEMO')
    const { queryByTestId } = renderWithRedux(<Desktop />, { store: createMockStore(demoUserAppState) })
    expect(queryByTestId('DesktopSite')).toBeTruthy()
  })

})
