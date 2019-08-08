//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { groupBy, orderBy } from 'lodash'

import { 
  Sheet,
  SheetCells,
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
export const resolveVisibleRows = (sheet: Sheet, rows: SheetRows, cells: SheetCells, filters: SheetFilters, groups: SheetGroups, sorts: SheetSorts) => {
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
      const cell = cells[row.cells[filter.columnId]]
      if(!resolveFilter(cell.value, filter.value, filter.type)) { passesFilter = false }
    })
    return passesFilter ? row.id : undefined
  }).filter(Boolean)

  // Sort
  const sortBy = sortIds && sortIds.map(sortId => {
    const sort = sorts[sortId]
    return (rowId: string) => {
      const cell = cells[rows[rowId].cells[sort.columnId]]
      return resolveValue(cell.value)
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
        const cell = rows[rowId] && cells[rows[rowId].cells[group.columnId]]
        return cell && cell.value
      }
      return groupIds.map(groupId => getValue(groups[groupId])).reduce((combined: string, current: string) => combined + current.toLowerCase() + '-')
    })
    const filteredSortedGroupedRowIds: string[] = []
    const orderedGroups = groups[groupIds[0]].order === 'ASC' ? Object.keys(groupedRowIds).sort() : Object.keys(groupedRowIds).sort().reverse()
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