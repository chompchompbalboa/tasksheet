//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import 'jest-styled-components'
import '@testing-library/jest-dom/extend-expect'
import axiosMock from 'axios'

//import { fireEvent, renderWithRedux, waitForElement } from '@app/testing/library'
import { renderWithRedux } from '@app/testing/library'
import { appStateFactory, appStateFactoryColumns, IAppStateFactoryInput } from '@app/testing/mocks/appState'
import { createMockStore, mockAppState } from '@app/testing/mocks'

//import { App } from '@app/App'
import { SheetColumnContextMenu, ISheetColumnContextMenuProps } from '@app/bundles/Sheet/SheetColumnContextMenu'

//-----------------------------------------------------------------------------
// Mocks
//-----------------------------------------------------------------------------
const {
  allFiles,
  allFileIds,
  allSheets,
  allSheetsFromDatabase,
  allSheetViews
} = appStateFactory({} as IAppStateFactoryInput)

const fileId = allFileIds[0]
const sheetId = allFiles[fileId].typeId
const sheet = allSheets[sheetId]
const activeSheetView = allSheetViews[sheet.activeSheetViewId]
const sheetColumnId = activeSheetView.visibleColumns[0]

console.warn = jest.fn()

const sheetFromDatabase = allSheetsFromDatabase[sheetId]

// @ts-ignore
axiosMock.get.mockResolvedValue({ data: sheetFromDatabase })
// @ts-ignore
axiosMock.post.mockResolvedValue({ data: null })
// @ts-ignore
axiosMock.patch.mockResolvedValue({ data: null })

jest.setTimeout(10000)

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
const sheetColumnContextMenuProps: ISheetColumnContextMenuProps = {
  sheetId: sheetId,
  columnId: sheetColumnId,
  columnIndex: 0,
  closeContextMenu: jest.fn(),
  contextMenuLeft: 50,
  contextMenuTop: 100,
  contextMenuRight: null
}

//-----------------------------------------------------------------------------
// Tests
//-----------------------------------------------------------------------------
describe('SheetColumnContextMenu', () => {
  
  // The Autosizer from react-window relies on DOM properties that don't exist 
  // in JSDom. We need to replace those properties so it can properly calculate
  // the grid dimensions and render the children. This solution comes from here:
  // https://github.com/bvaughn/react-virtualized/issues/493#issuecomment-447014986
  const originalOffsetHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetHeight')
  const originalOffsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth')

  beforeAll(() => {
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', { configurable: true, value: 240 }) // 10 rows
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', { configurable: true, value: appStateFactoryColumns.length * 100 })
  })

  afterAll(() => {
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', originalOffsetHeight);
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', originalOffsetWidth);
  })
  
  it("renders without crashing", async () => {
    const { getByTestId } = renderWithRedux(<SheetColumnContextMenu {...sheetColumnContextMenuProps}/>, { store: createMockStore(mockAppState) })
    const SheetColumnContextMenuContainer = getByTestId('SheetColumnContextMenu')
    expect(SheetColumnContextMenuContainer).toBeTruthy()
    expect(SheetColumnContextMenuContainer).toHaveStyleRule('top', '100px')
    expect(SheetColumnContextMenuContainer).toHaveStyleRule('left', '50px')
  })

  /*
  it("contains the item 'Column Settings' which navigates the user to the settings for the current column type on click", async () => {
    const { getAllByTestId, getByTestId } = renderWithRedux(<App />, { store: createMockStore(mockAppState) })
    const SheetHeaders = await waitForElement(() => getAllByTestId('SheetHeader'))
    const C1SheetHeader = SheetHeaders[0]

    fireEvent.contextMenu(C1SheetHeader)
    return waitForElement(() => getByTestId('SheetColumnContextMenuColumnSettings')).then(ColumnSettingsItem => {
      fireEvent.click(ColumnSettingsItem)
      return waitForElement(() => getByTestId('SheetSettingsColumnSettings')).then(SheetSettingsColumnSettings => {
        expect(SheetSettingsColumnSettings).toBeTruthy()
      })
    })
  })
  */

})