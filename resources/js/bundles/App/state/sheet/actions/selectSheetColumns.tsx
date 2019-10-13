//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { IAppState } from '@app/state'
import { IThunkAction, IThunkDispatch } from '@app/state/types'
import { 
  ISheet,
  ISheetColumn
} from '@app/state/sheet/types'

import { updateSheet, updateSheetCell } from '@app/state/sheet/actions'

//-----------------------------------------------------------------------------
// Action
//-----------------------------------------------------------------------------
export const selectSheetColumns = (sheetId: ISheet['id'], startColumnId: ISheetColumn['id'], endColumnId?: ISheetColumn['id']): IThunkAction => {
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

    const startColumnIndex = visibleColumns.indexOf(startColumnId)
    const endColumnIndex = endColumnId ? visibleColumns.indexOf(endColumnId) : visibleColumns.indexOf(startColumnId)
    const nextRangeStartColumnId = visibleColumns[startColumnIndex]
    const nextRangeEndColumnId = visibleColumns[endColumnIndex]
    const nextIsOneEntireColumnSelected = nextRangeStartColumnId === nextRangeEndColumnId

    const nextRangeStartRow = allSheetRows[visibleRows[0]]
    const nextRangeEndRowIndex = visibleRows[visibleRows.length - 1] === 'ROW_BREAK' ? visibleRows.length - 2 : visibleRows.length - 1
    const nextRangeEndRow =  allSheetRows[visibleRows[nextRangeEndRowIndex]]
    
    const nextRangeStartCellId = nextRangeStartRow.cells[startColumnId]
    const nextRangeEndCellId = endColumnId ? nextRangeEndRow.cells[endColumnId] : nextRangeEndRow.cells[startColumnId]

    const nextRangeCellIds = new Set() as Set<string>
    for(let columnIndex = startColumnIndex; columnIndex <= endColumnIndex; columnIndex++) {
      const columnId = visibleColumns[columnIndex]
      if(columnId && columnId !== 'COLUMN_BREAK') {
        visibleRows.forEach(rowId => {
          if(rowId && rowId !== 'ROW_BREAK') {
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
        isOneEntireColumnSelected: nextIsOneEntireColumnSelected,
        isOneEntireRowSelected: false,
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