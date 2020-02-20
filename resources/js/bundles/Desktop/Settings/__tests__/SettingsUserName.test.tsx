//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import 'jest-styled-components'
import '@testing-library/jest-dom/extend-expect'
import axiosMock from 'axios'

import { renderWithRedux } from '@/testing/library'
import { appStateFactory, IAppStateFactoryInput } from '@/testing/mocks/appState'

import SettingsUserName from '@desktop/Settings/SettingsUserName'

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
describe('SettingsUserName', () => {
  
  it("renders without crashing", async () => {
    const container = renderWithRedux(<SettingsUserName />)
    expect(container).toMatchSnapshot()
  })
  
  it("display a 'Name:' input", async () => {
    const { queryByLabelText } = renderWithRedux(<SettingsUserName />)
    expect(queryByLabelText('Name:')).toBeTruthy()
  })

})
