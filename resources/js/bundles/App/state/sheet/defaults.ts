//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { v4 as createUuid } from 'uuid'

import { SheetCell, SheetColumn, SheetRow } from '@app/state/sheet/types'

//-----------------------------------------------------------------------------
// Default Row
//-----------------------------------------------------------------------------
export const defaultRow = (sheetId: string, rowId: string, columns: SheetColumn['id'][]): SheetRow => {
  const newCells: { [columnId: string ]: SheetCell['id'] } = {}
  columns.forEach(columnId => { newCells[columnId] = createUuid() })
  return {
    id: rowId,
    sheetId: sheetId,
    cells: newCells
  }
}

//-----------------------------------------------------------------------------
// Default Cell
//-----------------------------------------------------------------------------
export const defaultCell = (sheetId: string, rowId: string, columnId: string, cellId: string): SheetCell => {
  return {
    id: cellId,
    sheetId: sheetId, 
    columnId: columnId,
    rowId: rowId,
    value: ""
  }
}