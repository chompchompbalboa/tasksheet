//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import 'jest-styled-components'
import '@testing-library/jest-dom/extend-expect'
import axiosMock from 'axios'

import { fireEvent, renderWithRedux, wait, waitForElement } from '@app/testing/library'
import { appStateFactory, IAppStateFactoryInput, getCellAndCellProps } from '@app/testing/mocks/appState'

import { Sheet, ISheetProps } from '@app/bundles/Sheet/Sheet'
import { loadSheet } from '@app/state/sheet/actions'

//-----------------------------------------------------------------------------
// Mocks
//-----------------------------------------------------------------------------
const {
  allFiles,
  allFileIds,
  allSheetsFromDatabase
} = appStateFactory({} as IAppStateFactoryInput)

const fileId = allFileIds[0]
const sheetId = allFiles[allFileIds[0]].typeId

console.warn = jest.fn()
console.error = jest.fn()

const getSheetUrl = '/app/sheets/' + sheetId
const sheetFromDatabase = allSheetsFromDatabase[sheetId]

axiosMock.get.mockResolvedValue({ data: sheetFromDatabase })
axiosMock.patch.mockResolvedValue({ data: null })

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
  
  // The Autosizer from react-window relies on DOM properties that don't exist 
  // in JSDom. We need to replace those properties so it can properly calculate
  // the grid dimensions and render the children. This solution comes from here:
  // https://github.com/bvaughn/react-virtualized/issues/493#issuecomment-447014986
  const originalOffsetHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetHeight')
  const originalOffsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth')

  beforeAll(() => {
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', { configurable: true, value: 240 }) // 10 rows
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', { configurable: true, value: 500 }) // 5 columns
  })

  afterAll(() => {
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', originalOffsetHeight);
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', originalOffsetWidth);
  })
  
  // Tests
  it("shows the loading timer when the sheet is active but has not loaded", async () => {
    const { getByTestId } = renderWithRedux(<Sheet {...props}/>)
    wait()
    expect(getByTestId('SheetContainer')).toHaveTextContent('seconds')
  })

  it("loads the sheet", async () => {
    const { getAllByTestId, queryByTestId } = renderWithRedux(<Sheet {...props}/>)
    expect(axiosMock.get).toHaveBeenCalledTimes(1)
    expect(axiosMock.get).toHaveBeenCalledWith(getSheetUrl)
    expect(queryByTestId('SheetCellContainer')).not.toBeTruthy() 
    const SheetCellContainers = await waitForElement(() => getAllByTestId('SheetCellContainer'))
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
  })

})