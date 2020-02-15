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

import { IAppState } from '@/state'

import { Desktop } from '@desktop/Desktop'

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
  
  it("does not show the desktop site when a 'TRIAL', 'MONTHLY' or 'LIFETIME' user is logged in", async () => {
    const { queryByTestId } = renderWithRedux(<Desktop />)
    expect(queryByTestId('DesktopSite')).toBeNull()
  })

  it("shows the desktop site when a 'DEMO' user is logged in", async () => {
    const demoUserAppState: IAppState = {
      ...mockAppState,
      user: {
        ...mockAppState.user,
        tasksheetSubscription: {
          ...mockAppState.user.tasksheetSubscription,
          type: 'DEMO'
        }
      }
    }
    const { getByTestId } = renderWithRedux(<Desktop />, { store: createMockStore(demoUserAppState) })
    expect(getByTestId('DesktopSite')).toBeTruthy()
  })

})
