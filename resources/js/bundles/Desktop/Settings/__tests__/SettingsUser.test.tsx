//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import 'jest-styled-components'
import '@testing-library/jest-dom/extend-expect'
import axiosMock from 'axios'

import { renderWithRedux } from '@/testing/library'
import { appStateFactory, IAppStateFactoryInput } from '@/testing/mocks/appState'

import SettingsUser from '@desktop/Settings/SettingsUser'

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
describe('SettingsUser', () => {
  
  it("renders without crashing", async () => {
    const container = renderWithRedux(<SettingsUser />)
    expect(container).toMatchSnapshot()
  })
  
  it("displays the 'Profile' section", async () => {
    const { queryByText } = renderWithRedux(<SettingsUser />)
    expect(queryByText('Profile')).toBeTruthy()
  })
  
  it("displays the 'Subscription' section", async () => {
    const { queryByText } = renderWithRedux(<SettingsUser />)
    expect(queryByText('Subscription')).toBeTruthy()
  })

})
