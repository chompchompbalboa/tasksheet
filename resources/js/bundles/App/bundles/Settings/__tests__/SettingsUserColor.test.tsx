//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import 'jest-styled-components'
import { cleanup, renderWithRedux } from '@app/utils/tests'
import SettingsUserColor from '../SettingsUserColor'

//-----------------------------------------------------------------------------
// Setup
//-----------------------------------------------------------------------------
afterEach(cleanup)

//-----------------------------------------------------------------------------
// Tests
//-----------------------------------------------------------------------------
test("Renders correctly", async () => {
  const { container } = renderWithRedux(<SettingsUserColor />)
  expect(container).toMatchSnapshot()
})