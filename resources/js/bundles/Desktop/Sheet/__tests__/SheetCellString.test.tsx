//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import 'jest-styled-components'
import '@testing-library/jest-dom/extend-expect'
import axiosMock from 'axios'

import { cleanup, fireEvent, renderWithRedux, waitForElement } from '@/testing/library'
import { 
  createMockStore,
  getCellAndCellProps,
  mockAppState 
} from '@/testing/mocks'

import { SheetCell } from '@desktop/Sheet/SheetCell'

//-----------------------------------------------------------------------------
// Setup
//-----------------------------------------------------------------------------
const {
  folder: {
    allFolders,
    allFiles
  }
} = mockAppState

const folderId = Object.keys(allFolders)[0]
const fileId = allFolders[folderId].files[0]
const file = allFiles[fileId]
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
    expect(queryByTestId('SheetCellStringInput')).toBeNull()
    fireEvent.doubleClick(getByText(cell.value))
    expect(getByTestId('SheetCellStringInput')).toBeTruthy()
  })

  it("begins editing the cell when selected and the user enters a character key", async () => {
    const { cell, props } = getCellAndCellProps({ sheetId: sheetId, row: 1, column: 1, cellTypeOverride: 'STRING' })
    const { getByTestId, queryByTestId, queryByText } = renderWithRedux(<SheetCell {...props}/>,{ store: createMockStore(mockAppState) })
    expect(queryByTestId('SheetCellStringInput')).toBeNull()
    const SheetCellString = getByTestId('SheetCellString')
    fireEvent.mouseDown(SheetCellString)
    fireEvent.keyDown(SheetCellString, { key: 'a' })
    const SheetCellStringInput = await waitForElement(() => getByTestId('SheetCellStringInput'))
    expect(SheetCellStringInput).toBeTruthy()
    expect(queryByText(cell.value)).toBeNull()
    expect(SheetCellStringInput).toHaveValue('a')
  })

  it("correctly updates its value on user input", async () => {
    const { cell, props } = getCellAndCellProps({ sheetId: sheetId, row: 1, column: 1, cellTypeOverride: 'STRING' })
    const { getByTestId, queryByTestId, queryByText } = renderWithRedux(<SheetCell {...props}/>,{ store: createMockStore(mockAppState) })
    expect(queryByTestId('SheetCellStringInput')).toBeNull()
    const SheetCellStringBefore = getByTestId('SheetCellString')
    fireEvent.mouseDown(SheetCellStringBefore)
    fireEvent.keyDown(SheetCellStringBefore, { key: 't' })
    const SheetCellStringInput = await waitForElement(() => getByTestId('SheetCellStringInput'))
    expect(queryByText(cell.value)).toBeNull()
    fireEvent.change(SheetCellStringInput, { target: { value: 'te' }})
    fireEvent.change(SheetCellStringInput, { target: { value: 'tes' }})
    fireEvent.change(SheetCellStringInput, { target: { value: 'test' }})
    expect(SheetCellStringInput).toHaveValue('test')
  })
})
