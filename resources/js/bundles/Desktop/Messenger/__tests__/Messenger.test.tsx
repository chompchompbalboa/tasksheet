//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'

import { act, renderWithRedux } from '@/testing/library'
import { 
  createMockStore,
  mockAppState
} from '@/testing/mocks'

import { IMessengerMessage } from '@/state/messenger/types'

import Messenger from '@desktop/Messenger/Messenger'

//-----------------------------------------------------------------------------
// Tests
//-----------------------------------------------------------------------------
describe('Messenger', () => {

  beforeAll(() => {
    jest.useFakeTimers()
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  it("correctly displays a single ERROR message", () => {
    const errorMessage: IMessengerMessage = {
      type: 'ERROR',
      message: "There was an error"
    }
    const mockAppStateWithErrorMessage = {
      ...mockAppState,
      messenger: {
        ...mockAppState.messenger,
        messages: [ errorMessage ]
      }
    }
    const { queryByText } = renderWithRedux( <Messenger />, { store: createMockStore(mockAppStateWithErrorMessage) })
    expect(queryByText(errorMessage.message)).toBeTruthy()
  })

  it("correctly displays multiple ERROR messages", () => {
    const errorMessage1: IMessengerMessage = {
      type: 'ERROR',
      message: "There was an error #1"
    }
    const errorMessage2: IMessengerMessage = {
      type: 'ERROR',
      message: "There was an error #2"
    }
    const mockAppStateWithErrorMessage = {
      ...mockAppState,
      messenger: {
        ...mockAppState.messenger,
        messages: [ errorMessage1, errorMessage2 ]
      }
    }
    const { queryByText } = renderWithRedux( <Messenger />, { store: createMockStore(mockAppStateWithErrorMessage) })
    expect(queryByText(errorMessage1.message)).toBeTruthy()
    expect(queryByText(errorMessage2.message)).toBeTruthy()
  })

  it("correctly clears an ERROR message after the specified timeout", async () => {
    const errorMessage: IMessengerMessage = {
      type: 'ERROR',
      message: "There was an error",
      timeout: 5000
    }
    const mockAppStateWithErrorMessage = {
      ...mockAppState,
      messenger: {
        ...mockAppState.messenger,
        messages: [ errorMessage ]
      }
    }
    const { queryByText } = renderWithRedux( <Messenger />, { store: createMockStore(mockAppStateWithErrorMessage) })
    expect(queryByText(errorMessage.message)).toBeTruthy()
    await act(async () => {
      jest.advanceTimersByTime(errorMessage.timeout)
    })
    expect(queryByText(errorMessage.message)).not.toBeTruthy()
  })

  it("correctly clears an ERROR message after user clicks the delete icon", async () => {
    const errorMessage: IMessengerMessage = {
      type: 'ERROR',
      message: "There was an error",
      timeout: 5000
    }
    const mockAppStateWithErrorMessage = {
      ...mockAppState,
      messenger: {
        ...mockAppState.messenger,
        messages: [ errorMessage ]
      }
    }
    const { getByTestId, queryByText } = renderWithRedux( <Messenger />, { store: createMockStore(mockAppStateWithErrorMessage) })
    const deleteButton = getByTestId('MessengerMessageDeleteButton')
    expect(queryByText(errorMessage.message)).toBeTruthy()
    await act(async () => {
      deleteButton.click()
    })
    expect(queryByText(errorMessage.message)).not.toBeTruthy()
  })
})
