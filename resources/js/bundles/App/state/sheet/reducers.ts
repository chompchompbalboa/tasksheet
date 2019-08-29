//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { Sheets, SheetActive, SheetCells, SheetColumns, SheetFilters, SheetGroups, SheetRows, SheetSorts } from '@app/state/sheet/types'
import { 
  SheetActions, 
  LOAD_SHEET, UPDATE_SHEET, 
  UPDATE_SHEET_ACTIVE,
  UPDATE_SHEET_CELL, UPDATE_SHEET_CELLS,
  UPDATE_SHEET_COLUMN, UPDATE_SHEET_COLUMNS,
  UPDATE_SHEET_FILTER, UPDATE_SHEET_FILTERS,
  UPDATE_SHEET_GROUP, UPDATE_SHEET_GROUPS,
  UPDATE_SHEET_ROW, UPDATE_SHEET_ROWS,
  UPDATE_SHEET_SELECTION,
  UPDATE_SHEET_SORT, UPDATE_SHEET_SORTS,
  UPDATE_SHEET_VERTICAL_SCROLL_DIRECTION
} from '@app/state/sheet/actions'

//-----------------------------------------------------------------------------
// Types
//-----------------------------------------------------------------------------
export interface SheetState {
  active: SheetActive
  sheets: Sheets
  cells: SheetCells
  columns: SheetColumns
  filters: SheetFilters
  groups: SheetGroups
  rows: SheetRows
  sorts: SheetSorts
  verticalScrollDirection: 'forward' | 'backward'
}

//-----------------------------------------------------------------------------
// Default State
//-----------------------------------------------------------------------------
export const defaultSheetState: SheetState = {
  active: {
    columnRenamingId: null,
    selections: {
      cellId: null,
      isRangeStartCellRendered: false,
      isRangeEndCellRendered: false,
      rangeStartColumnId: null,
      rangeStartRowId: null,
      rangeStartCellId: null,
      rangeEndColumnId: null,
      rangeEndRowId: null,
      rangeEndCellId: null,
      rangeCellIds: null,
      rangeWidth: null,
      rangeHeight: null,
      shouldRangeHelperRender: false
    }
  },
  sheets: null,
  cells: null,
  columns: null,
  filters: null,
  groups: null,
  rows: null,
  sorts: null,
  verticalScrollDirection: 'forward'
}

//-----------------------------------------------------------------------------
// Reducers
//-----------------------------------------------------------------------------
export const userReducer = (state: SheetState = defaultSheetState, action: SheetActions): SheetState => {
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

		case UPDATE_SHEET_ACTIVE: {
			const { updates } = action
			return {
        ...state,
        active: { ...state.active, ...updates }
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

		case UPDATE_SHEET_CELLS: {
			const { nextSheetCells } = action
			return {
        ...state,
        cells: nextSheetCells
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

		case UPDATE_SHEET_COLUMNS: {
			const { nextSheetColumns } = action
			return {
        ...state,
        columns: nextSheetColumns
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
			const { nextSheetFilters } = action
			return {
        ...state,
        filters: nextSheetFilters
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
			const { nextSheetGroups } = action
			return {
        ...state,
        groups: nextSheetGroups
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
			const { nextSheetRows } = action
			return {
        ...state,
        rows: nextSheetRows
      }
		}
      
		case UPDATE_SHEET_SELECTION: {
      const { nextSheetSelection } = action
      return {
        ...state,
        active: {
          ...state.active,
          selections: nextSheetSelection
        }
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
			const { nextSheetSorts } = action
			return {
        ...state,
        sorts: nextSheetSorts
      }
		}

		case UPDATE_SHEET_VERTICAL_SCROLL_DIRECTION: {
			const { nextVerticalScrollDirection } = action
			return {
        ...state,
        verticalScrollDirection: nextVerticalScrollDirection
      }
		}

		default:
			return state
	}
}

export default userReducer
