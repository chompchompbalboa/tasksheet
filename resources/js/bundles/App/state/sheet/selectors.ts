//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { AppState } from '@app/state'
import { FileType } from '@app/state/folder/types'
import { 
  Sheet,
  SheetCell, SheetCells,
  SheetColumn, SheetColumns, 
  SheetRow, SheetRows, 
  SheetFilter, SheetFilters, 
  SheetGroup, SheetGroups, 
  SheetSort, SheetSorts
} from '@app/state/sheet/types'

//-----------------------------------------------------------------------------
// Select Cell
//-----------------------------------------------------------------------------
export const selectCell = (
  state: AppState,
  cellId: string
): SheetCell => state.sheet.cells[cellId]

//-----------------------------------------------------------------------------
// Select Cells
//-----------------------------------------------------------------------------
export const selectCells = (
  state: AppState
): SheetCells => state.sheet.cells

//-----------------------------------------------------------------------------
// Select Column
//-----------------------------------------------------------------------------
export const selectColumn = (
  state: AppState,
  columnId: string
): SheetColumn => state.sheet.columns[columnId]

//-----------------------------------------------------------------------------
// Select Columns
//-----------------------------------------------------------------------------
export const selectColumns = (
  state: AppState
): SheetColumns => state.sheet.columns

//-----------------------------------------------------------------------------
// Select Filter
//-----------------------------------------------------------------------------
export const selectFilter = (
  state: AppState,
  filterId: string
): SheetFilter => state.sheet.filters[filterId]

//-----------------------------------------------------------------------------
// Select Filters
//-----------------------------------------------------------------------------
export const selectFilters = (
  state: AppState
): SheetFilters => state.sheet.filters

//-----------------------------------------------------------------------------
// Select Group
//-----------------------------------------------------------------------------
export const selectGroup = (
  state: AppState,
  groupId: string
): SheetGroup => state.sheet.groups[groupId]

//-----------------------------------------------------------------------------
// Select Groups
//-----------------------------------------------------------------------------
export const selectGroups = (
  state: AppState
): SheetGroups => state.sheet.groups

//-----------------------------------------------------------------------------
// Select Row
//-----------------------------------------------------------------------------
export const selectRow = (
  state: AppState,
  rowId: string
): SheetRow => state.sheet.rows[rowId]

//-----------------------------------------------------------------------------
// Select Rows
//-----------------------------------------------------------------------------
export const selectRows = (
  state: AppState
): SheetRows => state.sheet.rows

//-----------------------------------------------------------------------------
// Select Sort
//-----------------------------------------------------------------------------
export const selectSort = (
  state: AppState,
  sortId: string
): SheetSort => state.sheet.sorts[sortId]

//-----------------------------------------------------------------------------
// Select Sorts
//-----------------------------------------------------------------------------
export const selectSorts = (
  state: AppState
): SheetSorts => state.sheet.sorts

//-----------------------------------------------------------------------------
// Select Sheet Columns
//-----------------------------------------------------------------------------
export const selectSheetColumns = (
  state: AppState, 
  sheetId: string
): SheetColumn['id'][] => state.sheet.sheets && state.sheet.sheets[sheetId] && state.sheet.sheets[sheetId].columns

//-----------------------------------------------------------------------------
// Select Sheet File Type
//-----------------------------------------------------------------------------
export const selectSheetFileType = (
  state: AppState, 
  sheetId: string
): FileType => state.sheet.sheets && state.sheet.sheets[sheetId] ? state.sheet.sheets[sheetId].fileType : null

//-----------------------------------------------------------------------------
// Select Sheet Filters
//-----------------------------------------------------------------------------
export const selectSheetFilters = (
  state: AppState, 
  sheetId: string
): SheetFilter['id'][] => state.sheet.sheets && state.sheet.sheets[sheetId] && state.sheet.sheets[sheetId].filters

//-----------------------------------------------------------------------------
// Select Sheet Groups
//-----------------------------------------------------------------------------
export const selectSheetGroups = (
  state: AppState, 
  sheetId: string
): SheetGroup['id'][] => state.sheet.sheets && state.sheet.sheets[sheetId] && state.sheet.sheets[sheetId].groups

//-----------------------------------------------------------------------------
// Select Sheet Rows
//-----------------------------------------------------------------------------
export const selectSheetRows = (
  state: AppState, 
  sheetId: string
): SheetRow['id'][] => state.sheet.sheets && state.sheet.sheets[sheetId] && state.sheet.sheets[sheetId].rows

//-----------------------------------------------------------------------------
// Select Sheet Source Sheet Id
//-----------------------------------------------------------------------------
export const selectSheetSourceSheetId = (
  state: AppState, 
  sheetId: string
): Sheet['id'] => state.sheet.sheets && state.sheet.sheets[sheetId] ? state.sheet.sheets[sheetId].sourceSheetId : null

//-----------------------------------------------------------------------------
// Select Sheet Sorts
//-----------------------------------------------------------------------------
export const selectSheetSorts = (
  state: AppState, 
  sheetId: string
): SheetSort['id'][] => state.sheet.sheets && state.sheet.sheets[sheetId] && state.sheet.sheets[sheetId].sorts

//-----------------------------------------------------------------------------
// Select Sheet Visible Columns
//-----------------------------------------------------------------------------
export const selectSheetVisibleColumns = (
  state: AppState, 
  sheetId: string
): SheetColumn['id'][] => state.sheet.sheets && state.sheet.sheets[sheetId] && state.sheet.sheets[sheetId].visibleColumns

//-----------------------------------------------------------------------------
// Select Sheet Visible Rows
//-----------------------------------------------------------------------------
export const selectSheetVisibleRows = (
  state: AppState, 
  sheetId: string
): SheetRow['id'][] => state.sheet.sheets && state.sheet.sheets[sheetId] && state.sheet.sheets[sheetId].visibleRows
