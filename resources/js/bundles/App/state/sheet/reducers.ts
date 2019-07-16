//-----------------------------------------------------------------------------
// Initial
//-----------------------------------------------------------------------------
import { Sheets } from '@app/state/sheet/types'
import { SheetActions, LOAD_SHEET, UPDATE_SHEET_CELL } from '@app/state/sheet/actions'

//-----------------------------------------------------------------------------
// Reducers
//-----------------------------------------------------------------------------
export const userReducer = (state: Sheets = {}, action: SheetActions): Sheets => {
	switch (action.type) {
		case LOAD_SHEET: {
			const { sheet } = action
			return {
				...state,
				[sheet.id]: sheet,
			}
		}

		case UPDATE_SHEET_CELL: {
			const { sheetId, cellId, updates } = action
			return {
				...state,
				[sheetId]: {
					...state[sheetId],
					cells: {
						...state[sheetId].cells,
						[cellId]: {
							...state[sheetId].cells[cellId],
							...updates,
						},
					},
				},
			}
		}

		default:
			return state
	}
}

export default userReducer
