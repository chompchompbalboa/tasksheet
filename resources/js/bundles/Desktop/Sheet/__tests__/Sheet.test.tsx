//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import 'jest-styled-components'
import '@testing-library/jest-dom/extend-expect'
import axiosMock from 'axios'

import { fireEvent, renderWithRedux, waitForElement } from '@/testing/library'
import { appStateFactory, IAppStateFactoryInput, getCellAndCellProps } from '@/testing/mocks/appState'

import { Sheet, ISheetProps } from '@desktop/Sheet/Sheet'

//-----------------------------------------------------------------------------
// Mocks
//-----------------------------------------------------------------------------
const {
  allFiles,
  allFileIds,
  allSheetsFromDatabase
} = appStateFactory({} as IAppStateFactoryInput)

const fileId = allFileIds[0]
const sheetId = allFiles[fileId].typeId

console.warn = jest.fn()
console.error = jest.fn()

const getSheetUrl = '/app/sheets/' + sheetId
const sheetFromDatabase = allSheetsFromDatabase[sheetId]

// @ts-ignore
axiosMock.get.mockResolvedValue({ data: sheetFromDatabase })
// @ts-ignore
axiosMock.patch.mockResolvedValue({ data: null })

jest.setTimeout(10000)

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
const props: ISheetProps = {
  fileId: fileId,
  id: sheetId
}

