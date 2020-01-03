//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { batch } from 'react-redux'
import { v4 as createUuid } from 'uuid'

import { mutation } from '@/api'

import { IAppState } from '@/state'
import { IThunkAction, IThunkDispatch } from '@/state/types'
import {
  ISheet,
  ISheetCell,
  ISheetRow, ISheetRowToDatabase
} from '@/state/sheet/types'

import { 
  clearSheetSelection,
  setAllSheetCells,
  setAllSheetRows,
  updateSheet
} from '@/state/sheet/actions'
import { createHistoryStep } from '@/state/history/actions'

import { defaultCell, defaultRow } from '@/state/sheet/defaults'

import { resolveSheetRowLeaders } from '@/state/sheet/resolvers'

//-----------------------------------------------------------------------------
// Create Sheet Row
//-----------------------------------------------------------------------------
export const createSheetRows = (
  sheetId: string, 
  numberOfRowsToAdd: number, 
  insertAtRowId: ISheetRow['id'], 
  aboveOrBelow: 'ABOVE' | 'BELOW' = 'ABOVE',
  keepSheetSelection: boolean = false
): IThunkAction => {
	return async (dispatch: IThunkDispatch, getState: () => IAppState) => {

    !keepSheetSelection && dispatch(clearSheetSelection(sheetId))
    
    const {
      allSheets,
      allSheetColumns,
      allSheetCells,
      allSheetRows,
    } = getState().sheet

    // Get sheet
    const sheet = allSheets[sheetId]
    const nextAllSheetCells = { ...allSheetCells }
    const nextAllSheetRows = { ...allSheetRows }
    const nextSheetRows = [ ...sheet.rows ] 
    const nextSheetVisibleRows = [ ...sheet.visibleRows ]
    const newRowsToDatabase: ISheetRowToDatabase[] = []
    const newRowIds: ISheetRow['id'][] = []
    
    // Get any open sheets this is a source sheet for
    const childSheets: ISheet['id'][] = []
    Object.keys(allSheets).forEach(currentSheetId => {
      const currentSheet = allSheets[currentSheetId]
      if(currentSheetId !== sheetId 
         && currentSheet.sourceSheetId !== null
         && [ sheet.id, sheet.sourceSheetId ].includes(currentSheet.sourceSheetId)
      ){ 
        childSheets.push(currentSheetId)
      }
    })

    // Get the index to insert the rows at
    const insertAtRowIdVisibleRowsIndex = nextSheetVisibleRows.indexOf(insertAtRowId) > -1 
      ? nextSheetVisibleRows.indexOf(insertAtRowId) 
      : 0

    // Get the correct sheetId for the new rows
    const newRowSheetId = sheet.sourceSheetId !== null ? sheet.sourceSheetId : sheetId
    
    // Create the rows
    for(let i = 0; i < numberOfRowsToAdd; i++) {
      const newRow = defaultRow(newRowSheetId, createUuid(), sheet.columns)
      const newRowCellsToDatabase: ISheetCell[] = []
      Object.keys(newRow.cells).forEach((columnId: string) => {
        const cellId = newRow.cells[columnId]
        const column = allSheetColumns[columnId]
        const newCell = defaultCell(sheetId, newRow.id, columnId, cellId, column.defaultValue)
        nextAllSheetCells[cellId] = newCell
        newRowCellsToDatabase.push(newCell)
      })
      nextAllSheetRows[newRow.id] = newRow
      nextSheetRows.push(newRow.id)
      const rowIndexModifier = aboveOrBelow === 'ABOVE' ? i : i + 1
      nextSheetVisibleRows.splice(insertAtRowIdVisibleRowsIndex + rowIndexModifier, 0, newRow.id)
      const newRowToDatabase = {
        ...newRow,
        cells: newRowCellsToDatabase
      }
      newRowsToDatabase.push(newRowToDatabase)
      newRowIds.push(newRow.id)
    }
    
    // Get the next row leaders
    const nextSheetRowLeaders = resolveSheetRowLeaders(nextSheetVisibleRows)

    // Actions
    const actions = () => {
      batch(() => {
        dispatch(setAllSheetCells(nextAllSheetCells))
        dispatch(setAllSheetRows(nextAllSheetRows))
        dispatch(updateSheet(sheetId, {
          visibleRowLeaders: nextSheetRowLeaders,
          rows: nextSheetRows,
          visibleRows: nextSheetVisibleRows,
        }, true))
        sheet.sourceSheetId && dispatch(updateSheet(sheet.sourceSheetId, {
          rows: nextSheetRows
        }, true))
        childSheets && childSheets.forEach(childSheetId => {
          dispatch(updateSheet(childSheetId, {
            rows: nextSheetRows
          }, true))
        })
      })
      mutation.createSheetRows(newRowsToDatabase)
    }

    // Undo actions
    const undoActions = () => {
      batch(() => {
        dispatch(setAllSheetRows(allSheetRows))
        dispatch(setAllSheetCells(allSheetCells))
        dispatch(updateSheet(sheetId, {
          visibleRowLeaders: sheet.visibleRowLeaders,
          rows: sheet.rows,
          visibleRows: sheet.visibleRows
        }, true))
        sheet.sourceSheetId && dispatch(updateSheet(sheet.sourceSheetId, {
          rows: sheet.rows
        }, true))
        childSheets && childSheets.forEach(childSheetId => {
          dispatch(updateSheet(childSheetId, {
            rows: sheet.rows
          }, true))
        })
      })
      mutation.deleteSheetRows(newRowIds)
    }

    // Create the history step
    dispatch(createHistoryStep({ actions, undoActions }))

    // Call the actions
    actions()
	}
}