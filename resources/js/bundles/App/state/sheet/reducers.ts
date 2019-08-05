//-----------------------------------------------------------------------------
// Initial
//-----------------------------------------------------------------------------
import { Sheets, SheetCells, SheetColumns, SheetFilters, SheetGroups, SheetRows, SheetSorts } from '@app/state/sheet/types'
import { SheetActions, LOAD_SHEET, UPDATE_SHEET, UPDATE_SHEET_CELL, UPDATE_SHEET_COLUMN } from '@app/state/sheet/actions'

//-----------------------------------------------------------------------------
// Types
//-----------------------------------------------------------------------------
interface SheetState {
  sheets: Sheets
  cells: SheetCells
  columns: SheetColumns
  filters: SheetFilters
  groups: SheetGroups
  rows: SheetRows
  sorts: SheetSorts
}

//-----------------------------------------------------------------------------
// Reducers
//-----------------------------------------------------------------------------
export const userReducer = (state: SheetState, action: SheetActions): SheetState => {
	switch (action.type) {
    
		case LOAD_SHEET: {
			const { cells, columns, filters, groups, rows, sheet, sorts } = action
			return {
        ...state,
        sheets: { ...state.sheets, [sheet.id]: sheet },
        cells: { ...state.cells, ...cells },
        columns: { ...state.columns, ...columns },
        filters: { ...state.filters, ...filters },
        groups: { ...state.groups, ...groups },
        rows: { ...state.rows, ...rows },
        sorts: { ...state.sorts, ...sorts }
			}
		}

		case UPDATE_SHEET_CELL: {
			const { cellId, updates } = action
			return {
        ...state,
        cells: { ...state.cells,
          [cellId]: { ...state.cells[cellId], ...updates }
        }
      }
		}

		case UPDATE_SHEET_COLUMN: {
			const { columnId, updates } = action
			return {
        ...state,
        columns: { ...state.columns,
          [columnId]: { ...state.columns[columnId], ...updates}
        }
      }
		}

		case UPDATE_SHEET: {
      const { sheetId, updates } = action
      return {
        ...state,
        sheets: {...state.sheets, 
          [sheetId]: { ...state.sheets[sheetId], ...updates}
        }
      }
		}

		default:
			return state
	}
}

export default userReducer
