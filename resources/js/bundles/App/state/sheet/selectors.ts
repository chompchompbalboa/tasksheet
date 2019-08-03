//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { AppState } from '@app/state'
import { SheetCell, SheetColumn, SheetColumns, SheetRow, SheetRows, SheetFilters, SheetGroups, SheetSorts, SheetVisibleColumns, SheetVisibleRows } from './types'

//-----------------------------------------------------------------------------
// Select Sheet Cell
//-----------------------------------------------------------------------------
export const selectSheetCell = (
	state: AppState,
	sheetId: string,
	rowIndex: number,
	cellIndex: number
): SheetCell => state.sheet[sheetId] && state.sheet[sheetId].rows[rowIndex].cells[cellIndex]

//-----------------------------------------------------------------------------
// Select Sheet Columns
//-----------------------------------------------------------------------------
export const selectSheetColumns = (
  state: AppState, 
  sheetId: string
): SheetColumns => state.sheet[sheetId] && state.sheet[sheetId].columns

//-----------------------------------------------------------------------------
// Select Sheet Columns
//-----------------------------------------------------------------------------
export const selectSheetVisibleColumns = (
  state: AppState, 
  sheetId: string
): SheetVisibleColumns => state.sheet[sheetId] && state.sheet[sheetId].visibleColumns

//-----------------------------------------------------------------------------
// Select Sheet Column
//-----------------------------------------------------------------------------
export const selectSheetColumn = (
	state: AppState,
	sheetId: string,
	columnIndex: number
): SheetColumn => state.sheet[sheetId].columns[columnIndex]

//-----------------------------------------------------------------------------
// Select Sheet Groups
//-----------------------------------------------------------------------------
export const selectSheetGroups = (
  state: AppState, 
  sheetId: string
): SheetGroups => state.sheet[sheetId] && state.sheet[sheetId].groups

//-----------------------------------------------------------------------------
// Select Sheet Filters
//-----------------------------------------------------------------------------
export const selectSheetFilters = (
  state: AppState, 
  sheetId: string
): SheetFilters => state.sheet[sheetId] && state.sheet[sheetId].filters

//-----------------------------------------------------------------------------
// Select Sheet Rows
//-----------------------------------------------------------------------------
export const selectSheetRows = (
  state: AppState, 
  sheetId: string
): SheetRows => state.sheet[sheetId] && state.sheet[sheetId].rows

//-----------------------------------------------------------------------------
// Select Sheet Rows
//-----------------------------------------------------------------------------
export const selectSheetVisibleRows = (
  state: AppState, 
  sheetId: string
): SheetVisibleRows => state.sheet[sheetId] && state.sheet[sheetId].visibleRows

//-----------------------------------------------------------------------------
// Select Sheet Row
//-----------------------------------------------------------------------------
export const selectSheetRow = (
	state: AppState,
	sheetId: string,
	rowIndex: number
): SheetRow => state.sheet[sheetId] && state.sheet[sheetId].rows[rowIndex]

//-----------------------------------------------------------------------------
// Select Sheet Sorts
//-----------------------------------------------------------------------------
export const selectSheetSorts = (
  state: AppState, 
  sheetId: string
): SheetSorts => state.sheet[sheetId] && state.sheet[sheetId].sorts

//-----------------------------------------------------------------------------
// Select Sheet Source Sheet Id
//-----------------------------------------------------------------------------
export const selectSheetSourceSheetId = (
  state: AppState, 
  sheetId: string
): string => state.sheet[sheetId] && state.sheet[sheetId].sourceSheetId
