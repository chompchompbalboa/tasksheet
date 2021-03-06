//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { 
  IAllSheets, 
  IAllSheetColumns,
  IAllSheetRows,
  IAllSheetCells, 
  IAllSheetFilters, 
  IAllSheetGroups, 
  IAllSheetSorts,
  IAllSheetViews,
  IAllSheetCellChanges, IAllSheetChanges,
  IAllSheetCellFiles, IAllSheetFiles,
  IAllSheetGantts,
  IAllSheetGanttRanges,
  IAllSheetCellLabels, IAllSheetLabels,
  IAllSheetCellPhotos, IAllSheetPhotos,
  IAllSheetPriorities,
  ISheetActive,
  ISheetClipboard, 
} from '@/state/sheet/types'
import { 
  ISheetActions, 
  LOAD_SHEET, 
  SET_ALL_SHEETS,
  UPDATE_SHEET, 
  UPDATE_SHEET_ACTIVE,
  UPDATE_SHEET_CELL, SET_ALL_SHEET_CELLS,
  UPDATE_SHEET_CLIPBOARD,
  UPDATE_SHEET_COLUMN, SET_ALL_SHEET_COLUMNS,
  UPDATE_SHEET_FILTER, SET_ALL_SHEET_FILTERS,
  UPDATE_SHEET_GROUP, SET_ALL_SHEET_GROUPS,
  UPDATE_SHEET_ROW, SET_ALL_SHEET_ROWS,
  UPDATE_SHEET_SORT, SET_ALL_SHEET_SORTS,
  UPDATE_SHEET_VIEW, SET_ALL_SHEET_VIEWS,
  SET_ALL_SHEET_CELL_CHANGES, SET_ALL_SHEET_CHANGES,
  SET_ALL_SHEET_CELL_FILES, SET_ALL_SHEET_FILES,
  UPDATE_SHEET_GANTT, SET_ALL_SHEET_GANTTS,
  UPDATE_SHEET_GANTT_RANGE, SET_ALL_SHEET_GANTT_RANGES,
  SET_ALL_SHEET_CELL_LABELS, SET_ALL_SHEET_LABELS,
  SET_ALL_SHEET_CELL_PHOTOS, SET_ALL_SHEET_PHOTOS,
  UPDATE_SHEET_PRIORITY, SET_ALL_SHEET_PRIORITIES
} from '@/state/sheet/actions'

//-----------------------------------------------------------------------------
// Types
//-----------------------------------------------------------------------------
export interface ISheetState {
  allSheets: IAllSheets
  allSheetColumns: IAllSheetColumns
  allSheetRows: IAllSheetRows
  allSheetCells: IAllSheetCells
  allSheetFilters: IAllSheetFilters
  allSheetGroups: IAllSheetGroups
  allSheetSorts: IAllSheetSorts
  allSheetViews: IAllSheetViews
  allSheetChanges: IAllSheetChanges
  allSheetFiles: IAllSheetFiles
  allSheetGantts: IAllSheetGantts
  allSheetGanttRanges: IAllSheetGanttRanges
  allSheetLabels: IAllSheetLabels
  allSheetPhotos: IAllSheetPhotos
  allSheetPriorities: IAllSheetPriorities
  allSheetCellChanges: IAllSheetCellChanges
  allSheetCellFiles: IAllSheetCellFiles
  allSheetCellLabels: IAllSheetCellLabels
  allSheetCellPhotos: IAllSheetCellPhotos
  active: ISheetActive
  clipboard: ISheetClipboard
}

//-----------------------------------------------------------------------------
// Default State
//-----------------------------------------------------------------------------
export const initialSheetState: ISheetState = {
  allSheets: null,
  allSheetColumns: null,
  allSheetCells: null,
  allSheetRows: null,
  allSheetFilters: null,
  allSheetGroups: null,
  allSheetSorts: null,
  allSheetViews: null,
  allSheetChanges: null,
  allSheetFiles: null,
  allSheetGantts: null,
  allSheetGanttRanges: null,
  allSheetLabels: null,
  allSheetPhotos: null,
  allSheetPriorities: null,
  allSheetCellChanges: null,
  allSheetCellFiles: null,
  allSheetCellLabels: null,
  allSheetCellPhotos: null,
  active: {
    columnRenamingId: null
  },
  clipboard: {
    sheetId: null,
    cutOrCopy: null,
    selections: {
      rangeCellIds: null,
      rangeStartColumnId: null,
      rangeStartRowId: null,
      rangeStartCellId: null,
      rangeEndColumnId: null,
      rangeEndRowId: null,
      rangeEndCellId: null,
      visibleColumns: null,
      visibleRows: null
    }
  },
}

