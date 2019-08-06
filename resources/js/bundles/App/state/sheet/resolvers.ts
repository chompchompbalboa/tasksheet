//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { groupBy, orderBy } from 'lodash'

import { 
  Sheet,
  SheetColumns,
  SheetRows,
  SheetFilters, SheetFilterType,
  SheetGroup, SheetGroups, 
  SheetSorts, 
} from '@app/state/sheet/types'

//-----------------------------------------------------------------------------
// Resolve Filter
//-----------------------------------------------------------------------------
export const resolveFilter = (cellValue: string, filterValue: string, type: SheetFilterType) => {
  switch (type) {
    case '=': {
      return resolveValue(cellValue) === resolveValue(filterValue)
    }
    case '>': {
      return resolveValue(cellValue) > resolveValue(filterValue)
    }
    case '>=': {
      return resolveValue(cellValue) >= resolveValue(filterValue)
    }
    case '<': {
      return resolveValue(cellValue) < resolveValue(filterValue)
    }
    case '<=': {
      return resolveValue(cellValue) <= resolveValue(filterValue)
    }
  }
}

//-----------------------------------------------------------------------------
// Resolve Value
//-----------------------------------------------------------------------------
export const resolveValue = (value: string) => {
  const filteredValue = value !== null ? value.replace('%', '') : ""
  return isNaN(Number(filteredValue)) ? filteredValue : Number(filteredValue)
}

//-----------------------------------------------------------------------------
// Resolve Visible Rows
//-----------------------------------------------------------------------------
export const resolveVisibleRows = (sheet: Sheet, rows: SheetRows, filters: SheetFilters, groups: SheetGroups, sorts: SheetSorts) => {
  const rowIds: string[] = sheet.rows
  const filterIds: string[] = sheet.filters
  const groupIds: string[] = sheet.groups
  const sortIds: string[] = sheet.sorts

  // Filter
  const filteredRowIds: string[] = !filters ? rowIds : rowIds.map(rowId => {
    const row = rows[rowId]
    let passesFilter = true
    filterIds.forEach(filterId => {
      const filter = filters[filterId]
      const cellValue = row.cells.find(cell => cell.columnId === filter.columnId).value
      if(!resolveFilter(cellValue, filter.value, filter.type)) { passesFilter = false }
    })
    return passesFilter ? row.id : undefined
  }).filter(Boolean)

  // Sort
  const sortBy = sortIds && sortIds.map(sortId => {
    const sort = sorts[sortId]
    return (rowId: string) => {
      const value = rows[rowId].cells.find(cell => cell.columnId === sort.columnId).value
      return resolveValue(value)
    }
  })
  const sortOrder = sortIds && sortIds.map(sortId => sorts[sortId].order === 'ASC' ? 'asc' : 'desc')
  const filteredSortedRowIds = orderBy(filteredRowIds, sortBy, sortOrder)
  
  // Group
  if(groupIds.length === 0) {
    return filteredSortedRowIds
  }
  else {
    const groupedRowIds = groupBy(filteredSortedRowIds, (rowId: string) => {
      const getValue = (group: SheetGroup) => {
        const cell = rows[rowId] && rows[rowId].cells.find(cell => cell.columnId === group.columnId)
        return cell && cell.value
      }
      return groupIds.map(groupId => getValue(groups[groupId])).reduce((combined: string, current: string) => combined + current.toLowerCase() + '-')
    })
    const filteredSortedGroupedRowIds: string[] = []
    const orderedGroups = 'ASC' === 'ASC' ? Object.keys(groupedRowIds).sort() : Object.keys(groupedRowIds).sort().reverse()
    orderedGroups.forEach(groupName => {
      const group = groupedRowIds[groupName]
      filteredSortedGroupedRowIds.push('GROUP_HEADER')
      filteredSortedGroupedRowIds.push(...group)
    })
    return filteredSortedGroupedRowIds
  }
}

//-----------------------------------------------------------------------------
// Resolve Visible Columns
//-----------------------------------------------------------------------------
export const resolveVisibleColumns = (columns: SheetColumns) => {
  return orderBy(Object.keys(columns), (columnId: string) => columns[columnId].position)
}