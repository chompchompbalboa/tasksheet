//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { v4 as createUuid } from 'uuid'

import { SheetCell, SheetColumns, SheetRow } from '@app/state/sheet/types'

//-----------------------------------------------------------------------------
// Default Row
//-----------------------------------------------------------------------------
export const defaultRow = (sheetId: string, rowId: string, columns: SheetColumns): SheetRow => {
  return {
    id: rowId,
    sheetId: sheetId,
    cells: Object.keys(columns).map(columnId => defaultCell(sheetId, rowId, columnId).id)
  }
}

//-----------------------------------------------------------------------------
// Default Cell
//-----------------------------------------------------------------------------
export const defaultCell = (sheetId: string, rowId: string, columnId: string): SheetCell => {
  return {
    id: createUuid(),
    sheetId: sheetId, 
    columnId: columnId,
    rowId: rowId,
    value: ""
  }
}