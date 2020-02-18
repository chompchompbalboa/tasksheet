//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import 'jest-styled-components'
import '@testing-library/jest-dom/extend-expect'
import axiosMock from 'axios'

import { fireEvent, renderWithRedux } from '@/testing/library'
import { mockEnvironment } from '@/testing/mocks'
import { appStateFactory, IAppStateFactoryInput } from '@/testing/mocks/appState'
import { flushPromises } from '@/testing/utils'

import { 
  SiteSplashRegisterForm,
  siteSplashRegisterFormStatusMessages
} from '@desktop/Site/SiteSplashRegisterForm'

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
describe('SiteSplashRegisterForm', () => {

  const { location } = window

  beforeAll(() => {
    // @ts-ignore
    global.environment = mockEnvironment
    jest.useFakeTimers()
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  beforeEach(() => {
    delete window.location
    // @ts-ignore
    window.location = { reload: jest.fn() }
  })

  afterEach(() => {
    window.location = location
    jest.clearAllMocks()
  })

  const siteSplashRegisterForm = () => {
    const { 
      getByLabelText,
      getByPlaceholderText, 
      getByTestId,
      getByText
    } = renderWithRedux(<SiteSplashRegisterForm />)
    const nameInput = getByPlaceholderText('Name') as HTMLInputElement
    const emailInput = getByPlaceholderText('Email') as HTMLInputElement
    const passwordInput = getByPlaceholderText('Password') as HTMLInputElement
    const checkboxInput = getByLabelText('I agree to start a 30-day free trial of Tasksheet (no credit card required)') as HTMLInputElement
    const submitButton = getByText('Sign Up')
    const statusContainer = getByTestId('SiteSplashRegisterFormStatus')
    return {
      nameInput,
      emailInput,
      passwordInput,
      checkboxInput,
      submitButton,
      statusContainer
    }
  }
  
  it("renders without crashing", async () => {
    const container = renderWithRedux(<SiteSplashRegisterForm />)
    expect(container).toMatchSnapshot()
  })
  
  it("displays a 'Name' input", async () => {
    const { nameInput } = siteSplashRegisterForm()
    expect(nameInput).toBeTruthy()
  })
  
  it("displays an 'Email' input", async () => {
    const { emailInput } = siteSplashRegisterForm()
    expect(emailInput).toBeTruthy()
  })
  
  it("displays a 'Password' input", async () => {
    const { passwordInput } = siteSplashRegisterForm()
    expect(passwordInput).toBeTruthy()
  })
  
  it("displays a checkbox where the user agrees to start a 30-day trial", async () => {
    const { checkboxInput } = siteSplashRegisterForm()
    expect(checkboxInput).toBeTruthy()
  })
  
  it("changes the 'Name' value on user input", async () => {
    const { nameInput } = siteSplashRegisterForm()
    const nextNameInputValue = 'First Name'
    expect(nameInput.value).toEqual('')
    fireEvent.change(nameInput, { target: { value: nextNameInputValue }})
    expect(nameInput.value).toEqual(nextNameInputValue)
  })
  
  it("changes the 'Email' value on user input", async () => {
    const { emailInput } = siteSplashRegisterForm()
    const nextEmailInputValue = 'test@test.com'
    expect(emailInput.value).toEqual('')
    fireEvent.change(emailInput, { target: { value: nextEmailInputValue }})
    expect(emailInput.value).toEqual(nextEmailInputValue)
  })
  
  it("changes the 'Password' value on user input", async () => {
    const { passwordInput } = siteSplashRegisterForm()
    const nextPasswordInputValue = 'Super Secret Password'
    expect(passwordInput.value).toEqual('')
    fireEvent.change(passwordInput, { target: { value: nextPasswordInputValue }})
    expect(passwordInput.value).toEqual(nextPasswordInputValue)
  })
  
  it("changes the checkbox value when the user clicks", async () => {
    const { checkboxInput } = siteSplashRegisterForm()
    expect(checkboxInput.checked).toBe(false)
    fireEvent.click(checkboxInput)
    expect(checkboxInput.checked).toBe(true)
    fireEvent.click(checkboxInput)
    expect(checkboxInput.checked).toBe(false)
  })
  
  it("changes the border color of the 'Email' input to 'red' if the user enters a value that is not an email and then blurs the input", async () => {
    const { emailInput } = siteSplashRegisterForm()
    expect(emailInput.value).toBe('')
    expect(emailInput).toHaveStyleRule('border', '1px solid rgb(150,150,150)')
    fireEvent.change(emailInput, { target: { value: 'Not an email address' }})
    fireEvent.blur(emailInput)
    expect(emailInput).toHaveStyleRule('border', '1px solid red')
  })
  
  it("changes the value of the submit button to 'Signing Up...' when the user submits the form", async () => {
    const { submitButton } = siteSplashRegisterForm()
    submitButton.click()
    expect(submitButton.textContent).toBe('Signing Up...')
  })
  
  it("displays an error message when the user tries to submit the form without all the fields completed", async () => {
    const { statusContainer, submitButton } = siteSplashRegisterForm()
    submitButton.click()
    jest.advanceTimersByTime(500)
    expect(statusContainer.textContent).toBe(siteSplashRegisterFormStatusMessages['NOT_ALL_FIELDS_ARE_COMPLETE'])
  })
  
  it("displays an error message when the user tries to submit the form without a valid email", async () => {
    const { nameInput, emailInput, passwordInput, statusContainer, submitButton } = siteSplashRegisterForm()
    fireEvent.change(nameInput, { target: { value: 'Name' }})
    fireEvent.change(emailInput, { target: { value: 'Not an email' }})
    fireEvent.change(passwordInput, { target: { value: 'Password' }})
    submitButton.click()
    jest.advanceTimersByTime(500)
    expect(statusContainer.textContent).toBe(siteSplashRegisterFormStatusMessages['NOT_VALID_EMAIL'])
  })
  
  it("displays an error message when the user tries to submit the form without checking the checkbox", async () => {
    const { nameInput, emailInput, passwordInput, statusContainer, submitButton } = siteSplashRegisterForm()
    fireEvent.change(nameInput, { target: { value: 'Name' }})
    fireEvent.change(emailInput, { target: { value: 'test@test.com' }})
    fireEvent.change(passwordInput, { target: { value: 'Password' }})
    submitButton.click()
    jest.advanceTimersByTime(500)
    expect(statusContainer.textContent).toBe(siteSplashRegisterFormStatusMessages['START_TRIAL_CHECKBOX_NOT_CHECKED'])
  })
  
  it("attempts to register the user when all fields are completed, the email is valid and the checkbox is checked", async () => {
    const { nameInput, emailInput, passwordInput, checkboxInput, submitButton, statusContainer } = siteSplashRegisterForm()
    const name = 'Name'
    const email = 'test@test.com'
    const password = 'Password'
    fireEvent.change(nameInput, { target: { value: name }})
    fireEvent.change(emailInput, { target: { value: email }})
    fireEvent.change(passwordInput, { target: { value: password }})
    fireEvent.click(checkboxInput)
    submitButton.click()
    expect(statusContainer.textContent).toBe(siteSplashRegisterFormStatusMessages['REGISTERING'])
    expect(axiosMock.post).toHaveBeenCalledTimes(1)
    expect(axiosMock.post).toHaveBeenCalledWith('/user/register', { name: name, email: email, password: password })
  })
  
  it("displays an error message when the email address is already in use", async () => {
    (axiosMock.post as jest.Mock).mockRejectedValueOnce({ response: { status: 409 } })
    const { nameInput, emailInput, passwordInput, checkboxInput, submitButton, statusContainer } = siteSplashRegisterForm()
    expect(window.location.reload).not.toHaveBeenCalled()
    const name = 'Name'
    const email = 'test@test.com'
    const password = 'Password'
    fireEvent.change(nameInput, { target: { value: name }})
    fireEvent.change(emailInput, { target: { value: email }})
    fireEvent.change(passwordInput, { target: { value: password }})
    fireEvent.click(checkboxInput)
    submitButton.click()
    await flushPromises()
    expect(window.location.reload).not.toHaveBeenCalled()
    jest.advanceTimersByTime(500)
    expect(statusContainer.textContent).toBe(siteSplashRegisterFormStatusMessages['EMAIL_ALREADY_IN_USE'])
  })
  
  it("displays an error message when the registration is not successful", async () => {
    (axiosMock.post as jest.Mock).mockRejectedValueOnce({ response: { status: 500 } })
    const { nameInput, emailInput, passwordInput, checkboxInput, submitButton, statusContainer } = siteSplashRegisterForm()
    expect(window.location.reload).not.toHaveBeenCalled()
    const name = 'Name'
    const email = 'test@test.com'
    const password = 'Password'
    fireEvent.change(nameInput, { target: { value: name }})
    fireEvent.change(emailInput, { target: { value: email }})
    fireEvent.change(passwordInput, { target: { value: password }})
    fireEvent.click(checkboxInput)
    submitButton.click()
    await flushPromises()
    expect(window.location.reload).not.toHaveBeenCalled()
    jest.advanceTimersByTime(500)
    expect(statusContainer.textContent).toBe(siteSplashRegisterFormStatusMessages['ERROR_DURING_REGISTRATION'])
  })
  
  it("reloads the page when the registration is successful", async () => {    
    (axiosMock.post as jest.Mock).mockResolvedValueOnce({})
    const { nameInput, emailInput, passwordInput, checkboxInput, submitButton, statusContainer } = siteSplashRegisterForm()
    expect(window.location.reload).not.toHaveBeenCalled()
    const name = 'Name'
    const email = 'test@test.com'
    const password = 'Password'
    fireEvent.change(nameInput, { target: { value: name }})
    fireEvent.change(emailInput, { target: { value: email }})
    fireEvent.change(passwordInput, { target: { value: password }})
    fireEvent.click(checkboxInput)
    submitButton.click()
    expect(statusContainer.textContent).toBe(siteSplashRegisterFormStatusMessages['REGISTERING'])
    await flushPromises()
    expect(axiosMock.post).toHaveBeenCalledTimes(1)
    expect(axiosMock.post).toHaveBeenCalledWith('/user/register', { name: name, email: email, password: password })
    expect(window.location.reload).toHaveBeenCalled()
  })

})
