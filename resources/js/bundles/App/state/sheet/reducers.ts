//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { 
  IAllSheets, 
  IAllSheetColumns,
  IAllSheetRows,
  IAllSheetCells, 
  IAllSheetColumnTypes,   
  SheetActive,
  SheetClipboard, 
  SheetFilters, 
  SheetGroups, 
  SheetSorts 
} from '@app/state/sheet/types'
import { 
  SheetActions, 
  LOAD_SHEET, UPDATE_SHEET, 
  UPDATE_SHEET_ACTIVE,
  UPDATE_SHEET_CELL, SET_ALL_SHEET_CELLS,
  UPDATE_SHEET_CLIPBOARD,
  UPDATE_SHEET_COLUMN, SET_ALL_SHEET_COLUMNS,
  UPDATE_SHEET_FILTER, UPDATE_SHEET_FILTERS,
  UPDATE_SHEET_GROUP, UPDATE_SHEET_GROUPS,
  UPDATE_SHEET_ROW, SET_ALL_SHEET_ROWS,
  UPDATE_SHEET_SORT, UPDATE_SHEET_SORTS
} from '@app/state/sheet/actions'

//-----------------------------------------------------------------------------
// Types
//-----------------------------------------------------------------------------
export interface SheetState {
  allSheets: IAllSheets
  allSheetColumns: IAllSheetColumns
  allSheetRows: IAllSheetRows
  allSheetCells: IAllSheetCells
  allSheetColumnTypes: IAllSheetColumnTypes
  active: SheetActive
  clipboard: SheetClipboard
  filters: SheetFilters
  groups: SheetGroups
  sorts: SheetSorts
}

//-----------------------------------------------------------------------------
// Default State
//-----------------------------------------------------------------------------
const columnTypesFromServer = initialData && initialData.columnTypes ? initialData.columnTypes : {}
export const defaultSheetState: SheetState = {
  allSheets: null,
  allSheetColumns: null,
  allSheetCells: null,
  allSheetRows: null,
  active: {
    columnRenamingId: null
  },
  clipboard: {
    sheetId: null,
    cutOrCopy: null,
    selections: null
  },
  allSheetColumnTypes: {
    STRING: {
      id: 'STRING',
      organizationId: null,
      userId: null,
      sheetId: null,
      name: 'Text',
      cellType: 'STRING',
      data: null
    },
    NUMBER: {
      id: 'NUMBER',
      organizationId: null,
      userId: null,
      sheetId: null,
      name: 'Number',
      cellType: 'NUMBER',
      data: null
    },
    BOOLEAN: {
      id: 'BOOLEAN',
      organizationId: null,
      userId: null,
      sheetId: null,
      name: 'Checkbox',
      cellType: 'BOOLEAN',
      data: null
    },
    DATETIME: {
      id: 'DATETIME',
      organizationId: null,
      userId: null,
      sheetId: null,
      name: 'Date',
      cellType: 'DATETIME',
      data: null
    },
    PHOTOS: {
      id: 'PHOTOS',
      organizationId: null,
      userId: null,
      sheetId: null,
      name: 'Photos',
      cellType: 'PHOTOS',
      data: null
    },
    FILES: {
      id: 'FILES',
      organizationId: null,
      userId: null,
      sheetId: null,
      name: 'Files',
      cellType: 'FILES',
      data: null
    },
    ...columnTypesFromServer
  },
  filters: null,
  groups: null,
  sorts: null
}

//-----------------------------------------------------------------------------
// Reducers
//-----------------------------------------------------------------------------
export const userReducer = (state: SheetState = defaultSheetState, action: SheetActions): SheetState => {

	switch (action.type) {

		case SET_ALL_SHEET_COLUMNS: {
			const { nextAllSheetColumns } = action
			return {
        ...state,
        allSheetColumns: nextAllSheetColumns
      }
		}

		case SET_ALL_SHEET_ROWS: {
			const { nextAllSheetRows } = action
			return {
        ...state,
        allSheetRows: nextAllSheetRows
      }
		}

		case SET_ALL_SHEET_CELLS: {
			const { nextAllSheetCells } = action
			return {
        ...state,
        allSheetCells: nextAllSheetCells
      }
		}
    
		case LOAD_SHEET: {
			const { cells, columns, filters, groups, rows, sheet, sorts } = action
			return {
        ...state,
        allSheets: { ...state.allSheets, [sheet.id]: sheet },
        allSheetColumns: { ...state.allSheetColumns, ...columns },
        allSheetRows: { ...state.allSheetRows, ...rows },
        allSheetCells: { ...state.allSheetCells, ...cells },
        filters: { ...state.filters, ...filters },
        groups: { ...state.groups, ...groups },
        sorts: { ...state.sorts, ...sorts }
			}
		}
      
		case UPDATE_SHEET: {
      const { sheetId, updates } = action
      return {
        ...state,
        allSheets: {...state.allSheets, 
          [sheetId]: { ...state.allSheets[sheetId], ...updates}
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
        allSheetCells: { ...state.allSheetCells,
          [cellId]: { ...state.allSheetCells[cellId], ...updates }
        }
      }
		}

		case UPDATE_SHEET_CLIPBOARD: {
			const { nextSheetClipboard } = action
			return {
        ...state,
        clipboard: nextSheetClipboard
      }
		}

		case UPDATE_SHEET_COLUMN: {
			const { columnId, updates } = action
			return {
        ...state,
        allSheetColumns: { ...state.allSheetColumns,
          [columnId]: { ...state.allSheetColumns[columnId], ...updates}
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
        allSheetRows: { ...state.allSheetRows,
          [rowId]: { ...state.allSheetRows[rowId], ...updates}
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

		default:
			return state
	}
}

export default userReducer
