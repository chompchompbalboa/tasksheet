//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import 'jest-styled-components'
import '@testing-library/jest-dom/extend-expect'
import axiosMock from 'axios'

import { fireEvent,  renderWithRedux } from '@/testing/library'
import { flushPromises } from '@/testing/utils'
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
      getByLabelText,
      store: {
        getState
      }
    } = renderWithRedux(<SettingsUserName />)
    const nameInput = getByLabelText('Name:') as HTMLInputElement
    return {
      getState,
      nameInput
    }
  }
  
  it("displays a 'Name:' input", async () => {
    const { nameInput } = settingsUserName()
    expect(nameInput).toBeTruthy()
  })
  
  it("displays the user's name in the 'Name:' input", async () => {
    const { getState, nameInput } = settingsUserName()
    expect(nameInput.value).toBe(getState().user.name)
  })
  
  it("changes the 'Name:' value on user input", async () => {
    const { nameInput } = settingsUserName()
    const nextName = 'Next Name'
    fireEvent.change(nameInput, { target: { value: nextName }})
    expect(nameInput.value).toBe(nextName)
  })
  
  it("updates the app state when the 'Name:' value changes and the user blurs the input", async () => {
    const { getState, nameInput } = settingsUserName()
    const nextName = 'Next Name'
    expect(getState().user.name).not.toBe(nextName)
    fireEvent.change(nameInput, { target: { value: nextName }})
    fireEvent.blur(nameInput)
    flushPromises()
    expect(getState().user.name).toBe(nextName)
  })
  
  it("sends the update to the database when the 'Name:' value changes and the user blurs the input", async () => {
    const { getState, nameInput } = settingsUserName()
    const nextName = 'Next Name'
    fireEvent.change(nameInput, { target: { value: nextName }})
    fireEvent.blur(nameInput)
    flushPromises()
    expect(axiosMock.patch).toHaveBeenCalledWith('/app/user/' + getState().user.id, { name: nextName })
  })

})
