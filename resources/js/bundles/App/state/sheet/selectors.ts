//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { IAppState } from '@app/state'
import { IFileType } from '@app/state/folder/types'
import { 
  ISheet,
  ISheetActive,
  IAllSheetCells, ISheetCell, 
  IAllSheetColumns, ISheetColumn, 
  IAllSheetColumnTypes,
  IAllSheetRows, ISheetRow,
  IAllSheetFilters, ISheetFilter, 
  IAllSheetGroups, ISheetGroup,  
  IAllSheetSorts, ISheetSort, 
} from '@app/state/sheet/types'

//-----------------------------------------------------------------------------
// Select Active
//-----------------------------------------------------------------------------
export const selectActive = (
  state: IAppState
): ISheetActive => state.sheet.active

//-----------------------------------------------------------------------------
// Select Cell
//-----------------------------------------------------------------------------
export const selectCell = (
  state: IAppState,
  cellId: string
): ISheetCell => state.sheet.allSheetCells[cellId]

//-----------------------------------------------------------------------------
// Select Cells
//-----------------------------------------------------------------------------
export const selectCells = (
  state: IAppState
): IAllSheetCells => state.sheet.allSheetCells

//-----------------------------------------------------------------------------
// Select Column
//-----------------------------------------------------------------------------
export const selectColumn = (
  state: IAppState,
  columnId: string
): ISheetColumn => state.sheet.allSheetColumns[columnId]

//-----------------------------------------------------------------------------
// Select Columns
//-----------------------------------------------------------------------------
export const selectColumns = (
  state: IAppState
): IAllSheetColumns => state.sheet.allSheetColumns

//-----------------------------------------------------------------------------
// Select Column Types
//-----------------------------------------------------------------------------
export const selectColumnTypes = (
  state: IAppState
): IAllSheetColumnTypes => state.sheet.allSheetColumnTypes

//-----------------------------------------------------------------------------
// Select Filter
//-----------------------------------------------------------------------------
export const selectFilter = (
  state: IAppState,
  filterId: string
): ISheetFilter => state.sheet.allSheetFilters[filterId]

//-----------------------------------------------------------------------------
// Select Filters
//-----------------------------------------------------------------------------
export const selectFilters = (
  state: IAppState
): IAllSheetFilters => state.sheet.allSheetFilters

//-----------------------------------------------------------------------------
// Select Group
//-----------------------------------------------------------------------------
export const selectGroup = (
  state: IAppState,
  groupId: string
): ISheetGroup => state.sheet.allSheetGroups[groupId]

//-----------------------------------------------------------------------------
// Select Groups
//-----------------------------------------------------------------------------
export const selectGroups = (
  state: IAppState
): IAllSheetGroups => state.sheet.allSheetGroups

//-----------------------------------------------------------------------------
// Select Row
//-----------------------------------------------------------------------------
export const selectRow = (
  state: IAppState,
  rowId: string
): ISheetRow => state.sheet.allSheetRows[rowId]

//-----------------------------------------------------------------------------
// Select Rows
//-----------------------------------------------------------------------------
export const selectRows = (
  state: IAppState
): IAllSheetRows => state.sheet.allSheetRows

//-----------------------------------------------------------------------------
// Select Sort
//-----------------------------------------------------------------------------
export const selectSort = (
  state: IAppState,
  sortId: string
): ISheetSort => state.sheet.allSheetSorts[sortId]

//-----------------------------------------------------------------------------
// Select Sorts
//-----------------------------------------------------------------------------
export const selectSorts = (
  state: IAppState
): IAllSheetSorts => state.sheet.allSheetSorts

//-----------------------------------------------------------------------------
// Select Sheet Columns
//-----------------------------------------------------------------------------
export const selectSheetColumns = (
  state: IAppState, 
  sheetId: string
): ISheetColumn['id'][] => state.sheet.allSheets && state.sheet.allSheets[sheetId] && state.sheet.allSheets[sheetId].columns

//-----------------------------------------------------------------------------
// Select Sheet File Type
//-----------------------------------------------------------------------------
export const selectSheetFileType = (
  state: IAppState, 
  sheetId: string
): IFileType => state.sheet.allSheets && state.sheet.allSheets[sheetId] ? state.sheet.allSheets[sheetId].fileType : null

//-----------------------------------------------------------------------------
// Select Sheet Filters
//-----------------------------------------------------------------------------
export const selectSheetFilters = (
  state: IAppState, 
  sheetId: string
): ISheetFilter['id'][] => state.sheet.allSheets && state.sheet.allSheets[sheetId] && state.sheet.allSheets[sheetId].filters

//-----------------------------------------------------------------------------
// Select Sheet Groups
//-----------------------------------------------------------------------------
export const selectSheetGroups = (
  state: IAppState, 
  sheetId: string
): ISheetGroup['id'][] => state.sheet.allSheets && state.sheet.allSheets[sheetId] && state.sheet.allSheets[sheetId].groups

//-----------------------------------------------------------------------------
// Select Sheet Rows
//-----------------------------------------------------------------------------
export const selectSheetRows = (
  state: IAppState, 
  sheetId: string
): ISheetRow['id'][] => state.sheet.allSheets && state.sheet.allSheets[sheetId] && state.sheet.allSheets[sheetId].rows

//-----------------------------------------------------------------------------
// Select Sheet Source Sheet Id
//-----------------------------------------------------------------------------
export const selectSheetSourceSheetId = (
  state: IAppState, 
  sheetId: string
): ISheet['id'] => state.sheet.allSheets && state.sheet.allSheets[sheetId] ? state.sheet.allSheets[sheetId].sourceSheetId : null

//-----------------------------------------------------------------------------
// Select Sheet Sorts
//-----------------------------------------------------------------------------
export const selectSheetSorts = (
  state: IAppState, 
  sheetId: string
): ISheetSort['id'][] => state.sheet.allSheets && state.sheet.allSheets[sheetId] && state.sheet.allSheets[sheetId].sorts

//-----------------------------------------------------------------------------
// Select Sheet Visible Columns
//-----------------------------------------------------------------------------
export const selectSheetVisibleColumns = (
  state: IAppState, 
  sheetId: string
): ISheetColumn['id'][] => {
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
  state: IAppState, 
  sheetId: string
): ISheetRow['id'][] => state.sheet.allSheets && state.sheet.allSheets[sheetId] && state.sheet.allSheets[sheetId].visibleRows
