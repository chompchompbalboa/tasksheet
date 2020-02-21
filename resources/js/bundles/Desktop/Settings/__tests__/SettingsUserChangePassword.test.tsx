//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import 'jest-styled-components'
import '@testing-library/jest-dom/extend-expect'
import axiosMock from 'axios'

import { fireEvent, renderWithRedux } from '@/testing/library'
import { flushPromises } from '@/testing/utils'
import { appStateFactory, IAppStateFactoryInput } from '@/testing/mocks/appState'

import SettingsUserChangePassword, { submitButtonMessages, errorMessages } from '@desktop/Settings/SettingsUserChangePassword'

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
describe('SettingsUserChangePassword', () => {

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
    } = renderWithRedux(<SettingsUserChangePassword />)
    const currentPasswordInput = getByLabelText('Enter Current Password:') as HTMLInputElement
    const newPasswordInput = getByLabelText('Enter New Password:') as HTMLInputElement
    const confirmNewPasswordInput = getByLabelText('Confirm New Password:') as HTMLInputElement
    const errorMessageContainer = getByTestId('SettingsUserChangePasswordErrorMessageContainer')
    const submitButton = getByTestId('SettingsUserChangePasswordSubmitButton')
    return {
      getState,
      currentPasswordInput,
      newPasswordInput,
      confirmNewPasswordInput,
      errorMessageContainer,
      submitButton
    }
  }
  
  it("displays an 'Enter Current Password:', 'Enter New Password:' and 'Confirm New Password:' input", async () => {
    const { currentPasswordInput, newPasswordInput, confirmNewPasswordInput } = settingsUserName()
    expect(currentPasswordInput).toBeTruthy()
    expect(newPasswordInput).toBeTruthy()
    expect(confirmNewPasswordInput).toBeTruthy()
  })
  
  it("updates the input values on user input", async () => {
    const { currentPasswordInput, newPasswordInput, confirmNewPasswordInput } = settingsUserName()
    const currentPassword = 'Current Password'
    const newPassword = 'New Password'
    fireEvent.change(currentPasswordInput, { target: { value: currentPassword }})
    fireEvent.change(newPasswordInput, { target: { value: newPassword }})
    fireEvent.change(confirmNewPasswordInput, { target: { value: newPassword }})
    expect(currentPasswordInput.value).toBe(currentPassword)
    expect(newPasswordInput.value).toBe(newPassword)
    expect(confirmNewPasswordInput.value).toBe(newPassword)
  })
  
  it("changes the value of the submit button to '" + submitButtonMessages['SAVING'] + "' when the user submits the form", async () => {
    const { submitButton } = settingsUserName()
    fireEvent.click(submitButton)
    expect(submitButton.textContent).toBe(submitButtonMessages['SAVING'])
  })
  
  it("displays an error message when the user submits the form with the 'Enter Current Password:' input empty", async () => {
    const { newPasswordInput, confirmNewPasswordInput, submitButton, errorMessageContainer } = settingsUserName()
    const newPassword = 'New Password'
    fireEvent.change(newPasswordInput, { target: { value: newPassword }})
    fireEvent.change(confirmNewPasswordInput, { target: { value: newPassword }})
    fireEvent.click(submitButton)
    jest.advanceTimersByTime(500)
    expect(errorMessageContainer.textContent).toBe(errorMessages['SOME_FIELDS_ARE_EMPTY'])
    expect(submitButton.textContent).toBe(submitButtonMessages['SOME_FIELDS_ARE_EMPTY'])
  })
  
  it("displays an error message when the user submits the form with the 'Enter New Password:' input empty", async () => {
    const { currentPasswordInput, confirmNewPasswordInput, submitButton, errorMessageContainer } = settingsUserName()
    const currentPassword = 'Current Password'
    const newPassword = 'New Password'
    fireEvent.change(currentPasswordInput, { target: { value: currentPassword }})
    fireEvent.change(confirmNewPasswordInput, { target: { value: newPassword }})
    fireEvent.click(submitButton)
    jest.advanceTimersByTime(500)
    expect(errorMessageContainer.textContent).toBe(errorMessages['SOME_FIELDS_ARE_EMPTY'])
    expect(submitButton.textContent).toBe(submitButtonMessages['SOME_FIELDS_ARE_EMPTY'])
  })
  
  it("displays an error message when the user submits the form with the 'Confirm New Password:' input empty", async () => {
    const { currentPasswordInput, newPasswordInput, submitButton, errorMessageContainer } = settingsUserName()
    const currentPassword = 'Current Password'
    const newPassword = 'New Password'
    fireEvent.change(currentPasswordInput, { target: { value: currentPassword }})
    fireEvent.change(newPasswordInput, { target: { value: newPassword }})
    fireEvent.click(submitButton)
    jest.advanceTimersByTime(500)
    expect(errorMessageContainer.textContent).toBe(errorMessages['SOME_FIELDS_ARE_EMPTY'])
    expect(submitButton.textContent).toBe(submitButtonMessages['SOME_FIELDS_ARE_EMPTY'])
  })
  
  it("displays an error message when the user submits the form with the 'Enter Current Password:' input value equal to the 'Enter New Password:' input value", async () => {
    const { currentPasswordInput, newPasswordInput, confirmNewPasswordInput, submitButton, errorMessageContainer } = settingsUserName()
    const currentPassword = 'Current Password'
    fireEvent.change(currentPasswordInput, { target: { value: currentPassword }})
    fireEvent.change(newPasswordInput, { target: { value: currentPassword }})
    fireEvent.change(confirmNewPasswordInput, { target: { value: currentPassword }})
    fireEvent.click(submitButton)
    jest.advanceTimersByTime(500)
    expect(errorMessageContainer.textContent).toBe(errorMessages['NEW_PASSWORD_IS_SAME_AS_CURRENT_PASSWORD'])
    expect(submitButton.textContent).toBe(submitButtonMessages['NEW_PASSWORD_IS_SAME_AS_CURRENT_PASSWORD'])
  })
  
  it("displays an error message when the user submits the form with the 'Enter New Password:' input value not matching the 'Confirm New Password:' input value", async () => {
    const { currentPasswordInput, newPasswordInput, confirmNewPasswordInput, submitButton, errorMessageContainer } = settingsUserName()
    const currentPassword = 'Current Password'
    const newPassword = 'New Password'
    const notNewPassword = 'Not New Password'
    fireEvent.change(currentPasswordInput, { target: { value: currentPassword }})
    fireEvent.change(newPasswordInput, { target: { value: newPassword }})
    fireEvent.change(confirmNewPasswordInput, { target: { value: notNewPassword }})
    fireEvent.click(submitButton)
    jest.advanceTimersByTime(500)
    expect(errorMessageContainer.textContent).toBe(errorMessages['NEW_PASSWORDS_DONT_MATCH'])
    expect(submitButton.textContent).toBe(submitButtonMessages['NEW_PASSWORDS_DONT_MATCH'])
  })
  
  it("attempts to update the user's password in the database when the user submits the form properly", async () => {
    const { getState, currentPasswordInput, newPasswordInput, confirmNewPasswordInput, submitButton } = settingsUserName()
    const currentPassword = 'Current Password'
    const newPassword = 'New Password'
    fireEvent.change(currentPasswordInput, { target: { value: currentPassword }})
    fireEvent.change(newPasswordInput, { target: { value: newPassword }})
    fireEvent.change(confirmNewPasswordInput, { target: { value: newPassword }})
    fireEvent.click(submitButton)
    jest.advanceTimersByTime(500)
    expect(axiosMock.post).toHaveBeenCalledWith('/app/user/password/' + getState().user.id, { currentPassword: currentPassword, newPassword: newPassword })
  })
  
  it("changes the submit button value to '" + submitButtonMessages['SAVED'] + "' and clears the inputs when the attempt to update the database is successful", async () => {
    (axiosMock.post as jest.Mock).mockResolvedValueOnce({})
    const { currentPasswordInput, newPasswordInput, confirmNewPasswordInput, submitButton } = settingsUserName()
    const currentPassword = 'Current Password'
    const newPassword = 'New Password'
    fireEvent.change(currentPasswordInput, { target: { value: currentPassword }})
    fireEvent.change(newPasswordInput, { target: { value: newPassword }})
    fireEvent.change(confirmNewPasswordInput, { target: { value: newPassword }})
    fireEvent.click(submitButton)
    await flushPromises()
    jest.advanceTimersByTime(500)
    expect(submitButton.textContent).toBe(submitButtonMessages['SAVED'])
    expect(currentPasswordInput.value).toBe('')
    expect(newPasswordInput.value).toBe('')
    expect(confirmNewPasswordInput.value).toBe('')
  })
  
  it("displays an error message when the user submits the form properly, but the current password is incorrect", async () => {
    (axiosMock.post as jest.Mock).mockRejectedValueOnce({ response: { status: 400 }})
    const { currentPasswordInput, newPasswordInput, confirmNewPasswordInput, submitButton } = settingsUserName()
    const currentPassword = 'Current Password'
    const newPassword = 'New Password'
    fireEvent.change(currentPasswordInput, { target: { value: currentPassword }})
    fireEvent.change(newPasswordInput, { target: { value: newPassword }})
    fireEvent.change(confirmNewPasswordInput, { target: { value: newPassword }})
    fireEvent.click(submitButton)
    await flushPromises()
    jest.advanceTimersByTime(500)
    expect(submitButton.textContent).toBe(submitButtonMessages['CURRENT_PASSWORD_INCORRECT'])
    expect(currentPasswordInput.value).toBe('')
  })
  
  it("displays an error message when the user submits the form properly, but there is an error saving the new password", async () => {
    (axiosMock.post as jest.Mock).mockRejectedValueOnce({ response: { status: 500 }})
    const { currentPasswordInput, newPasswordInput, confirmNewPasswordInput, submitButton } = settingsUserName()
    const currentPassword = 'Current Password'
    const newPassword = 'New Password'
    fireEvent.change(currentPasswordInput, { target: { value: currentPassword }})
    fireEvent.change(newPasswordInput, { target: { value: newPassword }})
    fireEvent.change(confirmNewPasswordInput, { target: { value: newPassword }})
    fireEvent.click(submitButton)
    await flushPromises()
    jest.advanceTimersByTime(500)
    expect(submitButton.textContent).toBe(submitButtonMessages['ERROR'])
  })

})
