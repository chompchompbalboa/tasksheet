//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import 'jest-styled-components'
import '@testing-library/jest-dom/extend-expect'
import axiosMock from 'axios'

import { renderWithRedux } from '@/testing/library'
import { 
  mockEnvironment
} from '@/testing/mocks'
import { appStateFactory, IAppStateFactoryInput } from '@/testing/mocks/appState'

import { SiteSplash } from '@desktop/Site/SiteSplash'

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
describe('SiteSplash', () => {

  beforeAll(() => {
    // @ts-ignore
    global.environment = mockEnvironment
  })
  
  it("displays a link to the registration form", async () => {
    const { queryByText } = renderWithRedux(<SiteSplash />)
    expect(queryByText('Register')).toBeTruthy()
  })
  
  it("displays a link to the login form", async () => {
    const { queryByText } = renderWithRedux(<SiteSplash />)
    expect(queryByText('Login')).toBeTruthy()
  })
  
  it("displays the registration form by default", async () => {
    const { queryByText } = renderWithRedux(<SiteSplash />)
    expect(queryByText('Sign Up')).toBeTruthy()
  })
  
  it("displays the login form after clicking the login link", async () => {
    const { getByText, queryByText } = renderWithRedux(<SiteSplash />)
    const loginLink = getByText('Login')
    expect(queryByText('Sign Up')).toBeTruthy()
    expect(queryByText('Log In')).toBeNull()
    loginLink.click()
    expect(queryByText('Sign Up')).toBeNull()
    expect(queryByText('Log In')).toBeTruthy()
  })
  
  it("displays the registration form after clicking the register link", async () => {
    const { getByText, queryByText } = renderWithRedux(<SiteSplash />)
    const loginLink = getByText('Login')
    const registerLink = getByText('Register')
    expect(queryByText('Sign Up')).toBeTruthy()
    expect(queryByText('Log In')).toBeNull()
    loginLink.click()
    expect(queryByText('Sign Up')).toBeNull()
    expect(queryByText('Log In')).toBeTruthy()
    registerLink.click()
    expect(queryByText('Sign Up')).toBeTruthy()
    expect(queryByText('Log In')).toBeNull()
  })

})
