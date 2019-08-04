//-----------------------------------------------------------------------------
// Initial
//-----------------------------------------------------------------------------
import { Sheets } from '@app/state/sheet/types'
import { SheetActions, LOAD_SHEET, UPDATE_SHEET, UPDATE_SHEET_CELL, UPDATE_SHEET_COLUMN } from '@app/state/sheet/actions'

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
			const { sheetId, rowId, cellId, updates } = action
			return {
        ...state,
        [sheetId]: { ...state[sheetId],
          rows: { ...state[sheetId].rows,
            [rowId]: { ...state[sheetId].rows[rowId],
              cells: state[sheetId].rows[rowId].cells.map(cell => cell.id !== cellId ? cell : { ...cell, ...updates })
            }
          }
        }
      }
		}

		case UPDATE_SHEET_COLUMN: {
			const { sheetId, columnId, updates } = action
			return {
        ...state,
        [sheetId]: { ...state[sheetId],
          columns: { ...state[sheetId].columns,
            [columnId]: { ...state[sheetId].columns[columnId], ...updates}
          }
        }
      }
		}

		case UPDATE_SHEET: {
      const { sheetId, updates } = action
      return {
        ...state,
        [sheetId]: {
          ...state[sheetId], ...updates
        }
      }
		}

		default:
			return state
	}
}

export default userReducer
