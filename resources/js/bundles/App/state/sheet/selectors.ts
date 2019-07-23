//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { AppState } from '@app/state'
import { Cell, Column, Columns, Row, Rows, Sorts, VisibleColumns, VisibleRows } from './types'

//-----------------------------------------------------------------------------
// Select Sheet Cell
//-----------------------------------------------------------------------------
export const selectSheetCell = (
	state: AppState,
	sheetId: string,
	rowIndex: number,
	cellIndex: number
): Cell => state.sheet[sheetId] && state.sheet[sheetId].rows[rowIndex].cells[cellIndex]

//-----------------------------------------------------------------------------
// Select Sheet Columns
//-----------------------------------------------------------------------------
export const selectSheetColumns = (
  state: AppState, 
  sheetId: string
): Columns => state.sheet[sheetId] && state.sheet[sheetId].columns

//-----------------------------------------------------------------------------
// Select Sheet Columns
//-----------------------------------------------------------------------------
export const selectSheetVisibleColumns = (
  state: AppState, 
  sheetId: string
): VisibleColumns => state.sheet[sheetId] && state.sheet[sheetId].visibleColumns

//-----------------------------------------------------------------------------
// Select Sheet Column
//-----------------------------------------------------------------------------
export const selectSheetColumn = (
	state: AppState,
	sheetId: string,
	columnIndex: number
): Column => state.sheet[sheetId].columns[columnIndex]

//-----------------------------------------------------------------------------
// Select Sheet Rows
//-----------------------------------------------------------------------------
export const selectSheetRows = (
  state: AppState, 
  sheetId: string
): Rows => state.sheet[sheetId] && state.sheet[sheetId].rows

//-----------------------------------------------------------------------------
// Select Sheet Rows
//-----------------------------------------------------------------------------
export const selectSheetVisibleRows = (
  state: AppState, 
  sheetId: string
): VisibleRows => state.sheet[sheetId] && state.sheet[sheetId].visibleRows

//-----------------------------------------------------------------------------
// Select Sheet Row
//-----------------------------------------------------------------------------
export const selectSheetRow = (
	state: AppState,
	sheetId: string,
	rowIndex: number
): Row => state.sheet[sheetId] && state.sheet[sheetId].rows[rowIndex]

//-----------------------------------------------------------------------------
// Select Sheet Sorts
//-----------------------------------------------------------------------------
export const selectSheetSorts = (
  state: AppState, 
  sheetId: string
): Sorts => state.sheet[sheetId] && state.sheet[sheetId].sorts
