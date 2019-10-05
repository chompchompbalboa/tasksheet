//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { batch } from 'react-redux'

import clone from '@/utils/clone'

import { mutation } from '@app/api'

import { IAppState } from '@app/state'
import { IThunkAction, IThunkDispatch } from '@app/state/types'
import { 
  IAllSheetCells, ISheetCell,
  IAllSheetRows
} from '@app/state/sheet/types'

import { 
  clearSheetSelection,
  setAllSheetCells,
  setAllSheetColumns,
  setAllSheetRows,
  updateSheet
} from '@app/state/sheet/actions'
import { createHistoryStep } from '@app/state/history/actions'

//-----------------------------------------------------------------------------
// Delete Sheet Column
//-----------------------------------------------------------------------------
export const deleteSheetColumn = (sheetId: string, columnId: string): IThunkAction => {
	return async (dispatch: IThunkDispatch, getState: () => IAppState) => {

    dispatch(clearSheetSelection(sheetId))

    const {
      allSheets,
      allSheetCells,
      allSheetColumns,
      allSheetRows,
    } = getState().sheet
    const sheet = allSheets[sheetId]
    
    // Columns
    const { [columnId]: deletedColumn, ...nextAllSheetColumns } = allSheetColumns
    
    // Rows
    const nextAllSheetRows: IAllSheetRows = clone(allSheetRows)
    sheet.rows.forEach(rowId => {
      const { [columnId]: deletedCell, ...nextSheetCells } = nextAllSheetRows[rowId].cells
      nextAllSheetRows[rowId].cells = nextSheetCells
    })
    
    // Cells
    const deletedSheetCells: ISheetCell[] = []
    const nextAllSheetCells: IAllSheetCells = {}
    Object.keys(allSheetCells).forEach(cellId => {
      const cell = allSheetCells[cellId]
      if(cell.columnId !== columnId) { nextAllSheetCells[cellId] = cell }
      else { deletedSheetCells.push(cell) }
    })
    
    // Sheet Columns
    const nextSheetColumns = sheet.columns.filter(sheetColumnId => sheetColumnId !== columnId)
    const nextSheetVisibleColumns = sheet.visibleColumns.filter(sheetColumnId => sheetColumnId !== columnId)
    
    const actions = () => {
      batch(() => {
        dispatch(setAllSheetCells(nextAllSheetCells))
        dispatch(setAllSheetColumns(nextAllSheetColumns))
        dispatch(setAllSheetRows(nextAllSheetRows))
        dispatch(updateSheet(sheetId, {
          columns: nextSheetColumns,
          visibleColumns: nextSheetVisibleColumns
        }, true))
      })
      mutation.deleteSheetColumn(columnId)
      mutation.updateSheet(sheetId, { visibleColumns: nextSheetVisibleColumns })
    }
    
    const undoActions = () => {
      batch(() => {
        dispatch(setAllSheetCells(allSheetCells))
        dispatch(setAllSheetColumns(allSheetColumns))
        dispatch(setAllSheetRows(allSheetRows))
        dispatch(updateSheet(sheetId, {
          columns: sheet.columns,
          visibleColumns: sheet.visibleColumns
        }, true))
      })
      mutation.createSheetColumn(deletedColumn, deletedSheetCells)
      mutation.updateSheet(sheetId, { visibleColumns: sheet.visibleColumns })
    }
    
    dispatch(createHistoryStep({ actions, undoActions }))
    actions()
	}
}