//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import 'jest-styled-components'
import { cleanup, fireEvent, render } from '@app/utils/tests'
import SettingsUserColorColor, { SettingsUserColorColorProps } from '../SettingsUserColorColor'


//-----------------------------------------------------------------------------
// Setup
//-----------------------------------------------------------------------------
const props: SettingsUserColorColorProps = {
  color: '#FFFFFF',
  label: 'Primary',
  onColorChange: jest.fn()
}

afterEach(cleanup)

//-----------------------------------------------------------------------------
// Tests
//-----------------------------------------------------------------------------
test("Renders correctly", async () => {
  const { container } = render(<SettingsUserColorColor {...props} />)
  expect(container).toMatchSnapshot()
})

test("Displays the color picker when clicked", async () => {
  const { getByTestId } = render(<SettingsUserColorColor {...props} />)
  const description = getByTestId('description')
  const colorPicker = getByTestId('colorPicker')
  expect(colorPicker).toHaveStyleRule('display', 'none')
  fireEvent.click(description)
  expect(colorPicker).toHaveStyleRule('display', 'block')
})