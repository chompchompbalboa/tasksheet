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
  IAllSheetColumns, ISheetColumn,
  IAllSheetRows,
  IAllSheetCells, ISheetCell,
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
export const createSheetColumns = (
  sheetId: ISheet['id'],
  insertAtVisibleColumnIndex: number,
  numberOfColumnsToCreate: number = 1
): IThunkAction => {
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
    let nextSheetColumns = clone(sheet.columns)
    let nextSheetViewVisibleColumns = activeSheetView.visibleColumns.length === 0 
      ? clone(sheet.columns) 
      : clone(activeSheetView.visibleColumns)
    const nextAllSheetColumns: IAllSheetColumns = clone(allSheetColumns)
    const nextAllSheetRows: IAllSheetRows = clone(allSheetRows)
    const nextAllSheetCells: IAllSheetCells = clone(allSheetCells)
    const newColumns: ISheetColumn[] = []
    const newColumnIds: ISheetColumn['id'][] = []
    const newCells: ISheetCell[] = []

    // For each new column
    for(let i = 0; i < numberOfColumnsToCreate; i++) {

      // Get the new column
      const newColumn = defaultColumn(sheetId)

      // Add the new columns to the sheet
      nextAllSheetColumns[newColumn.id] = newColumn
      nextSheetViewVisibleColumns.splice(insertAtVisibleColumnIndex + i, 0, newColumn.id)
      nextSheetColumns.push(newColumn.id)
      newColumns.push(newColumn)
      newColumnIds.push(newColumn.id)

      // Create the new cells for each row
      sheet.rows.forEach(rowId => {
        const newCell = defaultCell(sheetId, rowId, newColumn.id, createUuid())
        nextAllSheetCells[newCell.id] = newCell
        nextAllSheetRows[rowId].cells = { ...nextAllSheetRows[rowId].cells, [newCell.columnId]: newCell.id }
        newCells.push(newCell)
      })
    }

    // Actions
    const actions = (isHistoryStep: boolean = false) => {
      batch(() => {
        dispatch(setAllSheetColumns(nextAllSheetColumns))
        dispatch(updateSheet(sheetId, {
          columns: nextSheetColumns,
          selections: sheet.selections
        }, true))
        dispatch(updateSheetView(activeSheetView.id, {
          visibleColumns: nextSheetViewVisibleColumns
        }))
        dispatch(setAllSheetCells(nextAllSheetCells))
        dispatch(setAllSheetRows(nextAllSheetRows))
      })
      if(!isHistoryStep) {
        mutation.createSheetColumns(newColumns, newCells)
      }
      else {
        mutation.restoreSheetColumns(newColumnIds)
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
          visibleColumns: activeSheetView.visibleColumns
        }))
        dispatch(setAllSheetCells(allSheetCells))
        dispatch(setAllSheetRows(allSheetRows))
      })
      mutation.deleteSheetColumns(newColumnIds)
    }

    // Dispatch the history step and call the actions
    dispatch(createHistoryStep({actions, undoActions}))
    actions()
  }
}