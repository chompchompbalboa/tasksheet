//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { mutation } from '@app/api'
import normalizer from '@app/state/sheet/normalizer'

import { NestedSheet, Sheet } from '@app/state/sheet/types'
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

export const loadSheet = (sheet: NestedSheet): ThunkAction => {
	return async (dispatch: ThunkDispatch) => {
		const normalizedSheet = normalizer(sheet)
		dispatch(
			loadSheetReducer({
				id: sheet.id,
				cells: normalizedSheet.entities.cells,
				columns: normalizedSheet.entities.columns,
				rows: normalizedSheet.entities.rows,
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
	updates: CellUpdates
}
export interface CellUpdates {
	value?: string
}

export const updateSheetCell = (sheetId: string, cellId: string, updates: CellUpdates): ThunkAction => {
	return async (dispatch: ThunkDispatch) => {
		mutation.updateSheetCell(cellId, updates).then(() => {
			dispatch(updateSheetCellReducer(sheetId, cellId, updates))
		})
	}
}

export const updateSheetCellReducer = (sheetId: string, cellId: string, updates: CellUpdates): SheetActions => {
	return {
		type: UPDATE_SHEET_CELL,
		sheetId,
		cellId,
		updates,
	}
}
