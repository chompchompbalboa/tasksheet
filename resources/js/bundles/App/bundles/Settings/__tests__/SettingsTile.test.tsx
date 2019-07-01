//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import 'jest-styled-components'
import { cleanup, fireEvent, render } from '@app/utils/tests'
import SettingsTile, { SettingsTileProps } from '../SettingsTile'

//-----------------------------------------------------------------------------
// Setup
//-----------------------------------------------------------------------------
const props: SettingsTileProps = {
  header: "Header"
}

afterEach(cleanup)

//-----------------------------------------------------------------------------
// Tests
//-----------------------------------------------------------------------------
test("Renders correctly", async () => {
  const { container } = render(<SettingsTile {...props}/>)
  expect(container).toMatchSnapshot()
})

test("Opens and closes when clicking the link", async () => {
  const { getByTestId } = render(<SettingsTile  {...props}/>)
  const settingsTileHeader = getByTestId('settingsTileHeader')
  const settingsTileItems = getByTestId('settingsTileItems')
  expect(settingsTileItems).toHaveStyleRule('display', 'none')
  fireEvent.click(settingsTileHeader)
  expect(settingsTileItems).toHaveStyleRule('display', 'block')
  fireEvent.click(settingsTileHeader)
  expect(settingsTileItems).toHaveStyleRule('display', 'none')
})