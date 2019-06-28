//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import 'jest-styled-components'
import { cleanup, fireEvent, render } from '@app/utils/tests'
import { ResizeContainer, ResizeContainerProps } from '../ResizeContainer'

//-----------------------------------------------------------------------------
// Setup
//-----------------------------------------------------------------------------
afterEach(cleanup)

const props: ResizeContainerProps = {
  containerBackgroundColor: 'red',
  containerWidth: '5px',
  onResize: jest.fn()
}

//-----------------------------------------------------------------------------
// Tests
//-----------------------------------------------------------------------------
test("Renders correctly", async () => {
  const { getByTestId } = render(<ResizeContainer {...props} />)
  const resizeContainer = getByTestId('resizeContainer')
  expect(resizeContainer).toHaveStyleRule('background-color', 'transparent')
})

test("Displays the col-resize icon when the user hovers over the container", async () => {
  const { getByTestId } = render(<ResizeContainer {...props} />)
  const resizeContainer = getByTestId('resizeContainer')
  expect(resizeContainer).toHaveStyleRule('cursor', 'col-resize')
})

test("Shows the container when it's clicked", async () => {
  const { getByTestId } = render(<ResizeContainer {...props} />)
  const resizeContainer = getByTestId('resizeContainer')
  fireEvent.mouseDown(resizeContainer)
  expect(resizeContainer).toHaveStyleRule('background-color', 'red')
})

test("Moves the resize container when the mouse moves", async () => {
  const { getByTestId } = render(<ResizeContainer {...props} />)
  const resizeContainer = getByTestId('resizeContainer')
  fireEvent.mouseDown(resizeContainer, { clientX: 0 })
  fireEvent.mouseMove(resizeContainer, { clientX: 15 })
  expect(resizeContainer).toHaveStyleRule('left', '15px')
})

test("Calls onResize the the mouse is released", async () => {
  const { getByTestId } = render(<ResizeContainer {...props} />)
  const resizeContainer = getByTestId('resizeContainer')
  fireEvent.mouseDown(resizeContainer, { clientX: 0 })
  fireEvent.mouseMove(resizeContainer, { clientX: 10 })
  fireEvent.mouseUp(resizeContainer, { clientX: 10 })
  expect(props.onResize).toHaveBeenCalledWith(10)
})