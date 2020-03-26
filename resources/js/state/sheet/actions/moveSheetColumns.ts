//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { IAppState } from '@/state'
import { IThunkAction, IThunkDispatch } from '@/state/types'
import { ISheet, ISheetColumn } from '@/state/sheet/types'

import { updateSheetView } from '@/state/sheet/actions'

//-----------------------------------------------------------------------------
// Move Sheet Columns
//-----------------------------------------------------------------------------
export const moveSheetColumns = (
  sheetId: ISheet['id'],
  columnId: ISheetColumn['id'],
  moveToColumnIndex: number
): IThunkAction => {
	return async (dispatch: IThunkDispatch, getState: () => IAppState) => {

    const {
      allSheets,
      allSheetViews
    } = getState().sheet

    // Get the sheet
    const sheet = allSheets[sheetId]
    const activeSheetView = allSheetViews[sheet.activeSheetViewId]

    // Are multiple columns selected?
    const isMultipleColumnsSelected = sheet.selections.rangeColumnIds.size > 1 && sheet.selections.rangeColumnIds.has(columnId)

    // Get the visibleColumns indexes for the columns to move
    const firstColumnToMoveIndex = isMultipleColumnsSelected
      ? activeSheetView.visibleColumns.indexOf(sheet.selections.rangeStartColumnId)
      : activeSheetView.visibleColumns.indexOf(columnId)
    const lastColumnToMoveIndex = isMultipleColumnsSelected
      ? activeSheetView.visibleColumns.indexOf(sheet.selections.rangeEndColumnId)
      : activeSheetView.visibleColumns.indexOf(columnId)

    // Get the column ids to move
    const columnIdsToMove = activeSheetView.visibleColumns.map((columnId, index) => {
      if(firstColumnToMoveIndex <= index && index <= lastColumnToMoveIndex) {
        return columnId
      }
    }).filter(Boolean)

    // Get the next visibleColumns
    const nextVisibleColumns = [
      ...activeSheetView.visibleColumns.filter((currentColumnId, index) => index < moveToColumnIndex && !columnIdsToMove.includes(currentColumnId)),
      ...columnIdsToMove,
      ...activeSheetView.visibleColumns.filter((currentColumnId, index) => index >= moveToColumnIndex && !columnIdsToMove.includes(currentColumnId))
    ]

    // Update the sheet view
    dispatch(updateSheetView(activeSheetView.id, {
      visibleColumns: nextVisibleColumns
    }, false, true))
	}
}