//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import renderer from 'react-test-renderer'
import { cleanup, render } from 'utils/test-utils'

import Boilerplate from './Boilerplate'

//-----------------------------------------------------------------------------
// Setup
//-----------------------------------------------------------------------------
afterEach(cleanup)
const component = () => {
  const renderedComponent = render(<Boilerplate />)
  const snapshot = renderer.create(<Boilerplate />).toJSON()
  return {
    snapshot,
    ...renderedComponent
  }
}
//-----------------------------------------------------------------------------
// Tests
//-----------------------------------------------------------------------------
describe('Boilerplate', () => {
  it('renders correctly using default props', () => {
    const { snapshot } = component()
    expect(snapshot).toMatchSnapshot()
  })
})