//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import 'jest-styled-components'
import { cleanup, fireEvent, render, renderWithRedux } from '@app/utils/tests'
import ConnectedSidebar, { Sidebar, SidebarProps } from '../Sidebar'

import { updateUserLayout } from '@app/state/user/actions'

//-----------------------------------------------------------------------------
// Setup
//-----------------------------------------------------------------------------
const props: SidebarProps = {
  resizeContainerBackgroundColor: 'green',
  sidebarBackgroundColor: 'red',
  sidebarWidth: 0.25,
  updateUserLayout: jest.fn()
}

afterEach(cleanup)

//-----------------------------------------------------------------------------
// Tests
//-----------------------------------------------------------------------------
test("Renders correctly", async () => {
  const { getByTestId } = render(<Sidebar {...props} />)
  const resizeContainer = getByTestId('resizeContainer')
  const sidebarContainer = getByTestId('sidebarContainer')
  expect(sidebarContainer).toHaveStyleRule('background-color', 'red')
  expect(sidebarContainer).toHaveStyleRule('width', '25vw')
  expect(resizeContainer).toHaveStyleRule('background-color', 'transparent')
})

test("Displays the col-resize icon when the user hovers over the resize container", async () => {
  const { getByTestId } = render(<Sidebar {...props} />)
  const resizeContainer = getByTestId('resizeContainer')
  expect(resizeContainer).toHaveStyleRule('cursor', 'col-resize')
})

test("Shows the resize container when it's clicked", async () => {
  const { getByTestId } = render(<Sidebar {...props} />)
  const resizeContainer = getByTestId('resizeContainer')
  fireEvent.mouseDown(resizeContainer)
  expect(resizeContainer).toHaveStyleRule('background-color', 'green')
})

test("Moves the resize container when the mouse moves", async () => {
  const { getByTestId } = render(<Sidebar {...props} />)
  const resizeContainer = getByTestId('resizeContainer')
  fireEvent.mouseDown(resizeContainer, { clientX: 0 })
  fireEvent.mouseMove(resizeContainer, { clientX: 15 })
  expect(resizeContainer).toHaveStyleRule('left', '15px')
})

test("Calls the action to update the app state when the mouse is released", async () => {
  const { getByTestId } = render(<Sidebar {...props} />)
  // @ts-ignore
  global.innerWidth = 100
  const resizeContainer = getByTestId('resizeContainer')
  fireEvent.mouseDown(resizeContainer, { clientX: 0 })
  fireEvent.mouseMove(resizeContainer, { clientX: 10 })
  fireEvent.mouseUp(resizeContainer)
  expect(props.updateUserLayout).toHaveBeenCalledWith({ sidebarWidth: 0.35 })
})

test("Updates its width in response to the updated app state", async () => {
  const { getByTestId } = renderWithRedux(
    <ConnectedSidebar updateUserLayout={updateUserLayout} {...props} />
  )
  // @ts-ignore
  global.innerWidth = 100
  const resizeContainer = getByTestId('resizeContainer')
  const sidebarContainer = getByTestId('sidebarContainer')
  fireEvent.mouseDown(resizeContainer, { clientX: 0 })
  fireEvent.mouseMove(resizeContainer, { clientX: 10 })
  fireEvent.mouseUp(resizeContainer)
  expect(sidebarContainer).toHaveStyleRule('width', '35vw')
})