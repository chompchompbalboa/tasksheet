//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { IAppState } from '@app/state'
import { IThunkAction, IThunkDispatch } from '@app/state/types'
import { 
  ISheet, 
  ISheetView
} from '@app/state/sheet/types'

import { 
  clearSheetSelection,
  updateSheet,
  updateSheetView
} from '@app/state/sheet/actions'

import {
  resolveSheetRowLeaders,
  resolveSheetVisibleRows
} from '@app/state/sheet/resolvers'

//-----------------------------------------------------------------------------
// Create Sheet View
//-----------------------------------------------------------------------------
export const loadSheetView = (sheetId: ISheet['id'], sheetViewId: ISheetView['id']): IThunkAction => {
	return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    
    dispatch(clearSheetSelection(sheetId))
    
    const {
      allSheets: { [sheetId]: sheet },
      allSheetColumns,
      allSheetRows,
      allSheetCells,
      allSheetFilters,
      allSheetGroups,
      allSheetSorts,
      allSheetViews,
      allSheetPriorities
    } = getState().sheet

    const sheetView = allSheetViews[sheetViewId]
    const allSheetColumnIds = Object.keys(allSheetColumns)
    
    // Filter out any deleted columns from the sheet view's visibleColumns
    const nextSheetViewVisibleColumns = sheetView.visibleColumns.filter(visibleColumnId => 
      allSheetColumnIds.includes(visibleColumnId) || visibleColumnId === 'COLUMN_BREAK'
    )

    const nextSheetVisibleRows = resolveSheetVisibleRows(
      {
        ...sheet,
        activeSheetViewId: sheetViewId
      }, 
      allSheetColumns,
      allSheetRows, 
      allSheetCells, 
      allSheetFilters, 
      allSheetGroups, 
      allSheetSorts,
      {
        ...allSheetViews,
        [sheetView.id]: {
          ...allSheetViews[sheetView.id],
          visibleColumns: nextSheetViewVisibleColumns
        }
      },
      allSheetPriorities
    )
    const nextSheetRowLeaders = resolveSheetRowLeaders(nextSheetVisibleRows)
  
    dispatch(updateSheet(sheetId, {
      activeSheetViewId: sheetView.id,
      visibleRows: nextSheetVisibleRows,
      visibleRowLeaders: nextSheetRowLeaders,
    }))

    if(sheetView.visibleColumns.length !== nextSheetViewVisibleColumns.length) {
      dispatch(updateSheetView(sheetView.id, { visibleColumns: nextSheetViewVisibleColumns }))
    }
  }
}