//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { IAppState } from '@app/state'
import { IThunkAction, IThunkDispatch } from '@app/state/types'
import { 
  ISheet,
  ISheetRow
} from '@app/state/sheet/types'

import { updateSheet, updateSheetCell } from '@app/state/sheet/actions'

//-----------------------------------------------------------------------------
// Action
//-----------------------------------------------------------------------------
export const selectSheetRows = (sheetId: ISheet['id'], startRowId: ISheetRow['id'], endRowId?: ISheetRow['id']): IThunkAction => {
  return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    const {
      allSheetRows,
      allSheets: { 
        [sheetId]: { 
          selections,
          visibleColumns, 
          visibleRows 
        } 
      }
    } = getState().sheet
    
    const startRowIdVisibleRowsIndex = visibleRows.indexOf(startRowId)
    const endRowIdVisibleRowsIndex = endRowId ? visibleRows.indexOf(endRowId) : visibleRows.indexOf(startRowId)
    const nextStartRowIndex = Math.min(startRowIdVisibleRowsIndex, endRowIdVisibleRowsIndex)
    const nextEndRowIndex = Math.max(startRowIdVisibleRowsIndex, endRowIdVisibleRowsIndex)
    const nextRangeStartRowId = visibleRows[nextStartRowIndex]
    const nextRangeEndRowId = visibleRows[nextEndRowIndex]
    
    const nextRangeStartRow = allSheetRows[nextRangeStartRowId]
    const nextRangeStartRowIndex = visibleRows.indexOf(nextRangeStartRow.id)
    const nextRangeStartColumnId = visibleColumns[0]
    const nextRangeStartCellId = nextRangeStartRow.cells[nextRangeStartColumnId]
    const nextRangeEndRow = allSheetRows[nextRangeEndRowId]
    const nextRangeEndRowIndex = visibleRows.indexOf(nextRangeEndRow.id)
    const nextRangeEndColumnId = visibleColumns[Math.max(0, visibleColumns.length - 1)]
    const nextRangeEndCellId = nextRangeEndRow.cells[nextRangeEndColumnId]
    const nextIsOneEntireRowSelected = nextRangeStartRow.id === nextRangeEndRow.id

    const nextRangeCellIds = new Set() as Set<string>
    for(let rowIndex = nextRangeStartRowIndex; rowIndex <= nextRangeEndRowIndex; rowIndex++) {
      const rowId = visibleRows[rowIndex]
      if(rowId && rowId !== 'ROW_BREAK') {
        visibleColumns.forEach(columnId => {
          if(columnId && columnId !== 'COLUMN_BREAK') {
            const cellId = allSheetRows[rowId].cells[columnId]
            nextRangeCellIds.add(cellId)
          }
        })
      }
    }
    dispatch(updateSheetCell(selections.rangeStartCellId, { isCellSelected: false }, null, true))
    dispatch(updateSheetCell(nextRangeStartCellId, { isCellSelected: true }, null, true))
    dispatch(updateSheet(sheetId, { 
      selections: {
        ...selections,
        isOneEntireColumnSelected: false,
        isOneEntireRowSelected: nextIsOneEntireRowSelected,
        rangeCellIds: nextRangeCellIds,
        rangeStartCellId: nextRangeStartCellId,
        rangeStartColumnId: nextRangeStartColumnId,
        rangeStartRowId: nextRangeStartRow.id,
        rangeEndCellId: nextRangeEndCellId,
        rangeEndColumnId: nextRangeEndColumnId,
        rangeEndRowId: nextRangeEndRow.id,
      }
    }, true))
  }
}