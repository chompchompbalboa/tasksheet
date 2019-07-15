//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { AppState } from '@app/state'

import { Cell, Cells, Columns, Rows } from './types'

//-----------------------------------------------------------------------------
// Select Sheet Cell
//-----------------------------------------------------------------------------
export const selectSheetCell = (state: AppState, sheetId: string, cellId: string): Cell =>
	state.sheet[sheetId].cells[cellId]

//-----------------------------------------------------------------------------
// Select Sheet Cells
//-----------------------------------------------------------------------------
export const selectSheetCells = (state: AppState, sheetId: string): Cells => state.sheet[sheetId].cells

//-----------------------------------------------------------------------------
// Select Sheet Columns
//-----------------------------------------------------------------------------
export const selectSheetColumns = (state: AppState, sheetId: string): Columns => state.sheet[sheetId].columns

//-----------------------------------------------------------------------------
// Select Sheet Rows
//-----------------------------------------------------------------------------
export const selectSheetRows = (state: AppState, sheetId: string): Rows => state.sheet[sheetId].rows

//-----------------------------------------------------------------------------
// Select Sheet Width
//-----------------------------------------------------------------------------
export const selectSheetWidth = (state: AppState, sheetId: string): string => {
	const columns = state.sheet[sheetId] ? state.sheet[sheetId].columns : null
	return columns && Object.keys(columns).length !== 0
		? Object.keys(columns)
				.map(columnId => columns[columnId].width)
				.reduce((sheetWidth, columnWidth) => sheetWidth + columnWidth) + 'px'
		: null
}
