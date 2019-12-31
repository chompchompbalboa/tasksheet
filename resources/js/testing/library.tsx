//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { render } from '@testing-library/react'

import { createMockStore, mockAppState } from '@/testing/mocks'

const mockStore = createMockStore(mockAppState)

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------
export * from '@testing-library/react'

export const renderWithRedux = ( ui: any, { store = mockStore } = {} ) => {
  return {
    ...render(<ReduxProvider store={store}>{ui}</ReduxProvider>),
    store,
  }
}
