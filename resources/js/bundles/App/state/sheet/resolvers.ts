//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { groupBy, orderBy } from 'lodash'

import {
  ISheetState
} from '@app/state/sheet/reducers'
import { 
  ISheet,
  ISheetFilterType,
  ISheetGroup,
} from '@app/state/sheet/types'

//-----------------------------------------------------------------------------
// Resolve Filter
//-----------------------------------------------------------------------------
export const resolveFilter = (cellValue: string, filterValue: string, type: ISheetFilterType) => {
  
  const filterValues = filterValue.split('|').map(untrimmedFilterValue => untrimmedFilterValue.trim())
  
  switch (type) {
    case '=': {
      return filterValues.some(currentFilterValue => resolveValue(cellValue) == resolveValue(currentFilterValue))
    }
    case '!=': {
      return filterValues.every(currentFilterValue => resolveValue(cellValue) != resolveValue(currentFilterValue))
    }
    case '>': {
      return filterValues.some(currentFilterValue => resolveValue(cellValue) > resolveValue(currentFilterValue))
    }
    case '>=': {
      return filterValues.some(currentFilterValue => resolveValue(cellValue) >= resolveValue(currentFilterValue))
    }
    case '<': {
      return filterValues.some(currentFilterValue => resolveValue(cellValue) < resolveValue(currentFilterValue))
    }
    case '<=': {
      return filterValues.some(currentFilterValue => resolveValue(cellValue) <= resolveValue(currentFilterValue))
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
export const resolveVisibleRows = (sheet: ISheet, sheetState: ISheetState) => {
  const {
    allSheetRows,
    allSheetCells,
    allSheetFilters,
    allSheetGroups,
    allSheetSorts
  } = sheetState
  const rowIds: string[] = sheet.rows
  const filterIds: string[] = sheet.filters
  const groupIds: string[] = sheet.groups
  const sortIds: string[] = sheet.sorts

  // Filter
  const filteredRowIds: string[] = !allSheetFilters ? rowIds : rowIds.map(rowId => {
    const row = allSheetRows[rowId]
    return filterIds.every(filterId => {
      const filter = allSheetFilters[filterId]
      const cell = allSheetCells[row.cells[filter.columnId]]
      return resolveFilter(cell.value, filter.value, filter.type)
    }) ? row.id : undefined
  }).filter(Boolean)

  // Sort
  const sortBy = sortIds && sortIds.map(sortId => {
    const sort = allSheetSorts[sortId]
    return (rowId: string) => {
      const cell = allSheetCells[allSheetRows[rowId].cells[sort.columnId]]
      return resolveValue(cell.value)
    }
  })
  const sortOrder = sortIds && sortIds.map(sortId => allSheetSorts[sortId].order === 'ASC' ? 'asc' : 'desc')
  const filteredSortedRowIds = orderBy(filteredRowIds, sortBy, sortOrder)
  
  // Group
  if(groupIds.length === 0) {
    return filteredSortedRowIds
  }
  else {
    const groupedRowIds = groupBy(filteredSortedRowIds, (rowId: string) => {
      const getValue = (group: ISheetGroup) => {
        const cell = allSheetRows[rowId] && allSheetCells[allSheetRows[rowId].cells[group.columnId]]
        return cell && cell.value
      }
      return groupIds.map(groupId => getValue(allSheetGroups[groupId])).reduce((combined: string, current: string) => combined + (current ? current.toLowerCase() : '') + '-')
    })
    const filteredSortedGroupedRowIds: string[] = []
    const orderedGroups = allSheetGroups[groupIds[0]].order === 'ASC' ? Object.keys(groupedRowIds).sort() : Object.keys(groupedRowIds).sort().reverse()
    orderedGroups.forEach(groupName => {
      const group = groupedRowIds[groupName]
      filteredSortedGroupedRowIds.push(...group)
      filteredSortedGroupedRowIds.push('ROW_BREAK')
    })
    return filteredSortedGroupedRowIds
  }
}