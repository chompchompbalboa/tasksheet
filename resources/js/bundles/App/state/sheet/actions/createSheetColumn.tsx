//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { batch } from 'react-redux'
import { v4 as createUuid } from 'uuid'

import clone from '@/utils/clone'

import { mutation } from '@app/api'

import { IAppState } from '@app/state'
import { IThunkAction, IThunkDispatch } from '@app/state/types'
import { 
  ISheet, 
  IAllSheetCells, ISheetCell,
  IAllSheetRows
} from '@app/state/sheet/types'

import { createHistoryStep } from '@app/state/history/actions'
import { 
  clearSheetSelection,
  setAllSheetCells,
  setAllSheetColumns,
  setAllSheetRows,
  updateSheet,
} from '@app/state/sheet/actions'

import { defaultCell, defaultColumn } from '@app/state/sheet/defaults'

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
    } = getState().sheet

    const sheet = allSheets[sheetId]
    const sheetVisibleColumns = sheet.visibleColumns.length === 0 ? clone(sheet.columns) : clone(sheet.visibleColumns)

    const newColumn = defaultColumn(sheetId, newColumnVisibleColumnsIndex)
    const newCells: ISheetCell[] = []

    const nextSheetVisibleColumns = [
      ...sheetVisibleColumns.slice(0, newColumnVisibleColumnsIndex),
      newColumn.id,
      ...sheetVisibleColumns.slice(newColumnVisibleColumnsIndex)
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
          visibleColumns: sheetVisibleColumns
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