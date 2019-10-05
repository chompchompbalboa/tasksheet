//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { batch } from 'react-redux'
import { v4 as createUuid } from 'uuid'

import { mutation } from '@app/api'

import { IAppState } from '@app/state'
import { IThunkAction, IThunkDispatch } from '@app/state/types'
import { 
  ISheetCell,
  ISheetRow, ISheetRowToDatabase
} from '@app/state/sheet/types'

import { 
  clearSheetSelection,
  setAllSheetCells,
  setAllSheetRows,
  updateSheet
} from '@app/state/sheet/actions'
import { createHistoryStep } from '@app/state/history/actions'

import { defaultCell, defaultRow } from '@app/state/sheet/defaults'

import { resolveSheetRowLeaders } from '@app/state/sheet/resolvers'

//-----------------------------------------------------------------------------
// Create Sheet Row
//-----------------------------------------------------------------------------
export const createSheetRows = (sheetId: string, numberOfRowsToAdd: number, insertBeforeRowId: ISheetRow['id']): IThunkAction => {
	return async (dispatch: IThunkDispatch, getState: () => IAppState) => {

    dispatch(clearSheetSelection(sheetId))
    
    const {
      allSheets,
      allSheetCells,
      allSheetRows,
    } = getState().sheet

    // Get sheet
    const sheet = allSheets[sheetId]
    const nextAllSheetCells = { ...allSheetCells }
    const nextAllSheetRows = { ...allSheetRows }
    const nextSheetRows = [ ...sheet.rows ] 
    const nextSheetVisibleRows = [ ...sheet.visibleRows ]
    const nextSheetDefaultVisibleRows = [ ...sheet.defaultVisibleRows ]
    const newRowsToDatabase: ISheetRowToDatabase[] = []
    const newRowIds: ISheetRow['id'][] = []

    const insertBeforeRowIdVisibleRowsIndex = nextSheetVisibleRows.indexOf(insertBeforeRowId)
    const insertBeforeRowIdDefaultVisibleRowsIndex = nextSheetDefaultVisibleRows.indexOf(insertBeforeRowId)
    console.log(insertBeforeRowIdDefaultVisibleRowsIndex)
    const newRowSheetId = sheet.sourceSheetId !== null ? sheet.sourceSheetId : sheetId
          
    for(let i = 0; i < numberOfRowsToAdd; i++) {
      const newRow = defaultRow(newRowSheetId, createUuid(), sheet.columns)
      const newRowCellsToDatabase: ISheetCell[] = []
      Object.keys(newRow.cells).forEach((columnId: string, index: number) => {
        const cellId = newRow.cells[columnId]
        const newCell = defaultCell(sheetId, newRow.id, sheet.columns[index], cellId)
        nextAllSheetCells[cellId] = newCell
        newRowCellsToDatabase.push(newCell)
      })
      nextAllSheetRows[newRow.id] = newRow
      nextSheetRows.push(newRow.id)
      nextSheetDefaultVisibleRows.splice(insertBeforeRowIdDefaultVisibleRowsIndex + i, 0, newRow.id)
      nextSheetVisibleRows.splice(insertBeforeRowIdVisibleRowsIndex + i, 0, newRow.id)
      const newRowToDatabase = {
        ...newRow,
        cells: newRowCellsToDatabase
      }
      newRowsToDatabase.push(newRowToDatabase)
      newRowIds.push(newRow.id)
    }
    
    const nextSheetRowLeaders = resolveSheetRowLeaders(nextSheetVisibleRows)
    const actions = () => {
      batch(() => {
        dispatch(setAllSheetRows(nextAllSheetRows))
        dispatch(setAllSheetCells(nextAllSheetCells))
        dispatch(updateSheet(sheetId, {
          rowLeaders: nextSheetRowLeaders,
          rows: nextSheetRows,
          visibleRows: nextSheetVisibleRows,
          defaultVisibleRows: nextSheetDefaultVisibleRows
        }))
        mutation.createSheetRows(newRowsToDatabase)
      })
    }
    const undoActions = () => {
      batch(() => {
        dispatch(setAllSheetRows(allSheetRows))
        dispatch(setAllSheetCells(allSheetCells))
        dispatch(updateSheet(sheetId, {
          rowLeaders: sheet.rowLeaders,
          rows: sheet.rows,
          visibleRows: sheet.visibleRows,
          defaultVisibleRows: sheet.defaultVisibleRows
        }))
        mutation.deleteSheetRows(newRowIds)
      })
    }
    dispatch(createHistoryStep({ actions, undoActions }))
    actions()
	}
}