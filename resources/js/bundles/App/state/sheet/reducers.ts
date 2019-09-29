//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { 
  IAllSheets, 
  IAllSheetColumns,
  IAllSheetRows,
  IAllSheetCells, 
  IAllSheetColumnTypes,   
  IAllSheetFilters, 
  IAllSheetGroups, 
  IAllSheetSorts,
  ISheetActive,
  ISheetClipboard, 
} from '@app/state/sheet/types'
import { 
  ISheetActions, 
  LOAD_SHEET, UPDATE_SHEET, 
  UPDATE_SHEET_ACTIVE,
  UPDATE_SHEET_CELL, SET_ALL_SHEET_CELLS,
  UPDATE_SHEET_CLIPBOARD,
  UPDATE_SHEET_COLUMN, SET_ALL_SHEET_COLUMNS,
  UPDATE_SHEET_FILTER, SET_ALL_SHEET_FILTERS,
  UPDATE_SHEET_GROUP, SET_ALL_SHEET_GROUPS,
  UPDATE_SHEET_ROW, SET_ALL_SHEET_ROWS,
  UPDATE_SHEET_SORT, SET_ALL_SHEET_SORTS
} from '@app/state/sheet/actions'

//-----------------------------------------------------------------------------
// Types
//-----------------------------------------------------------------------------
export interface ISheetState {
  allSheets: IAllSheets
  allSheetColumns: IAllSheetColumns
  allSheetRows: IAllSheetRows
  allSheetCells: IAllSheetCells
  allSheetColumnTypes: IAllSheetColumnTypes
  allSheetFilters: IAllSheetFilters
  allSheetGroups: IAllSheetGroups
  allSheetSorts: IAllSheetSorts
  active: ISheetActive
  clipboard: ISheetClipboard
}

//-----------------------------------------------------------------------------
// Default State
//-----------------------------------------------------------------------------
const columnTypesFromServer = initialData && initialData.columnTypes ? initialData.columnTypes : {}
export const defaultSheetState: ISheetState = {
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
  allSheetFilters: null,
  allSheetGroups: null,
  allSheetSorts: null
}

//-----------------------------------------------------------------------------
// Reducers
//-----------------------------------------------------------------------------
export const userReducer = (state: ISheetState = defaultSheetState, action: ISheetActions): ISheetState => {

	switch (action.type) {
    
		case LOAD_SHEET: {
			const { 
        sheet,
        columns,  
        rows,  
        cells, 
        filters, 
        groups,
        sorts 
      } = action
			return {
        ...state,
        allSheets: { ...state.allSheets, [sheet.id]: sheet },
        allSheetColumns: { ...state.allSheetColumns, ...columns },
        allSheetRows: { ...state.allSheetRows, ...rows },
        allSheetCells: { ...state.allSheetCells, ...cells },
        allSheetFilters: { ...state.allSheetFilters, ...filters },
        allSheetGroups: { ...state.allSheetGroups, ...groups },
        allSheetSorts: { ...state.allSheetSorts, ...sorts }
			}
		}

		case SET_ALL_SHEET_COLUMNS: { return { ...state, allSheetColumns: action.nextAllSheetColumns } }
		case SET_ALL_SHEET_ROWS: { return { ...state, allSheetRows: action.nextAllSheetRows } }
		case SET_ALL_SHEET_CELLS: { return { ...state, allSheetCells: action.nextAllSheetCells } }
		case SET_ALL_SHEET_FILTERS: { return { ...state, allSheetFilters: action.nextAllSheetFilters } }
		case SET_ALL_SHEET_GROUPS: { return { ...state, allSheetGroups: action.nextAllSheetGroups } }
		case SET_ALL_SHEET_SORTS: { return { ...state, allSheetSorts: action.nextAllSheetSorts } }
      
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
        allSheetFilters: { ...state.allSheetFilters,
          [filterId]: { ...state.allSheetFilters[filterId], ...updates}
        }
      }
		}

		case UPDATE_SHEET_GROUP: {
			const { groupId, updates } = action
			return {
        ...state,
        allSheetGroups: { ...state.allSheetGroups,
          [groupId]: { ...state.allSheetGroups[groupId], ...updates}
        }
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
        allSheetSorts: { ...state.allSheetSorts,
          [sortId]: { ...state.allSheetSorts[sortId], ...updates}
        }
      }
		}

		default:
			return state
	}
}

export default userReducer
