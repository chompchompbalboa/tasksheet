//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { groupBy, orderBy } from 'lodash'

import { 
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
export const resolveVisibleRows = (rows: SheetRows, filters?: SheetFilters, groups?: SheetGroups, sorts?: SheetSorts) => {
  const rowIds: string[] = Object.keys(rows)

  // Filter
  const filteredRowIds: string[] = !filters ? rowIds : rowIds.map(rowId => {
    const row = rows[rowId]
    let passesFilter = true
    filters.forEach(filter => {
      const cellValue = row.cells.find(cell => cell.columnId === filter.columnId).value
      if(!resolveFilter(cellValue, filter.value, filter.type)) { passesFilter = false }
    })
    return passesFilter ? rowId : undefined
  }).filter(Boolean)

  // Sort
  const sortBy = sorts && sorts.map(sort => {
    return (rowId: string) => {
      const value = rows[rowId].cells.find(cell => cell.columnId === sort.columnId).value
      return resolveValue(value)
    }
  })
  const sortOrder = sorts && sorts.map(sort => sort.order === 'ASC' ? 'asc' : 'desc')
  const filteredSortedRowIds = orderBy(filteredRowIds, sortBy, sortOrder)
  
  // Group
  if(groups.length === 0) {
    return filteredSortedRowIds
  }
  else {
    const groupedRowIds = groupBy(filteredSortedRowIds, (rowId: string) => {
      const getValue = (group: SheetGroup) => {
        const cell = rows[rowId] && rows[rowId].cells.find(cell => cell.columnId === group.columnId)
        return cell && cell.value
      }
      return groups.map(group => getValue(group)).reduce((combined: string, current: string) => combined + current.toLowerCase() + '-')
    })
    const filteredSortedGroupedRowIds: string[] = []
    const orderedGroups = groups[0].order === 'ASC' ? Object.keys(groupedRowIds).sort() : Object.keys(groupedRowIds).sort().reverse()
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