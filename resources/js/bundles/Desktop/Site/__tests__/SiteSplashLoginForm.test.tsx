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
  SiteSplashLoginForm,
  siteSplashLoginFormStatusMessages
} from '@desktop/Site/SiteSplashLoginForm'

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
describe('SiteSplashLoginForm', () => {

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

  const siteSplashLoginForm = () => {
    const { 
      getByPlaceholderText, 
      getByTestId,
      getByText
    } = renderWithRedux(<SiteSplashLoginForm />)
    const emailInput = getByPlaceholderText('Email') as HTMLInputElement
    const passwordInput = getByPlaceholderText('Password') as HTMLInputElement
    const submitButton = getByText('Log In')
    const statusContainer = getByTestId('SiteSplashLoginFormStatus')
    return {
      emailInput,
      passwordInput,
      submitButton,
      statusContainer
    }
  }
  
  it("displays an 'Email' input", async () => {
    const { emailInput } = siteSplashLoginForm()
    expect(emailInput).toBeTruthy()
  })
  
  it("displays a 'Password' input", async () => {
    const { passwordInput } = siteSplashLoginForm()
    expect(passwordInput).toBeTruthy()
  })
  
  it("changes the 'Email' value on user input", async () => {
    const { emailInput } = siteSplashLoginForm()
    const nextEmailInputValue = 'test@test.com'
    expect(emailInput.value).toEqual('')
    fireEvent.change(emailInput, { target: { value: nextEmailInputValue }})
    expect(emailInput.value).toEqual(nextEmailInputValue)
  })
  
  it("changes the 'Password' value on user input", async () => {
    const { passwordInput } = siteSplashLoginForm()
    const nextPasswordInputValue = 'Super Secret Password'
    expect(passwordInput.value).toEqual('')
    fireEvent.change(passwordInput, { target: { value: nextPasswordInputValue }})
    expect(passwordInput.value).toEqual(nextPasswordInputValue)
  })

  it("changes the border color of the 'Email' input to 'red' if the user enters a value that is not an email and then blurs the input", async () => {
    const { emailInput } = siteSplashLoginForm()
    expect(emailInput.value).toBe('')
    expect(emailInput).toHaveStyleRule('border', '1px solid rgb(150,150,150)')
    fireEvent.change(emailInput, { target: { value: 'Not an email address' }})
    fireEvent.blur(emailInput)
    expect(emailInput).toHaveStyleRule('border', '1px solid red')
  })
  
  it("changes the value of the submit button to 'Logging In...' when the user submits the form", async () => {
    const { submitButton } = siteSplashLoginForm()
    submitButton.click()
    expect(submitButton.textContent).toBe('Logging In...')
  })
  
  it("displays an error message when the user tries to submit the form without all the fields completed", async () => {
    const { statusContainer, submitButton } = siteSplashLoginForm()
    submitButton.click()
    jest.advanceTimersByTime(500)
    expect(statusContainer.textContent).toBe(siteSplashLoginFormStatusMessages['NOT_ALL_FIELDS_ARE_COMPLETE'])
  })
  
  it("displays an error message when the user tries to submit the form without a valid email", async () => {
    const { emailInput, passwordInput, statusContainer, submitButton } = siteSplashLoginForm()
    fireEvent.change(emailInput, { target: { value: 'Not an email' }})
    fireEvent.change(passwordInput, { target: { value: 'Password' }})
    submitButton.click()
    jest.advanceTimersByTime(500)
    expect(statusContainer.textContent).toBe(siteSplashLoginFormStatusMessages['NOT_VALID_EMAIL'])
  })
  
  it("attempts to login the user when all fields are completed and the email is valid", async () => {
    const { emailInput, passwordInput, submitButton, statusContainer } = siteSplashLoginForm()
    const email = 'test@test.com'
    const password = 'Password'
    fireEvent.change(emailInput, { target: { value: email }})
    fireEvent.change(passwordInput, { target: { value: password }})
    submitButton.click()
    expect(statusContainer.textContent).toBe(siteSplashLoginFormStatusMessages['LOGGING_IN'])
    expect(axiosMock.post).toHaveBeenCalledTimes(1)
    expect(axiosMock.post).toHaveBeenCalledWith('/user/login', { email: email, password: password })
  })
  
  it("displays an error message when the login is not successful", async () => {
    (axiosMock.post as jest.Mock).mockRejectedValueOnce({ response: { status: 500 } })
    const { emailInput, passwordInput, submitButton, statusContainer } = siteSplashLoginForm()
    expect(window.location.reload).not.toHaveBeenCalled()
    const email = 'test@test.com'
    const password = 'Password'
    fireEvent.change(emailInput, { target: { value: email }})
    fireEvent.change(passwordInput, { target: { value: password }})
    submitButton.click()
    await flushPromises()
    expect(window.location.reload).not.toHaveBeenCalled()
    jest.advanceTimersByTime(500)
    expect(statusContainer.textContent).toBe(siteSplashLoginFormStatusMessages['ERROR_DURING_LOGIN'])
  })
  
  it("reloads the page when the login is successful", async () => {    
    (axiosMock.post as jest.Mock).mockResolvedValueOnce({})
    const { emailInput, passwordInput, submitButton, statusContainer } = siteSplashLoginForm()
    expect(window.location.reload).not.toHaveBeenCalled()
    const email = 'test@test.com'
    const password = 'Password'
    fireEvent.change(emailInput, { target: { value: email }})
    fireEvent.change(passwordInput, { target: { value: password }})
    submitButton.click()
    expect(statusContainer.textContent).toBe(siteSplashLoginFormStatusMessages['LOGGING_IN'])
    await flushPromises()
    expect(axiosMock.post).toHaveBeenCalledTimes(1)
    expect(axiosMock.post).toHaveBeenCalledWith('/user/login', { email: email, password: password })
    expect(window.location.reload).toHaveBeenCalled()
  })

})
