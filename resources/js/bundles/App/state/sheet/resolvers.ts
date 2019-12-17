//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { groupBy, orderBy } from 'lodash'

import { 
  ISheet,
  IAllSheetColumns, ISheetColumn, 
  IAllSheetRows, ISheetRow,
  IAllSheetCells, ISheetCell, ISheetCellType,
  IAllSheetFilters, ISheetFilter,
  IAllSheetGroups, ISheetGroup,
  IAllSheetSorts, 
  IAllSheetViews,
  IAllSheetPriorities
} from '@app/state/sheet/types'

//-----------------------------------------------------------------------------
// Resolve Filter
//-----------------------------------------------------------------------------
export const resolveSheetFilter = (cell: ISheetCell, column: ISheetColumn, filter: ISheetFilter) => {
  
  const cellValue = cell.value
  const cellType = column.cellType
  const filterValue = filter.value
  const filterType = filter.type
  
  const filterValues = filterValue.split('|').map(untrimmedFilterValue => untrimmedFilterValue.trim())
  
  switch (filterType) {
    case '=': {
      return filterValues.some(currentFilterValue => resolveSheetCellValue(cellValue, cellType) == resolveSheetCellValue(currentFilterValue, cellType))
    }
    case '!=': {
      return filterValues.every(currentFilterValue => resolveSheetCellValue(cellValue, cellType) != resolveSheetCellValue(currentFilterValue, cellType))
    }
    case '>': {
      return filterValues.some(currentFilterValue => resolveSheetCellValue(cellValue, cellType) > resolveSheetCellValue(currentFilterValue, cellType))
    }
    case '>=': {
      return filterValues.some(currentFilterValue => resolveSheetCellValue(cellValue, cellType) >= resolveSheetCellValue(currentFilterValue, cellType))
    }
    case '<': {
      return filterValues.some(currentFilterValue => resolveSheetCellValue(cellValue, cellType) < resolveSheetCellValue(currentFilterValue, cellType))
    }
    case '<=': {
      return filterValues.some(currentFilterValue => resolveSheetCellValue(cellValue, cellType) <= resolveSheetCellValue(currentFilterValue, cellType))
    }
  }
}

//-----------------------------------------------------------------------------
// Resolve Value
//-----------------------------------------------------------------------------
export const resolveSheetCellValue = (value: string, cellType: ISheetCellType) => {
  const cellValueResolvers = {
    STRING: () => value ? value.toLowerCase() : '',
    DATETIME: () => value ? new Date(value) : '',
    BOOLEAN: () => value === 'Checked',
    NUMBER: () => value && !isNaN(Number(value)) ? Number(value) : Number.MIN_SAFE_INTEGER,
    PHOTOS: () => value ? Number(value) : 0,
    FILES: () => value ? Number(value) : 0,
    TEAM_MEMBERS: () => value ? value.toLowerCase() : '',
  }
  return cellValueResolvers[cellType]()
}

//-----------------------------------------------------------------------------
// Resolve Visible Rows
//-----------------------------------------------------------------------------
export const resolveSheetVisibleRows = (
  sheet: ISheet,
  allSheetColumns: IAllSheetColumns,
  allSheetRows: IAllSheetRows, 
  allSheetCells: IAllSheetCells, 
  allSheetFilters: IAllSheetFilters, 
  allSheetGroups: IAllSheetGroups, 
  allSheetSorts: IAllSheetSorts,
  allSheetViews: IAllSheetViews,
  allSheetPriorities: IAllSheetPriorities
) => {
  
  // Row Ids
  const rowIds: string[] = sheet.rows

  // Active sheet view
  const activeSheetView = allSheetViews[sheet.activeSheetViewId]
  const filterIds: string[] = activeSheetView.filters
  const groupIds: string[] = activeSheetView.groups
  const sortIds: string[] = activeSheetView.sorts

  // Priorities
  const sheetCellPrioritiesLength = Object.keys(sheet.cellPriorities).length
  const rowIdsWithPriority = new Set()
  const rowIdPriorities: { [sheetRowId: string]: number } = {}
  Object.keys(sheet.cellPriorities).forEach(sheetCellId => {
    const sheetCell = allSheetCells[sheetCellId]
    const sheetCellPriority = sheet.cellPriorities[sheetCellId]
    const sheetPriority = allSheetPriorities[sheetCellPriority.priorityId]
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
  const filteredRowIds: string[] = !allSheetFilters ? rowIds : rowIds.map(rowId => {
    const row = allSheetRows[rowId]
    return filterIds.every(filterId => {
      const filter = allSheetFilters[filterId]
      if(filter) {
        const cell = allSheetCells[row.cells[filter.columnId]]
        const column = allSheetColumns[filter.columnId]
        if(cell) {
          return resolveSheetFilter(cell, column, filter)
        }
        return true
      }
      return true
    }) ? row.id : undefined
  }).filter(Boolean)


  // Sort
  const sortByValue = sortIds && sortIds.map(sortId => {
    const sort = allSheetSorts[sortId]
    return (rowId: string) => {
      const cell = allSheetCells[allSheetRows[rowId].cells[sort.columnId]]
      const column = allSheetColumns[sort.columnId]
      if(cell) {
        return resolveSheetCellValue(cell.value, column.cellType)
      }
      return ''
    }
  })
  const sortOrder = sortIds && sortIds.map(sortId => allSheetSorts[sortId].order === 'ASC' ? 'asc' : 'desc')
  const filteredSortedRowIds = orderBy(filteredRowIds, sortByValue, sortOrder)

  
  // Group
  if(groupIds.length === 0) {
    return filteredSortedRowIds.sort(sortByPriority)
  }
  else {
    // Get the groups
    const groupedRowIds = groupBy(filteredSortedRowIds, (rowId: string) => {
      const getValue = (group: ISheetGroup) => {
        const cell = allSheetRows[rowId] && allSheetCells[allSheetRows[rowId].cells[group.columnId]]
        const column = allSheetColumns[group.columnId]
        if(cell) {
          return resolveSheetCellValue(cell.value, column.cellType)
        }
        return ''
      }
      return groupIds.map(groupId => getValue(allSheetGroups[groupId]))
                     .reduce((combined: string, current: string) => combined + (current ? ('&&**&&**&&' + current).toLowerCase() : ''))
    })
    // Sort the group keys into the correct order
    const groupKeys = Object.keys(groupedRowIds)
    const groupKeysArray = groupKeys.map(groupKey => {
      return groupKey.split('&&**&&**&&')
    })
    const sortGroupKeysArray = groupIds.map((groupId, index) => {
      const group = allSheetGroups[groupId]
      const column = allSheetColumns[group.columnId]
      return (groupKeyArray: string[]) => {
        const currentKey = groupKeyArray[index]
        return resolveSheetCellValue(currentKey, column.cellType)
      }
    })
    const groupOrdersArray = groupIds.map(groupId => {
      const group = allSheetGroups[groupId]
      return group.order === 'ASC' ? 'asc' : 'desc'
    })
    const orderedGroupKeysArray = orderBy(groupKeysArray, sortGroupKeysArray, groupOrdersArray)
    // Use the sorted group keys to populate the return value with the rowIds
    const filteredSortedGroupedRowIds: string[] = []
    orderedGroupKeysArray.forEach(groupKeysArray => {
      const groupKey = groupKeysArray.join('&&**&&**&&')
      const group = groupedRowIds[groupKey]
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