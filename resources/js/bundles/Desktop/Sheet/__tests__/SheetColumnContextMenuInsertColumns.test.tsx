//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import axiosMock from 'axios'
import 'jest-styled-components'

import { 
  fireEvent,
  renderWithRedux 
} from '@/testing/library'
import { 
  createMockStore, 
  IMockAppStateFactoryInput,
  mockAppState,
  mockAppStateFactory
} from '@/testing/mocks'

import { IAppState } from '@/state'

import SheetColumnContextMenuInsertColumns, { ISheetColumnContextMenuInsertColumnsProps } from '@/bundles/Desktop/Sheet/SheetColumnContextMenuInsertColumns'

//-----------------------------------------------------------------------------
// Mocks
//-----------------------------------------------------------------------------
const {
  allFiles,
  allFileIds,
  allSheets,
  allSheetViews
} = mockAppStateFactory({} as IMockAppStateFactoryInput)

const fileId = allFileIds[0]
const sheetId = allFiles[fileId].typeId
const sheet = allSheets[sheetId]
const activeSheetView = allSheetViews[sheet.activeSheetViewId]
const columnIndex = 0
const columnId = activeSheetView.visibleColumns[columnIndex]

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
const props: ISheetColumnContextMenuInsertColumnsProps = {
  sheetId: sheetId,
  columnIndex: columnIndex,
  closeContextMenu: jest.fn(),
}

//-----------------------------------------------------------------------------
// Tests
//-----------------------------------------------------------------------------
describe('SheetColumnContextMenuInsertColumn', () => {

  beforeEach(() => {
    (axiosMock.post as jest.Mock).mockResolvedValueOnce({});
    (axiosMock.patch as jest.Mock).mockResolvedValueOnce({});
  })

  const sheetColumnContextMenu = (appState: IAppState = mockAppState) => {
    const {
      getByPlaceholderText,
      getByText,
      store: {
        getState
      }
    } = renderWithRedux(<SheetColumnContextMenuInsertColumns {...props} />, { store: createMockStore(appState) })
    const insertColumnText = getByText("Insert")
    const insertColumnInput = getByPlaceholderText("1") as HTMLInputElement
    return {
      getState,
      insertColumnInput,
      insertColumnText
    }
  }
  
  it("displays a menu item with an input to insert columns before the current column", () => {
    const { insertColumnInput, insertColumnText } = sheetColumnContextMenu()
    expect(insertColumnInput).toBeTruthy()
    expect(insertColumnText).toBeTruthy()
  })
  
  it("correctly updates the input value", () => {
    const { insertColumnInput } = sheetColumnContextMenu()
    const nextInputValue = "6"
    fireEvent.change(insertColumnInput, { target: { value: nextInputValue } })
    expect(insertColumnInput.value).toBe(nextInputValue)
  })
  
  it("limits the input value to a maximum of 10", () => {
    const { insertColumnInput } = sheetColumnContextMenu()
    fireEvent.change(insertColumnInput, { target: { value: "11" } })
    expect(insertColumnInput.value).toBe("10")
  })
  
  it("correctly inserts 1 column", () => {
    const { getState, insertColumnInput, insertColumnText } = sheetColumnContextMenu()
    const visibleColumnsCount = activeSheetView.visibleColumns.length
    fireEvent.change(insertColumnInput, { target: { value: "1" } })
    insertColumnText.click()
    expect(getState().sheet.allSheetViews[activeSheetView.id].visibleColumns.length).toBe(visibleColumnsCount + 1)
    expect(getState().sheet.allSheetViews[activeSheetView.id].visibleColumns.indexOf(columnId)).toBe(columnIndex + 1)
  })
  
  it("correctly inserts 5 columns", () => {
    const { getState, insertColumnInput, insertColumnText } = sheetColumnContextMenu()
    const visibleColumnsCount = activeSheetView.visibleColumns.length
    fireEvent.change(insertColumnInput, { target: { value: "5" } })
    insertColumnText.click()
    expect(getState().sheet.allSheetViews[activeSheetView.id].visibleColumns.length).toBe(visibleColumnsCount + 5)
    expect(getState().sheet.allSheetViews[activeSheetView.id].visibleColumns.indexOf(columnId)).toBe(columnIndex + 5)
  })
  
})