//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import 'jest-styled-components'
import '@testing-library/jest-dom/extend-expect'
import axiosMock from 'axios'

//import { fireEvent, renderWithRedux, waitForElement } from '@/testing/library'
import { renderWithRedux } from '@/testing/library'
import { appStateFactory, IAppStateFactoryInput } from '@/testing/mocks/appState'
import { createMockStore, mockAppState } from '@/testing/mocks'

//import { App } from '@app/App'
import { SheetColumnContextMenu, ISheetColumnContextMenuProps } from '@desktop/Sheet/SheetColumnContextMenu'

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

  // JSDom returns 0 for all getBoundingClientRect values (since its not actually
  // rendering anything). SheetWindow relies on the width and height property to
  // calculate the sheet size, so we need to mock those vaulues in.
  beforeAll(() => {
    Object.defineProperty(HTMLElement.prototype, 'getBoundingClientRect', { writable: true, value: () => ({
      width: 1024,
      height: 768
    }) })
  })
  
  it("renders without crashing", async () => {
    const { getByTestId } = renderWithRedux(<SheetColumnContextMenu {...sheetColumnContextMenuProps}/>, { store: createMockStore(mockAppState) })
    const SheetColumnContextMenuContainer = getByTestId('SheetColumnContextMenu')
    expect(SheetColumnContextMenuContainer).toBeTruthy()
    expect(SheetColumnContextMenuContainer).toHaveStyleRule('top', '100px')
    expect(SheetColumnContextMenuContainer).toHaveStyleRule('left', '50px')
  })
})