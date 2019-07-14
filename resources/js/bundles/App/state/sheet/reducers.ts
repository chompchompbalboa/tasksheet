//-----------------------------------------------------------------------------
// Initial
//-----------------------------------------------------------------------------
import { Sheets } from '@app/state/sheet/types'
import { SheetActions, LOAD_SHEET } from '@app/state/sheet/actions'

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

		default:
			return state
	}
}

export default userReducer
