//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { IThunkAction, IThunkDispatch } from '@/state/types'
import { 
  ISheet, ISheetFromDatabase,
  IAllSheetColumns, ISheetColumn,
  IAllSheetRows, ISheetRow,
  IAllSheetCells, ISheetCell,
  IAllSheetFilters, ISheetFilter,
  IAllSheetGroups, ISheetGroup,
  IAllSheetSorts, ISheetSort,
  IAllSheetViews, ISheetView, ISheetViewFromDatabase,
  IAllSheetCellChanges, IAllSheetChanges,
  IAllSheetCellFiles, IAllSheetFiles,
  IAllSheetCellPhotos, IAllSheetPhotos,
  IAllSheetPriorities, ISheetPriority, ISheetCellPriority
} from '@/state/sheet/types'

import { 
  loadSheetReducer,
  updateSheetSelectionFromCellClick
} from '@/state/sheet/actions'

import { defaultSheetSelections } from '@/state/sheet/defaults'

import { 
  resolveSheetRowLeaders,
  resolveSheetVisibleRows
 } from '@/state/sheet/resolvers'

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
    const normalizedSheetChanges: IAllSheetChanges = {}
    const normalizedSheetFiles: IAllSheetFiles = {}
    const normalizedSheetPhotos: IAllSheetPhotos = {}
    const normalizedSheetPriorities: IAllSheetPriorities = {}
    const normalizedSheetCellChanges: IAllSheetCellChanges = {}
    const normalizedSheetCellFiles: IAllSheetCellFiles = {}
    const normalizedSheetCellPhotos: IAllSheetCellPhotos = {}

    const sheetColumns: ISheetColumn['id'][] = []
    const sheetRows: ISheetRow['id'][] = []
    const sheetViews: ISheetView['id'][] = []
    const sheetPriorities: ISheetPriority['id'][] = []
    const sheetCellPriorities: { [cellId: string]: ISheetCellPriority } = {}

    const activeSheetViewId = sheetFromDatabase.activeSheetViewId

    // Sheet Columns
    sheetFromDatabase.columns.forEach(sheetColumn => { 
      normalizedSheetColumns[sheetColumn.id] = {
        allCellValues: new Set() as Set<string>,
        ...sheetColumn
      }
      sheetColumns.push(sheetColumn.id)
    })

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
        if(sheetRowCell.value && ![null, ''].includes(sheetRowCell.value)) {
          normalizedSheetColumns[sheetRowCell.columnId].allCellValues.add(sheetRowCell.value)
        }
      })
      normalizedSheetRows[sheetRow.id] = { 
        id: sheetRow.id, 
        sheetId: sheetFromDatabase.id, 
        cells: sheetRowCells
      }
      sheetRows.push(sheetRow.id)
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
        sorts: sheetViewSortIds,
        searchValue: null
      }
      sheetViews.push(sheetView.id)
    })
    
    // Sheet Changes
    sheetFromDatabase.changes.forEach(sheetChange => { 
      normalizedSheetChanges[sheetChange.id] = sheetChange
      normalizedSheetCellChanges[sheetChange.cellId] = [
        ...(normalizedSheetCellChanges[sheetChange.cellId] || []),
        sheetChange.id
      ]
    })
    
    // Sheet Files
    sheetFromDatabase.files.forEach(sheetFile => { 
      normalizedSheetFiles[sheetFile.id] = sheetFile
      normalizedSheetCellFiles[sheetFile.cellId] = [
        ...(normalizedSheetCellFiles[sheetFile.cellId] || []),
        sheetFile.id
      ]
    })
    
    // Sheet Photos
    sheetFromDatabase.photos.forEach(sheetPhoto => { 
      normalizedSheetPhotos[sheetPhoto.id] = sheetPhoto
      normalizedSheetCellPhotos[sheetPhoto.cellId] = [
        ...(normalizedSheetCellPhotos[sheetPhoto.cellId] || []),
        sheetPhoto.id
      ]
    })

    // Sheet Priorities
    sheetFromDatabase.priorities.forEach(sheetPriority => { 
      normalizedSheetPriorities[sheetPriority.id] = sheetPriority
      sheetPriorities.push(sheetPriority.id)
    })

    // Sheet Cell Priorities
    sheetFromDatabase.cellPriorities.forEach(sheetCellPriority => {
      sheetCellPriorities[sheetCellPriority.cellId] = sheetCellPriority
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
      views: sheetViews,
      priorities: sheetPriorities,
      cellPriorities: sheetCellPriorities,
      isCellEditing: false
    }

    // Sheet's Visible Rows and Row Leaders
    const nextSheetVisibleRows = resolveSheetVisibleRows(
      newSheet, 
      normalizedSheetColumns,
      normalizedSheetRows, 
      normalizedSheetCells, 
      normalizedSheetFilters, 
      normalizedSheetGroups, 
      normalizedSheetSorts,
      normalizedSheetViews,
      normalizedSheetPriorities
    )
    const nextSheetVisibleRowLeaders = resolveSheetRowLeaders(nextSheetVisibleRows)
    
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
        normalizedSheetViews,
        normalizedSheetChanges,
        normalizedSheetFiles,
        normalizedSheetPhotos,
        normalizedSheetPriorities,
        normalizedSheetCellChanges,
        normalizedSheetCellFiles,
        normalizedSheetCellPhotos,
			)
    )
    
    // Select the first cell of the sheet
    const sheetFirstVisibleRow = normalizedSheetRows[nextSheetVisibleRows[0]]
    const sheetFirstVisibleColumnId = newSheetViewVisibleColumns[0]
    const sheetFirstVisibleColumn = normalizedSheetColumns[sheetFirstVisibleColumnId]
    const sheetFirstCell = sheetFirstVisibleRow && sheetFirstVisibleColumnId ? normalizedSheetCells[sheetFirstVisibleRow.cells[sheetFirstVisibleColumnId]] : null
    sheetFirstCell && sheetFirstVisibleColumn && !['FILES', 'PHOTOS'].includes(sheetFirstVisibleColumn.cellType) && dispatch(updateSheetSelectionFromCellClick(newSheet.id, sheetFirstCell.id, false))
	}
}