//-----------------------------------------------------------------------------
// Reducers
//-----------------------------------------------------------------------------
export const userReducer = (state: ISheetState = initialSheetState, action: ISheetActions): ISheetState => {

	switch (action.type) {
    
		case LOAD_SHEET: {
			const { 
        sheet,
        columns,  
        rows,  
        cells, 
        views,
        filters, 
        groups,
        sorts,
        changes,
        files,
        gantts,
        ganttRanges,
        labels,
        photos,
        priorities,
        cellPhotos,
        cellFiles,
        cellLabels,
        cellChanges
      } = action
			return {
        ...state,
        allSheets: { ...state.allSheets, [sheet.id]: sheet },
        allSheetColumns: { ...state.allSheetColumns, ...columns },
        allSheetRows: { ...state.allSheetRows, ...rows },
        allSheetCells: { ...state.allSheetCells, ...cells },
        allSheetViews: { ...state.allSheetViews, ...views },
        allSheetFilters: { ...state.allSheetFilters, ...filters },
        allSheetGroups: { ...state.allSheetGroups, ...groups },
        allSheetSorts: { ...state.allSheetSorts, ...sorts },
        allSheetChanges: { ...state.allSheetChanges, ...changes },
        allSheetFiles: { ...state.allSheetFiles, ...files },
        allSheetGantts: { ...state.allSheetGantts, ...gantts },
        allSheetGanttRanges: { ...state.allSheetGanttRanges, ...ganttRanges },
        allSheetLabels: { ...state.allSheetLabels, ...labels },
        allSheetPhotos: { ...state.allSheetPhotos, ...photos },
        allSheetPriorities: { ...state.allSheetPriorities, ...priorities },
        allSheetCellChanges: { ...state.allSheetCellChanges, ...cellChanges },
        allSheetCellFiles: { ...state.allSheetCellFiles, ...cellFiles },
        allSheetCellLabels: { ...state.allSheetCellLabels, ...cellLabels },
        allSheetCellPhotos: { ...state.allSheetCellPhotos, ...cellPhotos },
			}
		}

		case SET_ALL_SHEETS: { return { ...state, allSheets: action.nextAllSheets } }
		case SET_ALL_SHEET_COLUMNS: { return { ...state, allSheetColumns: action.nextAllSheetColumns } }
		case SET_ALL_SHEET_ROWS: { return { ...state, allSheetRows: action.nextAllSheetRows } }
		case SET_ALL_SHEET_CELLS: { return { ...state, allSheetCells: action.nextAllSheetCells } }
		case SET_ALL_SHEET_FILTERS: { return { ...state, allSheetFilters: action.nextAllSheetFilters } }
		case SET_ALL_SHEET_GROUPS: { return { ...state, allSheetGroups: action.nextAllSheetGroups } }
		case SET_ALL_SHEET_SORTS: { return { ...state, allSheetSorts: action.nextAllSheetSorts } }
		case SET_ALL_SHEET_VIEWS: { return { ...state, allSheetViews: action.nextAllSheetViews } }
		case SET_ALL_SHEET_CHANGES: { return { ...state, allSheetChanges: action.nextAllSheetChanges } }
		case SET_ALL_SHEET_FILES: { return { ...state, allSheetFiles: action.nextAllSheetFiles } }
		case SET_ALL_SHEET_GANTTS: { return { ...state, allSheetGantts: action.nextAllSheetGantts } }
		case SET_ALL_SHEET_GANTT_RANGES: { return { ...state, allSheetGanttRanges: action.nextAllSheetGanttRanges } }
		case SET_ALL_SHEET_LABELS: { return { ...state, allSheetLabels: action.nextAllSheetLabels } }
		case SET_ALL_SHEET_PHOTOS: { return { ...state, allSheetPhotos: action.nextAllSheetPhotos } }
		case SET_ALL_SHEET_PRIORITIES: { return { ...state, allSheetPriorities: action.nextAllSheetPriorities } }
		case SET_ALL_SHEET_CELL_CHANGES: { return { ...state, allSheetCellChanges: action.nextAllSheetCellChanges } }
		case SET_ALL_SHEET_CELL_FILES: { return { ...state, allSheetCellFiles: action.nextAllSheetCellFiles } }
		case SET_ALL_SHEET_CELL_LABELS: { return { ...state, allSheetCellLabels: action.nextAllSheetCellLabels } }
		case SET_ALL_SHEET_CELL_PHOTOS: { return { ...state, allSheetCellPhotos: action.nextAllSheetCellPhotos } }
      
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

		case UPDATE_SHEET_GANTT: {
			const { sheetGanttId, updates } = action
			return {
        ...state,
        allSheetGantts: { ...state.allSheetGantts,
          [sheetGanttId]: { ...state.allSheetGantts[sheetGanttId], ...updates}
        }
      }
		}

		case UPDATE_SHEET_GANTT_RANGE: {
			const { sheetGanttRangeId, updates } = action
			return {
        ...state,
        allSheetGanttRanges: { ...state.allSheetGanttRanges,
          [sheetGanttRangeId]: { ...state.allSheetGanttRanges[sheetGanttRangeId], ...updates}
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

		case UPDATE_SHEET_PRIORITY: {
			const { sheetPriorityId, updates } = action
			return {
        ...state,
        allSheetPriorities: { ...state.allSheetPriorities,
          [sheetPriorityId]: { ...state.allSheetPriorities[sheetPriorityId], ...updates }
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

		case UPDATE_SHEET_VIEW: {
			const { sheetViewId, updates } = action
			return {
        ...state,
        allSheetViews: { ...state.allSheetViews,
          [sheetViewId]: { ...state.allSheetViews[sheetViewId], ...updates}
        }
      }
		}

		default:
			return state
	}
}

export default userReducer
