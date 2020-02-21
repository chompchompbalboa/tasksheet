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

import SettingsUserName, { settingsUserNameStatusMessages } from '@desktop/Settings/SettingsUserName'

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

  beforeAll(() => {
    jest.useFakeTimers()
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  const settingsUserName = () => {
    const { 
      getByLabelText,
      getByTestId,
      store: {
        getState
      }
    } = renderWithRedux(<SettingsUserName />)
    const nameInput = getByLabelText('Name:') as HTMLInputElement
    const statusContainer = getByTestId('SettingsUserNameStatusContainer')
    return {
      getState,
      nameInput,
      statusContainer
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
  
  it("shows the status message '" + settingsUserNameStatusMessages['UPDATING'] + "' when then 'Name:' value changes and the user blurs the input", async () => {
    const { nameInput, statusContainer } = settingsUserName()
    const nextName = 'Next Name 1'
    fireEvent.change(nameInput, { target: { value: nextName }})
    fireEvent.blur(nameInput)
    expect(statusContainer.textContent).toBe(settingsUserNameStatusMessages['UPDATING'])
  })
  
  it("attempts to update the user name in the database when then 'Name:' value changes and the user blurs the input", async () => {
    const { getState, nameInput } = settingsUserName()
    const nextName = 'Next Name 2'
    fireEvent.change(nameInput, { target: { value: nextName }})
    fireEvent.blur(nameInput)
    expect(axiosMock.patch).toHaveBeenCalledWith('/app/user/' + getState().user.id, { name: nextName })
  })
  
  it("updates the app state and shows the status message '" + settingsUserNameStatusMessages['UPDATED'] + "' when the attempt to update the database is successful", async () => {
    (axiosMock.patch as jest.Mock).mockResolvedValueOnce({})
    const { getState, nameInput, statusContainer } = settingsUserName()
    const nextName = 'Next Name 3'
    expect(getState().user.name).not.toEqual(nextName)
    fireEvent.change(nameInput, { target: { value: nextName }})
    fireEvent.blur(nameInput)
    await flushPromises()
    expect(getState().user.name).toEqual(nextName)
    jest.advanceTimersByTime(500)
    expect(statusContainer.textContent).toBe(settingsUserNameStatusMessages['UPDATED'])
    jest.advanceTimersByTime(2000)
    expect(statusContainer.textContent).toBe(settingsUserNameStatusMessages['READY'])
  })
  
  it("shows an error message and reverts the changes in the 'Name:' input when the attempt to update the database is unsuccessful", async () => {
    (axiosMock.patch as jest.Mock).mockRejectedValueOnce({})
    const { getState, nameInput, statusContainer } = settingsUserName()
    const name = getState().user.name
    const nextName = 'Next Name 4'
    fireEvent.change(nameInput, { target: { value: nextName }})
    fireEvent.blur(nameInput)
    await flushPromises()
    jest.advanceTimersByTime(500)
    expect(statusContainer.textContent).toBe(settingsUserNameStatusMessages['ERROR_UPDATING'])
    expect(nameInput.value).toBe(name)
    expect(getState().user.name).toBe(name)
    jest.advanceTimersByTime(2000)
    expect(statusContainer.textContent).toBe(settingsUserNameStatusMessages['READY'])
  })

})
