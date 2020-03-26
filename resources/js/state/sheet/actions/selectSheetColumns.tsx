//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { IAppState } from '@/state'
import { IThunkAction, IThunkDispatch } from '@/state/types'
import { 
  ISheet,
  ISheetColumn
} from '@/state/sheet/types'

import { updateSheet, updateSheetCell } from '@/state/sheet/actions'

//-----------------------------------------------------------------------------
// Action
//-----------------------------------------------------------------------------
export const selectSheetColumns = (
  sheetId: ISheet['id'], 
  startColumnId: ISheetColumn['id'], 
  endColumnId?: ISheetColumn['id']
  ): IThunkAction => {
  return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    const {
      allSheetCells,
      allSheetRows,
      allSheets: { 
        [sheetId]: {
          activeSheetViewId,
          selections,
          visibleRows 
        }
      },
      allSheetViews
    } = getState().sheet

    const activeSheetView = allSheetViews[activeSheetViewId]

    if(startColumnId !== 'COLUMN_BREAK' && endColumnId !== 'COLUMN_BREAK') {

      const startColumnIndex = activeSheetView.visibleColumns.indexOf(startColumnId)
      const endColumnIndex = endColumnId ? activeSheetView.visibleColumns.indexOf(endColumnId) : activeSheetView.visibleColumns.indexOf(startColumnId)
      const nextRangeStartColumnId = activeSheetView.visibleColumns[startColumnIndex]
      const nextRangeEndColumnId = activeSheetView.visibleColumns[endColumnIndex]
      const nextIsOneEntireColumnSelected = nextRangeStartColumnId === nextRangeEndColumnId

      const nextRangeColumnIds = new Set() as Set<ISheetColumn['id']>
      for(let i = startColumnIndex; i <= endColumnIndex; i++) {
        const currentColumnId = activeSheetView.visibleColumns[i]
        if(currentColumnId !== 'COLUMN_BREAK') {
          nextRangeColumnIds.add(currentColumnId)
        }
      }
  
      const nextRangeStartRow = allSheetRows[visibleRows[0]]
      const nextRangeEndRowIndex = visibleRows[visibleRows.length - 1] === 'ROW_BREAK' ? visibleRows.length - 2 : visibleRows.length - 1
      const nextRangeEndRow =  allSheetRows[visibleRows[nextRangeEndRowIndex]]
      
      const nextRangeStartCellId = nextRangeStartRow.cells[startColumnId]
      const nextRangeEndCellId = endColumnId ? nextRangeEndRow.cells[endColumnId] : nextRangeEndRow.cells[startColumnId]
  
      const nextRangeCellIds = new Set() as Set<string>
      for(let columnIndex = startColumnIndex; columnIndex <= endColumnIndex; columnIndex++) {
        const columnId = activeSheetView.visibleColumns[columnIndex]
        if(columnId && columnId !== 'COLUMN_BREAK') {
          visibleRows.forEach(rowId => {
            if(rowId && rowId !== 'ROW_BREAK') {
              const cellId = allSheetRows[rowId].cells[columnId]
              nextRangeCellIds.add(cellId)
            }
          })
        }
      }
  
      const nextRangeStartCell = allSheetCells[nextRangeStartCellId]
      const rangeStartCell = allSheetCells[selections.rangeStartCellId]
      const nextRangeStartCellIsCellSelectedSheetIds = rangeStartCell ? new Set([ ...rangeStartCell.isCellSelectedSheetIds ]) : new Set() as Set<string>
      nextRangeStartCellIsCellSelectedSheetIds.delete(sheetId)
  
      dispatch(updateSheetCell(selections.rangeStartCellId, { isCellSelectedSheetIds: nextRangeStartCellIsCellSelectedSheetIds }, null, true))
      dispatch(updateSheetCell(nextRangeStartCellId, { isCellSelectedSheetIds: new Set([ sheetId, ...nextRangeStartCell.isCellSelectedSheetIds ]) }, null, true))
      dispatch(updateSheet(sheetId, { 
        selections: {
          ...selections,
          isOneEntireColumnSelected: nextIsOneEntireColumnSelected,
          isOneEntireRowSelected: false,
          rangeColumnIds: nextRangeColumnIds,
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
}