//-----------------------------------------------------------------------------
// Initial
//-----------------------------------------------------------------------------
import { Sheets, SheetCells, SheetColumns, SheetFilters, SheetGroups, SheetRows, SheetSorts } from '@app/state/sheet/types'
import { 
  SheetActions, 
  LOAD_SHEET, UPDATE_SHEET, 
  UPDATE_SHEET_CELL, 
  UPDATE_SHEET_COLUMN,
  UPDATE_SHEET_FILTER, UPDATE_SHEET_FILTERS,
  UPDATE_SHEET_GROUP, UPDATE_SHEET_GROUPS,
  UPDATE_SHEET_ROW, UPDATE_SHEET_ROWS,
  UPDATE_SHEET_SORT, UPDATE_SHEET_SORTS,
} from '@app/state/sheet/actions'

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
      
		case UPDATE_SHEET: {
      const { sheetId, updates } = action
      return {
        ...state,
        sheets: {...state.sheets, 
          [sheetId]: { ...state.sheets[sheetId], ...updates}
        }
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

		case UPDATE_SHEET_FILTER: {
			const { filterId, updates } = action
			return {
        ...state,
        filters: { ...state.filters,
          [filterId]: { ...state.filters[filterId], ...updates}
        }
      }
		}

		case UPDATE_SHEET_FILTERS: {
			const { nextFilters } = action
			return {
        ...state,
        filters: nextFilters
      }
		}

		case UPDATE_SHEET_GROUP: {
			const { groupId, updates } = action
			return {
        ...state,
        groups: { ...state.groups,
          [groupId]: { ...state.groups[groupId], ...updates}
        }
      }
		}

		case UPDATE_SHEET_GROUPS: {
			const { nextGroups } = action
			return {
        ...state,
        groups: nextGroups
      }
		}

		case UPDATE_SHEET_ROW: {
			const { rowId, updates } = action
			return {
        ...state,
        rows: { ...state.rows,
          [rowId]: { ...state.rows[rowId], ...updates}
        }
      }
		}

		case UPDATE_SHEET_ROWS: {
			const { nextRows } = action
			return {
        ...state,
        rows: nextRows
      }
		}

		case UPDATE_SHEET_SORT: {
			const { sortId, updates } = action
			return {
        ...state,
        sorts: { ...state.sorts,
          [sortId]: { ...state.sorts[sortId], ...updates}
        }
      }
		}

		case UPDATE_SHEET_SORTS: {
			const { nextSorts } = action
			return {
        ...state,
        sorts: nextSorts
      }
		}

		default:
			return state
	}
}

export default userReducer
