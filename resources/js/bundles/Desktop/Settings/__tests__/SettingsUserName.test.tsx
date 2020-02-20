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

  const settingsUserName = () => {
    const { 
      getByLabelText
    } = renderWithRedux(<SettingsUserName />)
    const nameInput = getByLabelText('Name:') as HTMLInputElement
    return {
      nameInput
    }
  }
  
  it("display a 'Name:' input", async () => {
    const { nameInput } = settingsUserName()
    expect(nameInput).toBeTruthy()
  })

})
