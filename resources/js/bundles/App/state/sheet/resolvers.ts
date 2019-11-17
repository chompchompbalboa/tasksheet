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
  
  const rowIds: string[] = sheet.rows

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

  const activeSheetView = views[sheet.activeSheetViewId]

  const filterIds: string[] = activeSheetView.filters
  const groupIds: string[] = activeSheetView.groups
  const sortIds: string[] = activeSheetView.sorts
  
  if(filterIds.length === 0 && groupIds.length === 0 && sortIds.length === 0) {
    return rowIds
  }

  // Filter
  const filteredRowIds: string[] = !filters ? rowIds : rowIds.map(rowId => {
    const row = rows[rowId]
    return filterIds.every(filterId => {
      const filter = filters[filterId]
      const cell = cells[row.cells[filter.columnId]]
      return resolveSheetFilter(cell.value, filter.value, filter.type)
    }) ? row.id : undefined
  }).filter(Boolean)

  // Sort
  const sortByValue = sortIds && sortIds.map(sortId => {
    const sort = sorts[sortId]
    return (rowId: string) => {
      const cell = cells[rows[rowId].cells[sort.columnId]]
      const cellPriorityOrder = sheet.cellPriorities[cell.id] ? priorities[sheet.cellPriorities[cell.id].priorityId].order : sheetCellPrioritiesLength + 1
      return cellPriorityOrder + '-' + resolveSheetCellValue(cell.value)
    }
  })
  const sortOrder = sortIds && sortIds.map(sortId => sorts[sortId].order === 'ASC' ? 'asc' : 'desc')
  const filteredSortedRowIds = orderBy(filteredRowIds, sortByValue, sortOrder)
  
  // Group
  if(groupIds.length === 0) {
    return filteredSortedRowIds
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
      const prioritizedGroup = group.sort((firstRowId: string, secondRowId: string) => {
        const firstRowPriority = rowIdsWithPriority.has(firstRowId)
          ? rowIdPriorities[firstRowId]
          : sheetCellPrioritiesLength + 1
        const secondRowPriority = rowIdsWithPriority.has(secondRowId)
          ? rowIdPriorities[secondRowId]
          : sheetCellPrioritiesLength + 1
        return firstRowPriority > secondRowPriority ? 0 : -1
      })
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