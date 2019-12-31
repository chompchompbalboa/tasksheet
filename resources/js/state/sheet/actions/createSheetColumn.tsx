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
  clearSheetSelection,
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

    dispatch(clearSheetSelection(sheetId))

    const {
      allSheets,
      allSheetColumns,
      allSheetRows,
      allSheetCells,
      allSheetViews
    } = getState().sheet

    const sheet = allSheets[sheetId]
    const activeSheetView = allSheetViews[sheet.activeSheetViewId]
    const sheetViewVisibleColumns = activeSheetView.visibleColumns.length === 0 ? clone(sheet.columns) : clone(activeSheetView.visibleColumns)

    const newColumn = defaultColumn(sheetId)
    const newCells: ISheetCell[] = []

    const nextSheetVisibleColumns = [
      ...sheetViewVisibleColumns.slice(0, newColumnVisibleColumnsIndex),
      newColumn.id,
      ...sheetViewVisibleColumns.slice(newColumnVisibleColumnsIndex)
    ]
    const nextSheetColumns = [
      ...sheet.columns,
      newColumn.id
    ]
    const nextAllSheetCells: IAllSheetCells = clone(allSheetCells)
    const nextAllSheetRows: IAllSheetRows = clone(allSheetRows)

    sheet.rows.forEach(rowId => {
      const newCell = defaultCell(sheetId, rowId, newColumn.id, createUuid())
      nextAllSheetCells[newCell.id] = newCell
      nextAllSheetRows[rowId].cells = { ...nextAllSheetRows[rowId].cells, [newCell.columnId]: newCell.id }
      newCells.push(newCell)
    })

    const actions = () => {
      batch(() => {
        dispatch(setAllSheetColumns({
          ...allSheetColumns,
          [newColumn.id]: newColumn
        }))
        dispatch(updateSheet(sheetId, {
          columns: nextSheetColumns
        }))
        dispatch(updateSheetView(activeSheetView.id, {
          visibleColumns: nextSheetVisibleColumns
        }))
        dispatch(setAllSheetCells(nextAllSheetCells))
        dispatch(setAllSheetRows(nextAllSheetRows))
      })
      mutation.createSheetColumn(newColumn, newCells)
    }

    const undoActions = () => {
      batch(() => {
        dispatch(setAllSheetColumns(allSheetColumns))
        dispatch(updateSheet(sheetId, {
          columns: sheet.columns
        }))
        dispatch(updateSheetView(activeSheetView.id, {
          visibleColumns: sheetViewVisibleColumns
        }))
        dispatch(setAllSheetCells(allSheetCells))
        dispatch(setAllSheetRows(allSheetRows))
      })
      mutation.deleteSheetColumn(newColumn.id)
    }

    dispatch(createHistoryStep({actions, undoActions}))

    actions()
  }
}