//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { AppState } from '@app/state'
import { FileType } from '@app/state/folder/types'
import { 
  ISheet,
  SheetActive,
  SheetCell, IAllSheetCells,
  SheetColumn, IAllSheetColumns, IAllSheetColumnTypes,
  SheetRow, IAllSheetRows, 
  SheetFilter, IAllSheetFilters, 
  SheetGroup, IAllSheetGroups, 
  SheetSort, IAllSheetSorts
} from '@app/state/sheet/types'

//-----------------------------------------------------------------------------
// Select Active
//-----------------------------------------------------------------------------
export const selectActive = (
  state: AppState
): SheetActive => state.sheet.active

//-----------------------------------------------------------------------------
// Select Cell
//-----------------------------------------------------------------------------
export const selectCell = (
  state: AppState,
  cellId: string
): SheetCell => state.sheet.allSheetCells[cellId]

//-----------------------------------------------------------------------------
// Select Cells
//-----------------------------------------------------------------------------
export const selectCells = (
  state: AppState
): IAllSheetCells => state.sheet.allSheetCells

//-----------------------------------------------------------------------------
// Select Column
//-----------------------------------------------------------------------------
export const selectColumn = (
  state: AppState,
  columnId: string
): SheetColumn => state.sheet.allSheetColumns[columnId]

//-----------------------------------------------------------------------------
// Select Columns
//-----------------------------------------------------------------------------
export const selectColumns = (
  state: AppState
): IAllSheetColumns => state.sheet.allSheetColumns

//-----------------------------------------------------------------------------
// Select Column Types
//-----------------------------------------------------------------------------
export const selectColumnTypes = (
  state: AppState
): IAllSheetColumnTypes => state.sheet.allSheetColumnTypes

//-----------------------------------------------------------------------------
// Select Filter
//-----------------------------------------------------------------------------
export const selectFilter = (
  state: AppState,
  filterId: string
): SheetFilter => state.sheet.allSheetFilters[filterId]

//-----------------------------------------------------------------------------
// Select Filters
//-----------------------------------------------------------------------------
export const selectFilters = (
  state: AppState
): IAllSheetFilters => state.sheet.allSheetFilters

//-----------------------------------------------------------------------------
// Select Group
//-----------------------------------------------------------------------------
export const selectGroup = (
  state: AppState,
  groupId: string
): SheetGroup => state.sheet.allSheetGroups[groupId]

//-----------------------------------------------------------------------------
// Select Groups
//-----------------------------------------------------------------------------
export const selectGroups = (
  state: AppState
): IAllSheetGroups => state.sheet.allSheetGroups

//-----------------------------------------------------------------------------
// Select Row
//-----------------------------------------------------------------------------
export const selectRow = (
  state: AppState,
  rowId: string
): SheetRow => state.sheet.allSheetRows[rowId]

//-----------------------------------------------------------------------------
// Select Rows
//-----------------------------------------------------------------------------
export const selectRows = (
  state: AppState
): IAllSheetRows => state.sheet.allSheetRows

//-----------------------------------------------------------------------------
// Select Sort
//-----------------------------------------------------------------------------
export const selectSort = (
  state: AppState,
  sortId: string
): SheetSort => state.sheet.allSheetSorts[sortId]

//-----------------------------------------------------------------------------
// Select Sorts
//-----------------------------------------------------------------------------
export const selectSorts = (
  state: AppState
): IAllSheetSorts => state.sheet.allSheetSorts

//-----------------------------------------------------------------------------
// Select Sheet Columns
//-----------------------------------------------------------------------------
export const selectSheetColumns = (
  state: AppState, 
  sheetId: string
): SheetColumn['id'][] => state.sheet.allSheets && state.sheet.allSheets[sheetId] && state.sheet.allSheets[sheetId].columns

//-----------------------------------------------------------------------------
// Select Sheet File Type
//-----------------------------------------------------------------------------
export const selectSheetFileType = (
  state: AppState, 
  sheetId: string
): FileType => state.sheet.allSheets && state.sheet.allSheets[sheetId] ? state.sheet.allSheets[sheetId].fileType : null

//-----------------------------------------------------------------------------
// Select Sheet Filters
//-----------------------------------------------------------------------------
export const selectSheetFilters = (
  state: AppState, 
  sheetId: string
): SheetFilter['id'][] => state.sheet.allSheets && state.sheet.allSheets[sheetId] && state.sheet.allSheets[sheetId].filters

//-----------------------------------------------------------------------------
// Select Sheet Groups
//-----------------------------------------------------------------------------
export const selectSheetGroups = (
  state: AppState, 
  sheetId: string
): SheetGroup['id'][] => state.sheet.allSheets && state.sheet.allSheets[sheetId] && state.sheet.allSheets[sheetId].groups

//-----------------------------------------------------------------------------
// Select Sheet Rows
//-----------------------------------------------------------------------------
export const selectSheetRows = (
  state: AppState, 
  sheetId: string
): SheetRow['id'][] => state.sheet.allSheets && state.sheet.allSheets[sheetId] && state.sheet.allSheets[sheetId].rows

//-----------------------------------------------------------------------------
// Select Sheet Source Sheet Id
//-----------------------------------------------------------------------------
export const selectSheetSourceSheetId = (
  state: AppState, 
  sheetId: string
): ISheet['id'] => state.sheet.allSheets && state.sheet.allSheets[sheetId] ? state.sheet.allSheets[sheetId].sourceSheetId : null

//-----------------------------------------------------------------------------
// Select Sheet Sorts
//-----------------------------------------------------------------------------
export const selectSheetSorts = (
  state: AppState, 
  sheetId: string
): SheetSort['id'][] => state.sheet.allSheets && state.sheet.allSheets[sheetId] && state.sheet.allSheets[sheetId].sorts

//-----------------------------------------------------------------------------
// Select Sheet Visible Columns
//-----------------------------------------------------------------------------
export const selectSheetVisibleColumns = (
  state: AppState, 
  sheetId: string
): SheetColumn['id'][] => {
  if(state.sheet.allSheets && state.sheet.allSheets[sheetId]) {
    const columns = state.sheet.allSheets[sheetId].columns
    const visibleColumns = state.sheet.allSheets[sheetId].visibleColumns
    return visibleColumns.length === 0 ? columns : visibleColumns
  }
  return null
}

//-----------------------------------------------------------------------------
// Select Sheet Visible Rows
//-----------------------------------------------------------------------------
export const selectSheetVisibleRows = (
  state: AppState, 
  sheetId: string
): SheetRow['id'][] => state.sheet.allSheets && state.sheet.allSheets[sheetId] && state.sheet.allSheets[sheetId].visibleRows
