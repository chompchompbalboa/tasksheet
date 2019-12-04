//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { groupBy, orderBy } from 'lodash'

import { 
  ISheet,
  IAllSheetCells,
  IAllSheetRows, ISheetRow,
  IAllSheetFilters, ISheetFilterType,
  ISheetGroup, IAllSheetGroups, 
  IAllSheetSorts, 
  IAllSheetViews,
  IAllSheetPriorities
} from '@app/state/sheet/types'

//-----------------------------------------------------------------------------
// Resolve Filter
//-----------------------------------------------------------------------------
export const resolveSheetFilter = (cellValue: string, filterValue: string, type: ISheetFilterType) => {
  
  const filterValues = filterValue.split('|').map(untrimmedFilterValue => untrimmedFilterValue.trim())
  
  switch (type) {
    case '=': {
      return filterValues.some(currentFilterValue => resolveSheetCellValue(cellValue) == resolveSheetCellValue(currentFilterValue))
    }
    case '!=': {
      return filterValues.every(currentFilterValue => resolveSheetCellValue(cellValue) != resolveSheetCellValue(currentFilterValue))
    }
    case '>': {
      return filterValues.some(currentFilterValue => resolveSheetCellValue(cellValue) > resolveSheetCellValue(currentFilterValue))
    }
    case '>=': {
      return filterValues.some(currentFilterValue => resolveSheetCellValue(cellValue) >= resolveSheetCellValue(currentFilterValue))
    }
    case '<': {
      return filterValues.some(currentFilterValue => resolveSheetCellValue(cellValue) < resolveSheetCellValue(currentFilterValue))
    }
    case '<=': {
      return filterValues.some(currentFilterValue => resolveSheetCellValue(cellValue) <= resolveSheetCellValue(currentFilterValue))
    }
  }
}

//-----------------------------------------------------------------------------
// Resolve Value
//-----------------------------------------------------------------------------
export const resolveSheetCellValue = (value: string) => {
  const filteredValue = value !== null ? value.replace(new RegExp('%', 'g'), '').replace(new RegExp('/', 'g'), '') : ""
  return isNaN(Number(filteredValue)) ? filteredValue : Number(filteredValue)
}

//-----------------------------------------------------------------------------
// Resolve Visible Rows
//-----------------------------------------------------------------------------
export const resolveSheetVisibleRows = (
  sheet: ISheet, 
  rows: IAllSheetRows, 
  cells: IAllSheetCells, 
  filters: IAllSheetFilters, 
  groups: IAllSheetGroups, 
  sorts: IAllSheetSorts,
  views: IAllSheetViews,
  priorities: IAllSheetPriorities
) => {
  
  // Row Ids
  const rowIds: string[] = sheet.rows

  // Active sheet view
  const activeSheetView = views[sheet.activeSheetViewId]
  const filterIds: string[] = activeSheetView.filters
  const groupIds: string[] = activeSheetView.groups
  const sortIds: string[] = activeSheetView.sorts

  // Priorities
  const sheetCellPrioritiesLength = Object.keys(sheet.cellPriorities).length
  const rowIdsWithPriority = new Set()
  const rowIdPriorities: { [sheetRowId: string]: number } = {}
  Object.keys(sheet.cellPriorities).forEach(sheetCellId => {
    const sheetCell = cells[sheetCellId]
    const sheetCellPriority = sheet.cellPriorities[sheetCellId]
    const sheetPriority = priorities[sheetCellPriority.priorityId]
    rowIdsWithPriority.add(sheetCell.rowId)
    rowIdPriorities[sheetCell.rowId] = sheetPriority.order
  })
  const sortByPriority = (firstRowId: string, secondRowId: string) => {
    const firstRowHasPriority = rowIdsWithPriority.has(firstRowId)
    const secondRowHasPriority = rowIdsWithPriority.has(secondRowId)
    const firstRowPriority = firstRowHasPriority
      ? rowIdPriorities[firstRowId]
      : sheetCellPrioritiesLength + 100
    const secondRowPriority = secondRowHasPriority
      ? rowIdPriorities[secondRowId]
      : sheetCellPrioritiesLength + 100
    return (firstRowHasPriority || secondRowHasPriority)
      ? firstRowPriority > secondRowPriority 
        ? 0 
        : -1
      : -2
  }
  
  // Bail out if there aren't any filters, groups or sorts
  if(filterIds.length === 0 && groupIds.length === 0 && sortIds.length === 0) {
    return rowIds.sort(sortByPriority)
  }

  // Filter
  const filteredRowIds: string[] = !filters ? rowIds : rowIds.map(rowId => {
    const row = rows[rowId]
    return filterIds.every(filterId => {
      const filter = filters[filterId]
      if(filter) {
        const cell = cells[row.cells[filter.columnId]]
        if(cell) {
          return resolveSheetFilter(cell.value, filter.value, filter.type)
        }
        return true
      }
      return true
    }) ? row.id : undefined
  }).filter(Boolean)


  // Sort
  const sortByValue = sortIds && sortIds.map(sortId => {
    const sort = sorts[sortId]
    return (rowId: string) => {
      const cell = cells[rows[rowId].cells[sort.columnId]]
      return resolveSheetCellValue(cell.value)
    }
  })
  const sortOrder = sortIds && sortIds.map(sortId => sorts[sortId].order === 'ASC' ? 'asc' : 'desc')
  const filteredSortedRowIds = orderBy(filteredRowIds, sortByValue, sortOrder)

  
  // Group
  if(groupIds.length === 0) {
    return filteredSortedRowIds.sort(sortByPriority)
  }
  else {
    const groupedRowIds = groupBy(filteredSortedRowIds, (rowId: string) => {
      const getValue = (group: ISheetGroup) => {
        const cell = rows[rowId] && cells[rows[rowId].cells[group.columnId]]
        return cell && cell.value
      }
      return groupIds.map(groupId => getValue(groups[groupId])).reduce((combined: string, current: string) => combined + (current ? current.toLowerCase() : '') + '-')
    })
    const filteredSortedGroupedRowIds: string[] = []
    const orderedGroups = groups[groupIds[0]].order === 'ASC' ? Object.keys(groupedRowIds).sort() : Object.keys(groupedRowIds).sort().reverse()
    orderedGroups.forEach(groupValue => {
      const group = groupedRowIds[groupValue]
      const prioritizedGroup = group.sort(sortByPriority)
      filteredSortedGroupedRowIds.push(...prioritizedGroup)
      filteredSortedGroupedRowIds.push('ROW_BREAK')
    })

    return filteredSortedGroupedRowIds
  }
}

//-----------------------------------------------------------------------------
// Resolve Row Leaders
//-----------------------------------------------------------------------------
export const resolveSheetRowLeaders = (visibleRows: ISheetRow['id'][]) => {
  let currentCount = 1
  return visibleRows && visibleRows.map(visibleRowId => {
    if(visibleRowId === 'ROW_BREAK') {
      currentCount = 1
      return
    }
    else {
      return currentCount++
    }
  })
}