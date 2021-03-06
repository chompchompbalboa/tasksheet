//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { batch } from 'react-redux'
import { IAppState } from '@/state'
import { IThunkAction, IThunkDispatch } from '@/state/types'
import { ISheet, ISheetColumn, ISheetCell } from '@/state/sheet/types'

import { updateSheet, updateSheetCellReducer } from '@/state/sheet/actions'

//-----------------------------------------------------------------------------
// Action
//-----------------------------------------------------------------------------
export const updateSheetSelectionFromCellClick = (sheetId: string, cellId: string, isShiftClicked: boolean): IThunkAction => {
  return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    const {
      allSheetCells,
      allSheetRows,
      allSheets: {
        [sheetId]: { 
          activeSheetViewId,
          selections,
          visibleRows,
        }
      },
      allSheetViews
    } = getState().sheet

    const activeSheetView = allSheetViews[activeSheetViewId]

    const cell = allSheetCells[cellId]

    let nextRangeStartCellIsCellSelectedSheetIds: Set<string>
    if(selections.rangeStartCellId) {
      const rangeStartCell = allSheetCells[selections.rangeStartCellId]
      if(rangeStartCell) {
        nextRangeStartCellIsCellSelectedSheetIds = new Set([ ...rangeStartCell.isCellSelectedSheetIds ])
        nextRangeStartCellIsCellSelectedSheetIds.delete(sheetId)
      }
      else {
        nextRangeStartCellIsCellSelectedSheetIds = new Set() as Set<ISheet['id']>
      }
    }
    else {
      nextRangeStartCellIsCellSelectedSheetIds = new Set() as Set<ISheet['id']>
    }

    const selectCell = () => {
      batch(() => {
        const nextSelectionsRangeCellIds = selections.rangeCellIds.size > 0 ? new Set() as Set<ISheetCell['id']> : selections.rangeCellIds
        dispatch(updateSheetCellReducer(selections.rangeStartCellId, {
          isCellSelectedSheetIds: nextRangeStartCellIsCellSelectedSheetIds
        }))
        dispatch(updateSheetCellReducer(cell.id, { isCellSelectedSheetIds: new Set([ sheetId, ...cell.isCellSelectedSheetIds ]) }))
        dispatch(updateSheet(sheetId, {
          selections: {
            ...selections,
            isOneEntireColumnSelected: false,
            isOneEntireRowSelected: false,
            rangeColumnIds: new Set() as Set<ISheetColumn['id']>,
            rangeCellIds: nextSelectionsRangeCellIds,
            rangeStartCellId: cell.id,
            rangeStartColumnId: cell.columnId,
            rangeStartRowId: cell.rowId,
            rangeEndCellId: null,
            rangeEndColumnId: null,
            rangeEndRowId: null
          }
        }, true))
      })
    }

    if(!isShiftClicked || selections.rangeStartCellId === null) {
      selectCell()
    }
    if(isShiftClicked) {
      // Range start and end column and row indexes
      const cellColumnIndex = activeSheetView.visibleColumns.indexOf(cell.columnId)
      const cellRowIndex = visibleRows.indexOf(cell.rowId)
      const rangeStartColumnIndex = activeSheetView.visibleColumns.indexOf(selections.rangeStartColumnId)
      const rangeStartRowIndex = visibleRows.indexOf(selections.rangeStartRowId)
      const rangeEndColumnIndex = Math.max(...[cellColumnIndex, activeSheetView.visibleColumns.indexOf(selections.rangeEndColumnId)].filter(value => value !== null))
      const rangeEndRowIndex = Math.max(...[cellRowIndex, visibleRows.indexOf(selections.rangeEndRowId)].filter(value => value !== null))
      if(cellColumnIndex < rangeStartColumnIndex || cellRowIndex < rangeStartRowIndex) {
        selectCell()
      }
      else {
        // Next sheet selection cell ids
        const nextSheetSelectionRangeCellIds = new Set([ ...selections.rangeCellIds ])
        for(let rowIndex = rangeStartRowIndex; rowIndex <= rangeEndRowIndex; rowIndex++) {
          const rowId = visibleRows[rowIndex]
          if(rowId !== 'ROW_BREAK') {
            const row = allSheetRows[rowId]
            for(let columnIndex = rangeStartColumnIndex; columnIndex <= rangeEndColumnIndex; columnIndex++) {
              const columnId = activeSheetView.visibleColumns[columnIndex]
              if(columnId !== 'COLUMN_BREAK') {
                const cellId = row.cells[columnId]
                nextSheetSelectionRangeCellIds.add(cellId)
              }
            }
          }
        }
      
        dispatch(updateSheet(sheetId, {
          selections: {
            ...selections,
            isOneEntireColumnSelected: false,
            isOneEntireRowSelected: false,
            rangeColumnIds: new Set() as Set<ISheetColumn['id']>,
            rangeCellIds: nextSheetSelectionRangeCellIds,
            rangeEndCellId: cell.id,
            rangeEndColumnId: activeSheetView.visibleColumns[rangeEndColumnIndex],
            rangeEndRowId: visibleRows[rangeEndRowIndex],
          }
        }, true))
      }
    }
  }
}