//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { mutation } from '@app/api'

import { Sheet } from '@app/state/sheet/types'
import { ThunkAction, ThunkDispatch } from '@app/state/types'

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------
export type SheetActions = LoadSheet | UpdateSheetCell

//-----------------------------------------------------------------------------
// Load Sheet
//-----------------------------------------------------------------------------
export const LOAD_SHEET = 'LOAD_SHEET'
interface LoadSheet {
	type: typeof LOAD_SHEET
	sheet: Sheet
}

export const loadSheet = (sheet: Sheet): ThunkAction => {
	return async (dispatch: ThunkDispatch) => {
		dispatch(
			loadSheetReducer({
				id: sheet.id,
				columns: sheet.columns,
				rows: sheet.rows,
			})
		)
	}
}

export const loadSheetReducer = (sheet: Sheet): SheetActions => {
	return {
		type: LOAD_SHEET,
		sheet,
	}
}

//-----------------------------------------------------------------------------
// Update Sheet Cell
//-----------------------------------------------------------------------------
export const UPDATE_SHEET_CELL = 'UPDATE_SHEET_CELL'
interface UpdateSheetCell {
	type: typeof UPDATE_SHEET_CELL
	sheetId: string
	cellId: string
	updates: SheetCellUpdates
}
export interface SheetCellUpdates {
	value?: string
}

export const updateSheetCell = (sheetId: string, cellId: string, updates: SheetCellUpdates): ThunkAction => {
	return async (dispatch: ThunkDispatch) => {
		mutation.updateSheetCell(cellId, updates).then(() => {
			dispatch(updateSheetCellReducer(sheetId, cellId, updates))
		})
	}
}

export const updateSheetCellReducer = (sheetId: string, cellId: string, updates: SheetCellUpdates): SheetActions => {
	return {
		type: UPDATE_SHEET_CELL,
		sheetId,
		cellId,
		updates,
	}
}
