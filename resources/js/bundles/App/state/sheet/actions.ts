//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import normalizer from '@app/state/sheet/normalizer'

import { NestedSheet, Sheet } from '@app/state/sheet/types'
import { ThunkAction, ThunkDispatch } from '@app/state/types'

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------
export type SheetActions = LoadSheet

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
