//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import 'jest-styled-components'
import { cleanup, fireEvent, render, renderWithRedux } from '@app/utils/tests'
import Settings from '../Settings'

//-----------------------------------------------------------------------------
// Setup
//-----------------------------------------------------------------------------
afterEach(cleanup)

//-----------------------------------------------------------------------------
// Tests
//-----------------------------------------------------------------------------
test("Renders correctly", async () => {
  const { container } = render(<Settings />)
  expect(container).toMatchSnapshot()
})

test("Opens and closes when clicking the link", async () => {
  const { getByTestId } = render(<Settings />)
  const settingsLink = getByTestId('settingsLink')
  const settingsContainer = getByTestId('settingsContainer')
  expect(settingsContainer).toHaveStyleRule('left', '100vw')
  fireEvent.click(settingsLink)
  expect(settingsContainer).toHaveStyleRule('left', '75vw')
  fireEvent.click(settingsLink)
  expect(settingsContainer).toHaveStyleRule('left', '100vw')
})

test("Transforms the link upon opening and closing", async () => {
  const { getByTestId } = renderWithRedux(<Settings />)
  const settingsLink = getByTestId('settingsLink')
  expect(settingsLink).toHaveStyleRule('transform', 'scale(-1,1)')
  fireEvent.click(settingsLink)
  expect(settingsLink).toHaveStyleRule('transform', 'none')
  fireEvent.click(settingsLink)
  expect(settingsLink).toHaveStyleRule('transform', 'scale(-1,1)')
})