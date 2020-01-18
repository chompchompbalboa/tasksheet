//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { batch } from 'react-redux'
import { v4 as createUuid } from 'uuid'

import clone from '@/utils/clone'

import { mutation } from '@/api'

import { IAppState } from '@/state'
import { IThunkAction, IThunkDispatch } from '@/state/types'
import { 
  ISheet, 
  IAllSheetCells, ISheetCell,
  IAllSheetRows
} from '@/state/sheet/types'

import { createHistoryStep } from '@/state/history/actions'
import { 
  setAllSheetCells,
  setAllSheetColumns,
  setAllSheetRows,
  updateSheet,
  updateSheetView
} from '@/state/sheet/actions'

import { defaultCell, defaultColumn } from '@/state/sheet/defaults'

//-----------------------------------------------------------------------------
// Create Sheet Column
//-----------------------------------------------------------------------------
export const createSheetColumn = (sheetId: ISheet['id'], newColumnVisibleColumnsIndex: number): IThunkAction => {
  return async (dispatch: IThunkDispatch, getState: () => IAppState) => {

    const {
      allSheets,
      allSheetColumns,
      allSheetRows,
      allSheetCells,
      allSheetViews
    } = getState().sheet

    // Variables
    const sheet = allSheets[sheetId]
    const activeSheetView = allSheetViews[sheet.activeSheetViewId]
    const sheetViewVisibleColumns = activeSheetView.visibleColumns.length === 0 ? clone(sheet.columns) : clone(activeSheetView.visibleColumns)
    const newColumn = defaultColumn(sheetId)
    const newCells: ISheetCell[] = []
    const nextAllSheetCells: IAllSheetCells = clone(allSheetCells)
    const nextAllSheetRows: IAllSheetRows = clone(allSheetRows)

    // Get the next sheet visible columns
    const nextSheetVisibleColumns = [
      ...sheetViewVisibleColumns.slice(0, newColumnVisibleColumnsIndex),
      newColumn.id,
      ...sheetViewVisibleColumns.slice(newColumnVisibleColumnsIndex)
    ]

    // Get the next sheet columns
    const nextSheetColumns = [
      ...sheet.columns,
      newColumn.id
    ]

    // Create the new cells for each row
    sheet.rows.forEach(rowId => {
      const newCell = defaultCell(sheetId, rowId, newColumn.id, createUuid())
      nextAllSheetCells[newCell.id] = newCell
      nextAllSheetRows[rowId].cells = { ...nextAllSheetRows[rowId].cells, [newCell.columnId]: newCell.id }
      newCells.push(newCell)
    })

    // Actions
    const actions = (isHistoryStep: boolean = false) => {
      batch(() => {
        dispatch(setAllSheetColumns({
          ...allSheetColumns,
          [newColumn.id]: newColumn
        }))
        dispatch(updateSheet(sheetId, {
          columns: nextSheetColumns,
          selections: sheet.selections
        }, true))
        dispatch(updateSheetView(activeSheetView.id, {
          visibleColumns: nextSheetVisibleColumns
        }))
        dispatch(setAllSheetCells(nextAllSheetCells))
        dispatch(setAllSheetRows(nextAllSheetRows))
      })
      if(!isHistoryStep) {
        mutation.createSheetColumn(newColumn, newCells)
      }
      else {
        mutation.restoreSheetColumn(newColumn.id)
      }
    }

    // Undo Actions
    const undoActions = () => {
      batch(() => {
        dispatch(setAllSheetColumns(allSheetColumns))
        dispatch(updateSheet(sheetId, {
          columns: sheet.columns,
          selections: sheet.selections
        }, true))
        dispatch(updateSheetView(activeSheetView.id, {
          visibleColumns: sheetViewVisibleColumns
        }))
        dispatch(setAllSheetCells(allSheetCells))
        dispatch(setAllSheetRows(allSheetRows))
      })
      mutation.deleteSheetColumn(newColumn.id)
    }

    // Dispatch the history step and call the actions
    dispatch(createHistoryStep({actions, undoActions}))
    actions()
  }
}