//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import axiosMock from 'axios'

import { 
  createMockStore, 
  IMockAppStateFactoryInput,
  mockAppState,
  mockAppStateFactory
} from '@/testing/mocks'
import {
  flushPromises
} from '@/testing/utils'

import { IAppState } from '@/state'
import { 
  ISheet,
  ISheetColumn,
  ISheetView
} from '@/state/sheet/types'
import {
  createSheetColumns
} from '@/state/sheet/actions'

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
// Tests
//-----------------------------------------------------------------------------
describe('createSheetColumns', () => {

  const store = (appState: IAppState = mockAppState) => {
    const {
      dispatch,
      getState,
    } = createMockStore(appState)
    return {
      dispatch,
      getState,
    }
  }

  describe("correctly inserts 1 column", () => {

    let newColumnId: ISheetColumn['id'],
        nextActiveSheetView: ISheetView,
        nextSheet: ISheet,
        nextState: IAppState,
        state: IAppState

    beforeAll(async () => {
      (axiosMock.post as jest.Mock).mockResolvedValueOnce({});
      (axiosMock.patch as jest.Mock).mockResolvedValueOnce({});
      const { dispatch, getState } = store()
      state = getState()
      dispatch(createSheetColumns(sheetId, columnIndex))
      await flushPromises()
      nextState = getState()
      nextSheet = nextState.sheet.allSheets[sheetId]
      nextActiveSheetView = nextState.sheet.allSheetViews[activeSheetView.id]
      newColumnId = nextActiveSheetView.visibleColumns[Math.max(0, columnIndex - 1)]
    })

    it("correctly creates a new column in allSheetColumns", () => {
      expect(state.sheet.allSheetColumns[newColumnId]).not.toBeTruthy()
      expect(nextState.sheet.allSheetColumns[newColumnId]).toBeTruthy()
    })

    it("correctly updates the active sheet view's visibleColumns", () => {
      expect(activeSheetView.visibleColumns.indexOf(newColumnId)).toBe(-1)
      expect(nextActiveSheetView.visibleColumns.indexOf(newColumnId)).not.toBe(-1)
      expect(nextActiveSheetView.visibleColumns.length).toBe(activeSheetView.visibleColumns.length + 1)
      expect(nextActiveSheetView.visibleColumns.indexOf(columnId)).toBe(activeSheetView.visibleColumns.indexOf(columnId) + 1)
    })

    it("correctly updates the sheet's columns", () => {
      expect(sheet.columns.indexOf(newColumnId)).toBe(-1)
      expect(nextSheet.columns.indexOf(newColumnId)).not.toBe(-1)
    })

    it("correctly creates the new column's cells", () => {
      expect(Object.keys(nextState.sheet.allSheetCells).length).toBe(
        Object.keys(state.sheet.allSheetCells).length + sheet.rows.length
      )
    })

    it("attempts to save the new column and cells", () => {
      expect(axiosMock.post).toHaveBeenCalled()
    })

    it("attempts to save the updated sheet view", () => {
      expect(axiosMock.patch).toHaveBeenCalled()
    })

    it("correctly creates a history step", () => {
      expect(nextState.history.steps.length).toBe(state.history.steps.length + 1)
    })

  })

  describe("correctly inserts 3 columns", () => {

    let newColumnId1: ISheetColumn['id'],
        newColumnId2: ISheetColumn['id'],
        newColumnId3: ISheetColumn['id'],
        nextActiveSheetView: ISheetView,
        nextSheet: ISheet,
        nextState: IAppState,
        state: IAppState

    beforeAll(async () => {
      (axiosMock.post as jest.Mock).mockResolvedValueOnce({});
      (axiosMock.patch as jest.Mock).mockResolvedValueOnce({});
      const { dispatch, getState } = store()
      state = getState()
      dispatch(createSheetColumns(sheetId, columnIndex, 3))
      await flushPromises()
      nextState = getState()
      nextSheet = nextState.sheet.allSheets[sheetId]
      nextActiveSheetView = nextState.sheet.allSheetViews[activeSheetView.id]
      newColumnId1 = nextActiveSheetView.visibleColumns[Math.max(0, columnIndex - 3)]
      newColumnId2 = nextActiveSheetView.visibleColumns[Math.max(1, columnIndex - 2)]
      newColumnId3 = nextActiveSheetView.visibleColumns[Math.max(2, columnIndex - 1)]
    })

    it("correctly creates the new columns in allSheetColumns", () => {
      expect(state.sheet.allSheetColumns[newColumnId1]).not.toBeTruthy()
      expect(state.sheet.allSheetColumns[newColumnId2]).not.toBeTruthy()
      expect(state.sheet.allSheetColumns[newColumnId3]).not.toBeTruthy()
      expect(nextState.sheet.allSheetColumns[newColumnId1]).toBeTruthy()
      expect(nextState.sheet.allSheetColumns[newColumnId2]).toBeTruthy()
      expect(nextState.sheet.allSheetColumns[newColumnId3]).toBeTruthy()
    })

    it("correctly updates the active sheet view's visibleColumns", () => {
      expect(activeSheetView.visibleColumns.indexOf(newColumnId1)).toBe(-1)
      expect(activeSheetView.visibleColumns.indexOf(newColumnId2)).toBe(-1)
      expect(activeSheetView.visibleColumns.indexOf(newColumnId3)).toBe(-1)
      expect(nextActiveSheetView.visibleColumns.length).toBe(activeSheetView.visibleColumns.length + 3)
      expect(nextActiveSheetView.visibleColumns.indexOf(columnId)).toBe(activeSheetView.visibleColumns.indexOf(columnId) + 3)
    })

    it("correctly updates the sheet's columns", () => {
      expect(sheet.columns.indexOf(newColumnId1)).toBe(-1)
      expect(sheet.columns.indexOf(newColumnId2)).toBe(-1)
      expect(sheet.columns.indexOf(newColumnId3)).toBe(-1)
      expect(nextSheet.columns.indexOf(newColumnId1)).not.toBe(-1)
      expect(nextSheet.columns.indexOf(newColumnId2)).not.toBe(-1)
      expect(nextSheet.columns.indexOf(newColumnId3)).not.toBe(-1)
    })

    it("correctly creates the new column's cells", () => {
      expect(Object.keys(nextState.sheet.allSheetCells).length).toBe(
        Object.keys(state.sheet.allSheetCells).length + ( sheet.rows.length * 3 )
      )
    })

    it("attempts to save the new column and cells", () => {
      expect(axiosMock.post).toHaveBeenCalled()
    })

    it("attempts to save the updated sheet view", () => {
      expect(axiosMock.patch).toHaveBeenCalled()
    })

    it("correctly creates a history step", () => {
      expect(nextState.history.steps.length).toBe(state.history.steps.length + 1)
    })

  })
  
})