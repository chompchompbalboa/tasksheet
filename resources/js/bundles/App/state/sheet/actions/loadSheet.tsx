//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { IThunkAction, IThunkDispatch } from '@app/state/types'
import { 
  ISheet, ISheetFromDatabase,
  IAllSheetCells, ISheetCell,
  IAllSheetColumns, ISheetColumn,
  IAllSheetFilters, ISheetFilter,
  IAllSheetGroups, ISheetGroup,
  IAllSheetSorts, ISheetSort,
  IAllSheetRows, ISheetRow,
  IAllSheetViews, ISheetView, ISheetViewFromDatabase
} from '@app/state/sheet/types'

import { 
  loadSheetReducer,
  updateSheetSelectionFromCellClick
} from '@app/state/sheet/actions'

import { defaultSheetSelections } from '@app/state/sheet/defaults'

import { 
  resolveSheetRowLeaders,
  resolveSheetVisibleRows
 } from '@app/state/sheet/resolvers'
import {  } from './updateSheetSelectionFromCellClick'
//-----------------------------------------------------------------------------
// Action
//-----------------------------------------------------------------------------
export const loadSheet = (sheetFromDatabase: ISheetFromDatabase): IThunkAction => {

	return async (dispatch: IThunkDispatch) => {
    
    const normalizedSheetRows: IAllSheetRows = {}
    const normalizedSheetCells: IAllSheetCells = {}
    const normalizedSheetColumns: IAllSheetColumns = {}
    const normalizedSheetFilters: IAllSheetFilters = {}
    const normalizedSheetGroups: IAllSheetGroups = {}
    const normalizedSheetSorts: IAllSheetSorts = {}
    const normalizedSheetViews: IAllSheetViews = {}

    const sheetColumns: ISheetColumn['id'][] = []
    const sheetRows: ISheetRow['id'][] = []
    const sheetViews: ISheetView['id'][] = []

    const activeSheetViewId = sheetFromDatabase.activeSheetViewId

    // Sheet Rows
    sheetFromDatabase.rows.forEach(sheetRow => { 
      let sheetRowCells: { 
        [columnId: string]: ISheetCell['id'] 
      } = {}
      sheetRow.cells.forEach(sheetRowCell => {
        normalizedSheetCells[sheetRowCell.id] = { 
          ...sheetRowCell, 
          isCellEditing: false,
          isCellSelectedSheetIds: new Set() as Set<string>,
        }
        sheetRowCells[sheetRowCell.columnId] = sheetRowCell.id
      })
      normalizedSheetRows[sheetRow.id] = { 
        id: sheetRow.id, 
        sheetId: sheetFromDatabase.id, 
        cells: sheetRowCells
      }
      sheetRows.push(sheetRow.id)
    })

    // Sheet Columns
    sheetFromDatabase.columns.forEach(sheetColumn => { 
      normalizedSheetColumns[sheetColumn.id] = sheetColumn
      sheetColumns.push(sheetColumn.id)
    })

    // Sheet Views
    sheetFromDatabase.views.forEach(sheetView => { 

      const sheetViewFilterIds = sheetView.filters.map(filter => filter.id)
      const sheetViewGroupIds = sheetView.groups.map(group => group.id)
      const sheetViewSortIds = sheetView.sorts.map(sort => sort.id)

      normalizedSheetViews[sheetView.id] = {
        ...sheetView,
        filters: sheetViewFilterIds,
        groups: sheetViewGroupIds,
        sorts: sheetViewSortIds
      }
      sheetViews.push(sheetView.id)
    })

    // Sheet Views Fiters, Sorts and Groups
    sheetFromDatabase.views.forEach((sheetView: ISheetViewFromDatabase) => {
      sheetView.filters.forEach((filter: ISheetFilter) => {
        normalizedSheetFilters[filter.id] = filter
      })
      sheetView.groups.forEach((group: ISheetGroup) => {
        normalizedSheetGroups[group.id] = group 
      })
      sheetView.sorts.forEach((sort: ISheetSort) => {
        normalizedSheetSorts[sort.id] = sort 
      })
    })
    
    // Sheet view's Visible Columns
    const newSheetViewVisibleColumns = normalizedSheetViews[activeSheetViewId].visibleColumns.filter(visibleColumnId => 
      sheetColumns.includes(visibleColumnId) || visibleColumnId === 'COLUMN_BREAK'
    )
    normalizedSheetViews[activeSheetViewId].visibleColumns = newSheetViewVisibleColumns
    
    // New Sheet
    const newSheet: ISheet = {
      id: sheetFromDatabase.id,
      sourceSheetId: sheetFromDatabase.sourceSheetId,
      activeSheetViewId: activeSheetViewId,
      columns: sheetColumns,
      rows: sheetRows,
      visibleRows: null,
      visibleRowLeaders: null,
      selections: defaultSheetSelections,
      styles: {
        id: sheetFromDatabase.styles.id,
        backgroundColor: new Set(sheetFromDatabase.styles.backgroundColor) as Set<string>,
        backgroundColorReference: sheetFromDatabase.styles.backgroundColorReference || {},
        bold: new Set(sheetFromDatabase.styles.bold) as Set<string>,
        color: new Set(sheetFromDatabase.styles.color) as Set<string>,
        colorReference: sheetFromDatabase.styles.colorReference || {},
        italic: new Set(sheetFromDatabase.styles.italic) as Set<string>,
      },
      views: sheetViews
    }

    // Sheet's Visible Rows and Row Leaders
    const nextSheetVisibleRows = resolveSheetVisibleRows(
      newSheet, 
      normalizedSheetRows, 
      normalizedSheetCells, 
      normalizedSheetFilters, 
      normalizedSheetGroups, 
      normalizedSheetSorts,
      normalizedSheetViews
    )
    const nextSheetVisibleRowLeaders = resolveSheetRowLeaders(nextSheetVisibleRows)

    const sheetFirstVisibleRow = normalizedSheetRows[nextSheetVisibleRows[0]]
    const sheetFirstVisibleColumnId = newSheetViewVisibleColumns[0]
    const sheetFirstCell = normalizedSheetCells[sheetFirstVisibleRow.cells[sheetFirstVisibleColumnId]]
    
    // Dispatch the state change
		dispatch(
			loadSheetReducer(
        {
          ...newSheet,
          visibleRows: nextSheetVisibleRows,
          visibleRowLeaders: nextSheetVisibleRowLeaders
        },
        normalizedSheetCells,
        normalizedSheetColumns,
        normalizedSheetFilters,
        normalizedSheetGroups,
        normalizedSheetRows,
        normalizedSheetSorts,
        normalizedSheetViews
			)
    )
    
    dispatch(updateSheetSelectionFromCellClick(newSheet.id, sheetFirstCell.id, false))
	}
}