//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import 'jest-styled-components'
import '@testing-library/jest-dom/extend-expect'

import { renderWithRedux } from '@/testing/library'
import { 
  createMockStore, 
  IMockAppStateFactoryInput,
  mockAppState,
  mockAppStateFactory
} from '@/testing/mocks'

import { IAppState } from '@/state'

import SheetColumnContextMenu, { ISheetColumnContextMenuProps } from '@desktop/Sheet/SheetColumnContextMenu'

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
const sheetColumnId = activeSheetView.visibleColumns[0]

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
const props: ISheetColumnContextMenuProps = {
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

  const sheetColumnContextMenu = (appState: IAppState = mockAppState) => {
    const {
      getByTestId
    } = renderWithRedux(<SheetColumnContextMenu {...props} />, { store: createMockStore(appState) })
    const insertColumn = getByTestId("SheetColumnContextMenuInsertColumnContainer")
    return {
      insertColumn
    }
  }
  
  it("displays a menu item to insert a new column", () => {
    const { insertColumn } = sheetColumnContextMenu()
    expect(insertColumn).toBeTruthy()
  })

})