//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import 'jest-styled-components'
import '@testing-library/jest-dom/extend-expect'
import axiosMock from 'axios'

import { cleanup, fireEvent, renderWithRedux, waitForElement } from '@app/testing/library'
import { 
  createMockStore,
  getCellAndCellProps,
  mockAppState 
} from '@app/testing/mocks'

import { SheetCell } from '@app/bundles/Sheet/SheetCell'

//-----------------------------------------------------------------------------
// Setup
//-----------------------------------------------------------------------------
const {
  folder: {
    folders,
    files
  }
} = mockAppState

const folderId = Object.keys(folders)[0]
const fileId = folders[folderId].files[0]
const file = files[fileId]
const sheetId = file.typeId

console.warn = jest.fn()

afterEach(cleanup)

// @ts-ignore
axiosMock.patch.mockResolvedValue({ data: null })

jest.setTimeout(10000)

//-----------------------------------------------------------------------------
// Tests
//-----------------------------------------------------------------------------
describe('SheetCell', () => {
  
  it("renders without crashing", async () => {
    const { cell, props } = getCellAndCellProps({ sheetId: sheetId, row: 1, column: 1, cellTypeOverride: 'STRING' })
    const { getByTestId } = renderWithRedux(<SheetCell {...props}/>, { store: createMockStore(mockAppState) })
    expect(getByTestId('SheetCellContainer')).toHaveTextContent(cell.value)
  })

  it("correctly renders the SheetCellString Component", async () => {
    const { props } = getCellAndCellProps({ sheetId: sheetId, row: 1, column: 1, cellTypeOverride: 'STRING' })
    const { getByTestId } = renderWithRedux(<SheetCell {...props}/> ,{ store: createMockStore(mockAppState) })
    expect(getByTestId('SheetCellString')).toBeTruthy()
  })

  it("begins editing the cell when double clicked", async () => {
    const { cell, props } = getCellAndCellProps({ sheetId: sheetId, row: 1, column: 1, cellTypeOverride: 'STRING' })
    const { getByText, getByTestId, queryByTestId } = renderWithRedux(<SheetCell {...props}/>,{ store: createMockStore(mockAppState) })
    expect(queryByTestId('SheetCellStringTextarea')).toBeNull()
    fireEvent.doubleClick(getByText(cell.value))
    expect(getByTestId('SheetCellStringTextarea')).toBeTruthy()
  })

  it("begins editing the cell when selected and the user enters a character key", async () => {
    const { cell, props } = getCellAndCellProps({ sheetId: sheetId, row: 1, column: 1, cellTypeOverride: 'STRING' })
    const { getByTestId, queryByTestId, queryByText } = renderWithRedux(<SheetCell {...props}/>,{ store: createMockStore(mockAppState) })
    expect(queryByTestId('SheetCellStringTextarea')).toBeNull()
    const SheetCellString = getByTestId('SheetCellString')
    fireEvent.mouseDown(SheetCellString)
    fireEvent.keyDown(SheetCellString, { key: 'a' })
    const SheetCellStringTextarea = await waitForElement(() => getByTestId('SheetCellStringTextarea'))
    expect(SheetCellStringTextarea).toBeTruthy()
    expect(queryByText(cell.value)).toBeNull()
    expect(queryByText('a')).toBeTruthy()
    expect(axiosMock.patch).toHaveBeenCalled()
  })

  it("correctly updates its value on user input", async () => {
    const { props } = getCellAndCellProps({ sheetId: sheetId, row: 1, column: 1, cellTypeOverride: 'STRING' })
    const { getByTestId, queryByTestId, queryByText } = renderWithRedux(<SheetCell {...props}/>,{ store: createMockStore(mockAppState) })
    expect(queryByTestId('SheetCellStringTextarea')).toBeNull()
    const SheetCellStringBefore = getByTestId('SheetCellString')
    fireEvent.mouseDown(SheetCellStringBefore)
    fireEvent.keyDown(SheetCellStringBefore, { key: 't' })
    const SheetCellStringTextarea = await waitForElement(() => getByTestId('SheetCellStringTextarea'))
    fireEvent.change(SheetCellStringTextarea, { target: { value: 'te' }})
    fireEvent.change(SheetCellStringTextarea, { target: { value: 'tes' }})
    fireEvent.change(SheetCellStringTextarea, { target: { value: 'test' }})
    expect(queryByText('test')).toBeTruthy()
    expect(axiosMock.patch).toHaveBeenCalled()
  })
})