//-----------------------------------------------------------------------------
// Tests
//-----------------------------------------------------------------------------
describe('Sheet', () => {

  // JSDom returns 0 for all getBoundingClientRect values (since its not actually
  // rendering anything). SheetWindow relies on the width and height property to
  // calculate the sheet size, so we need to mock those vaulues in.
  beforeAll(() => {
    Object.defineProperty(HTMLElement.prototype, 'getBoundingClientRect', { writable: true, value: () => ({
      width: 1024,
      height: 768
    }) })
  })
  
  // Tests
  it("shows the loading timer when the sheet is active but has not loaded", async () => {
    const { getByTestId } = renderWithRedux(<Sheet {...props}/>)
    expect(getByTestId('SheetContainer')).toHaveTextContent('seconds')
  })

  it("loads the sheet", async () => {
    const { getAllByTestId, queryByTestId } = renderWithRedux(<Sheet {...props}/>)
    expect(axiosMock.get).toHaveBeenCalled()
    expect(axiosMock.get).toHaveBeenCalledWith(getSheetUrl)
    expect(queryByTestId('SheetCell')).not.toBeTruthy() 
    const SheetCellContainers = await waitForElement(() => getAllByTestId('SheetCell'))
    expect(SheetCellContainers.length).toBeGreaterThan(0)
  })

  it("copy and pastes a single cell", async () => {
    const { cell: R1C1Cell } = getCellAndCellProps({ sheetId: sheetId, row: 1, column: 1 })
    const { cell: R2C2Cell } = getCellAndCellProps({ sheetId: sheetId, row: 2, column: 2 })
    const { getByTestId, getByText } = renderWithRedux(<Sheet {...props}/>)
    const SheetContainer = await waitForElement(() => getByTestId('SheetContainer'))
    const R1C1CellContainer = await waitForElement(() => getByText(R1C1Cell.value))
    const R2C2CellContainer = await waitForElement(() => getByText(R2C2Cell.value))
    
    fireEvent.mouseDown(R1C1CellContainer)
    fireEvent.copy(SheetContainer)
    fireEvent.mouseDown(R2C2CellContainer)
    fireEvent.paste(SheetContainer)
    expect(R2C2CellContainer).toHaveTextContent(R1C1Cell.value)
    expect(axiosMock.patch).toHaveBeenCalled()
  })

  it("copy and pastes a range", async () => {
    const { cell: R1C1Cell } = getCellAndCellProps({ sheetId: sheetId, row: 1, column: 1 })
    const { cell: R1C2Cell } = getCellAndCellProps({ sheetId: sheetId, row: 1, column: 2 })
    const { cell: R1C3Cell } = getCellAndCellProps({ sheetId: sheetId, row: 1, column: 3 })
    const { cell: R1C4Cell } = getCellAndCellProps({ sheetId: sheetId, row: 1, column: 4 })
    const { cell: R2C1Cell } = getCellAndCellProps({ sheetId: sheetId, row: 2, column: 1 })
    const { cell: R2C2Cell } = getCellAndCellProps({ sheetId: sheetId, row: 2, column: 2 })
    const { cell: R2C3Cell } = getCellAndCellProps({ sheetId: sheetId, row: 2, column: 3 })
    const { cell: R2C4Cell } = getCellAndCellProps({ sheetId: sheetId, row: 2, column: 4 })

    const { getByTestId, getByText } = renderWithRedux(<Sheet {...props}/>)
    const SheetContainer = await waitForElement(() => getByTestId('SheetContainer'))
    const R1C1CellContainer = await waitForElement(() => getByText(R1C1Cell.value))
    const R1C3CellContainer = await waitForElement(() => getByText(R1C3Cell.value))
    const R1C4CellContainer = await waitForElement(() => getByText(R1C4Cell.value))
    const R2C2CellContainer = await waitForElement(() => getByText(R2C2Cell.value))
    const R2C3CellContainer = await waitForElement(() => getByText(R2C3Cell.value))
    const R2C4CellContainer = await waitForElement(() => getByText(R2C4Cell.value))
    
    fireEvent.mouseDown(R1C1CellContainer)
    fireEvent.mouseDown(R2C2CellContainer, { shiftKey: true })
    fireEvent.copy(SheetContainer)
    fireEvent.mouseDown(R1C3CellContainer)
    fireEvent.paste(SheetContainer)
    expect(R1C3CellContainer).toHaveTextContent(R1C1Cell.value)
    expect(R1C4CellContainer).toHaveTextContent(R1C2Cell.value)
    expect(R2C3CellContainer).toHaveTextContent(R2C1Cell.value)
    expect(R2C4CellContainer).toHaveTextContent(R2C2Cell.value)
    expect(axiosMock.patch).toHaveBeenCalled()
  })

  it("cut and pastes a single cell", async () => {
    const { cell: R1C1Cell } = getCellAndCellProps({ sheetId: sheetId, row: 1, column: 1 })
    const { cell: R2C2Cell } = getCellAndCellProps({ sheetId: sheetId, row: 2, column: 2 })
    const { getByTestId, getByText } = renderWithRedux(<Sheet {...props}/>)
    const SheetContainer = await waitForElement(() => getByTestId('SheetContainer'))
    const R1C1CellContainer = await waitForElement(() => getByText(R1C1Cell.value))
    const R2C2CellContainer = await waitForElement(() => getByText(R2C2Cell.value))
    
    fireEvent.mouseDown(R1C1CellContainer)
    fireEvent.cut(SheetContainer)
    fireEvent.mouseDown(R2C2CellContainer)
    fireEvent.paste(SheetContainer)
    expect(R1C1CellContainer).not.toHaveTextContent(R1C1Cell.value)
    expect(R2C2CellContainer).toHaveTextContent(R1C1Cell.value)
    expect(axiosMock.patch).toHaveBeenCalled()
  })

  it("cut and pastes a range", async () => {
    const { cell: R1C1Cell } = getCellAndCellProps({ sheetId: sheetId, row: 1, column: 1 })
    const { cell: R1C2Cell } = getCellAndCellProps({ sheetId: sheetId, row: 1, column: 2 })
    const { cell: R1C3Cell } = getCellAndCellProps({ sheetId: sheetId, row: 1, column: 3 })
    const { cell: R1C4Cell } = getCellAndCellProps({ sheetId: sheetId, row: 1, column: 4 })
    const { cell: R2C1Cell } = getCellAndCellProps({ sheetId: sheetId, row: 2, column: 1 })
    const { cell: R2C2Cell } = getCellAndCellProps({ sheetId: sheetId, row: 2, column: 2 })
    const { cell: R2C3Cell } = getCellAndCellProps({ sheetId: sheetId, row: 2, column: 3 })
    const { cell: R2C4Cell } = getCellAndCellProps({ sheetId: sheetId, row: 2, column: 4 })

    const { getByTestId, getByText } = renderWithRedux(<Sheet {...props}/>)
    const SheetContainer = await waitForElement(() => getByTestId('SheetContainer'))
    const R1C1CellContainer = await waitForElement(() => getByText(R1C1Cell.value))
    const R1C2CellContainer = await waitForElement(() => getByText(R1C2Cell.value))
    const R1C3CellContainer = await waitForElement(() => getByText(R1C3Cell.value))
    const R1C4CellContainer = await waitForElement(() => getByText(R1C4Cell.value))
    const R2C1CellContainer = await waitForElement(() => getByText(R2C1Cell.value))
    const R2C2CellContainer = await waitForElement(() => getByText(R2C2Cell.value))
    const R2C3CellContainer = await waitForElement(() => getByText(R2C3Cell.value))
    const R2C4CellContainer = await waitForElement(() => getByText(R2C4Cell.value))
    
    fireEvent.mouseDown(R1C1CellContainer)
    fireEvent.mouseDown(R2C2CellContainer, { shiftKey: true })
    fireEvent.cut(SheetContainer)
    fireEvent.mouseDown(R1C3CellContainer)
    fireEvent.paste(SheetContainer)
    expect(R1C1CellContainer).not.toHaveTextContent(R1C1Cell.value)
    expect(R1C2CellContainer).not.toHaveTextContent(R1C2Cell.value)
    expect(R2C1CellContainer).not.toHaveTextContent(R2C1Cell.value)
    expect(R2C2CellContainer).not.toHaveTextContent(R2C2Cell.value)
    expect(R1C3CellContainer).toHaveTextContent(R1C1Cell.value)
    expect(R1C4CellContainer).toHaveTextContent(R1C2Cell.value)
    expect(R2C3CellContainer).toHaveTextContent(R2C1Cell.value)
    expect(R2C4CellContainer).toHaveTextContent(R2C2Cell.value)
    expect(axiosMock.patch).toHaveBeenCalled()
  })

})