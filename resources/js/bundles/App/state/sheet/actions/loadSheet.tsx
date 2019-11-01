//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import moment from 'moment'

import { IThunkAction, IThunkDispatch } from '@app/state/types'
import { 
  ISheet, ISheetFromDatabase,
  IAllSheetCells, ISheetCell,
  IAllSheetColumns, ISheetColumn,
  IAllSheetFilters, ISheetFilter,
  IAllSheetGroups, ISheetGroup,
  IAllSheetSorts, ISheetSort,
  IAllSheetRows,
  IAllSheetViews, ISheetView, ISheetViewFromDatabase
} from '@app/state/sheet/types'

import { loadSheetReducer } from '@app/state/sheet/actions'

import { defaultSheetSelections } from '@app/state/sheet/defaults'

import { 
  resolveSheetRowLeaders,
  resolveSheetVisibleRows
 } from '@app/state/sheet/resolvers'
//-----------------------------------------------------------------------------
// Action
//-----------------------------------------------------------------------------
export const loadSheet = (sheetFromDatabase: ISheetFromDatabase): IThunkAction => {

	return async (dispatch: IThunkDispatch) => {
    
    // Rows and cells
    const normalizedRows: IAllSheetRows = {}
    const normalizedCells: IAllSheetCells = {}
    const sheetRows: ISheetColumn['id'][] = []
    sheetFromDatabase.rows.forEach(row => { 
      let rowCells: { [columnId: string]: ISheetCell['id'] }  = {}
      row.cells.forEach(cell => {
        normalizedCells[cell.id] = { 
          ...cell, 
          isCellEditing: false,
          isCellSelectedSheetIds: new Set() as Set<string>,
        }
        rowCells[cell.columnId] = cell.id
      })
      normalizedRows[row.id] = { 
        id: row.id, 
        sheetId: sheetFromDatabase.id, 
        createdAt: moment(row.createdAt),
        cells: rowCells
      }
      sheetRows.push(row.id)
    })

    // Columns
    const normalizedColumns: IAllSheetColumns = {}
    const sheetColumns: ISheetColumn['id'][] = []
    sheetFromDatabase.columns.forEach(column => { 
      normalizedColumns[column.id] = column 
      sheetColumns.push(column.id)
    })

    // Views
    const activeSheetViewId = sheetFromDatabase.activeSheetViewId || sheetFromDatabase.defaultSheetViewId
    const normalizedSheetViews: IAllSheetViews = {}
    const sheetViews: ISheetView['id'][] = []
    const normalizedFilters: IAllSheetFilters = {}
    const normalizedGroups: IAllSheetGroups = {}
    const normalizedSorts: IAllSheetSorts = {}

    sheetFromDatabase.views.forEach(sheetView => { 
      const sheetViewFilters = sheetView.filters.map(filter => filter.id)
      const sheetViewGroups = sheetView.groups.map(group => group.id)
      const sheetViewSorts = sheetView.sorts.map(sort => sort.id)
      normalizedSheetViews[sheetView.id] = {
        ...sheetView,
        visibleRows: null,
        visibleRowLeaders: null,
        filters: sheetViewFilters,
        groups: sheetViewGroups,
        sorts: sheetViewSorts
      }
      sheetViews.push(sheetView.id)
    })
    sheetFromDatabase.views.forEach((sheetView: ISheetViewFromDatabase) => {
      sheetView.filters.forEach((filter: ISheetFilter) => {
        normalizedFilters[filter.id] = filter
      })
      sheetView.groups.forEach((group: ISheetGroup) => {
        normalizedGroups[group.id] = group 
      })
      sheetView.sorts.forEach((sort: ISheetSort) => {
        normalizedSorts[sort.id] = sort
      })
    })
    
    const activeSheetViewVisibleColumns = normalizedSheetViews[activeSheetViewId] 
      ? normalizedSheetViews[activeSheetViewId].visibleColumns.filter(visibleColumnId => sheetColumns.includes(visibleColumnId) || visibleColumnId === 'COLUMN_BREAK')
      : sheetColumns
    
    // New Sheet
    const newSheet: ISheet = {
      id: sheetFromDatabase.id,
      sourceSheetId: sheetFromDatabase.sourceSheetId,
      activeSheetViewId: activeSheetViewId,
      defaultSheetViewId: sheetFromDatabase.defaultSheetViewId,
      columns: sheetColumns,
      rows: sheetRows,
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

    normalizedSheetViews[activeSheetViewId].visibleColumns = activeSheetViewVisibleColumns
    const nextSheetViewVisibleRows = resolveSheetVisibleRows(
      newSheet, 
      normalizedRows, 
      normalizedCells, 
      normalizedFilters, 
      normalizedGroups, 
      normalizedSorts,
      normalizedSheetViews
    )
    const nextSheetViewRowLeaders = resolveSheetRowLeaders(nextSheetViewVisibleRows)
    normalizedSheetViews[activeSheetViewId].visibleRows = nextSheetViewVisibleRows
    normalizedSheetViews[activeSheetViewId].visibleRowLeaders = nextSheetViewRowLeaders
    
		dispatch(
			loadSheetReducer(
        {
          ...newSheet
        },
        normalizedCells,
        normalizedColumns,
        normalizedFilters,
        normalizedGroups,
        normalizedRows,
        normalizedSorts,
        normalizedSheetViews
			)
		)
	}
}