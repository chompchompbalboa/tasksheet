//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import clone from '@/utils/clone'

import { mutation } from '@app/api'

import { IAppState } from '@app/state'
import { IThunkAction, IThunkDispatch } from '@app/state/types'
import { ISheet, ISheetCellUpdates } from '@app/state/sheet/types'

import { setAllSheetCells } from '@app/state/sheet/actions'

//-----------------------------------------------------------------------------
// Paste Sheet Range
//-----------------------------------------------------------------------------
export const pasteSheetRange = (sheetId: ISheet['id']): IThunkAction => {
  return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    const {
      allSheetCells,
      clipboard,
      allSheetRows,
      allSheets: {
        [sheetId]: sheet
      }
    } = getState().sheet
    const {
      cutOrCopy,
      selections: {
        rangeEndColumnId: clipboardRangeEndColumnId,
        rangeEndRowId: clipboardRangeEndRowId,
        rangeStartColumnId: clipboardRangeStartColumnId,
        rangeStartRowId: clipboardRangeStartRowId,
        visibleColumns: allClipboardVisibleColumns,
        visibleRows: allClipboardVisibleRows
      }
    } = clipboard
    const {
      selections: {
        rangeStartColumnId: sheetRangeStartColumnId,
        rangeStartRowId: sheetRangeStartRowId,
      },
      visibleColumns: allSheetVisibleColumns,
      visibleRows: allSheetVisibleRows
    } = sheet
    const nextAllSheetCells = clone(allSheetCells)
    const sheetCellUpdates: ISheetCellUpdates[] = []

    const clipboardVisibleColumns = allClipboardVisibleColumns.filter(columnId => columnId !== 'COLUMN_BREAK')
    const clipboardVisibleRows = allClipboardVisibleRows.filter(rowId => rowId !== 'ROW_BREAK')
    const sheetVisibleColumns = allSheetVisibleColumns.filter(columnId => columnId !== 'COLUMN_BREAK')
    const sheetVisibleRows = allSheetVisibleRows.filter(rowId => rowId !== 'COLUMN_BREAK')

    const clipboardRangeStartColumnIndex = clipboardVisibleColumns.indexOf(clipboardRangeStartColumnId)
    const sheetRangeStartColumnIndex = sheetVisibleColumns.indexOf(sheetRangeStartColumnId)
    const clipboardRangeStartRowIndex = clipboardVisibleRows.indexOf(clipboardRangeStartRowId)
    const sheetRangeStartRowIndex = sheetVisibleRows.indexOf(sheetRangeStartRowId)

    for(let clipboardRowIndex = clipboardVisibleRows.indexOf(clipboardRangeStartRowId); clipboardRowIndex <= clipboardVisibleRows.indexOf(clipboardRangeEndRowId || clipboardRangeStartRowId); clipboardRowIndex++) {
      const clipboardRowId = clipboardVisibleRows[clipboardRowIndex]
      const sheetRowId = sheetVisibleRows[sheetRangeStartRowIndex + (clipboardRowIndex - clipboardRangeStartRowIndex)]
      const clipboardRow = allSheetRows[clipboardRowId]
      const sheetRow = allSheetRows[sheetRowId]

      if(clipboardRow && sheetRow) {
        for(let clipboardColumnIndex = clipboardVisibleColumns.indexOf(clipboardRangeStartColumnId); clipboardColumnIndex <= clipboardVisibleColumns.indexOf(clipboardRangeEndColumnId || clipboardRangeStartColumnId); clipboardColumnIndex++) {
          const clipboardColumnId = clipboardVisibleColumns[clipboardColumnIndex]
          const sheetColumnId = sheetVisibleColumns[sheetRangeStartColumnIndex + (clipboardColumnIndex - clipboardRangeStartColumnIndex)]
          const clipboardCellId = clipboardRow.cells[clipboardColumnId]
          const sheetCellId = sheetRow.cells[sheetColumnId]
          const clipboardCell = allSheetCells[clipboardCellId]
          if(clipboardCell && sheetCellId) {
            nextAllSheetCells[sheetCellId].value = clipboardCell.value
            sheetCellUpdates.push({ id: sheetCellId, value: clipboardCell.value })
            if(cutOrCopy === 'CUT') {
              nextAllSheetCells[clipboardCellId].value = null
              sheetCellUpdates.push({ id: clipboardCellId, value: null })
            }
          }
        }
      }
    }
    dispatch(setAllSheetCells(nextAllSheetCells))
    mutation.updateSheetCells(sheetCellUpdates)
  }
}