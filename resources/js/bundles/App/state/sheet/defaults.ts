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
    value: "",
    isCellEditing: false,
    isCellEditingSheetId: null,
    isCellSelected: false,
    isRangeStart: false,
    isRangeEnd: false,
    isRangeRenderedFromOtherEnd: false,
    rangeWidth: null,
    rangeHeight: null,
    style: {}
  }
}

//-----------------------------------------------------------------------------
// Default Cell
//-----------------------------------------------------------------------------
export const defaultColumn = (sheetId: string, newColumnIndex?: number): SheetColumn => {

  const alphabetString = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

  const columnName = [
    newColumnIndex < 26 ? alphabetString.split('')[newColumnIndex] : 'A',
    newColumnIndex >= 26 ? alphabetString.split('')[newColumnIndex % 26] : '',
    newColumnIndex >= 52 ? alphabetString.split('')[newColumnIndex % 52] : '',
    newColumnIndex >= 78 ? alphabetString.split('')[newColumnIndex % 78] : '',
    newColumnIndex >= 104 ? alphabetString.split('')[newColumnIndex % 104] : ''
  ].join('')

  return {
    id: createUuid(),
    sheetId: sheetId, 
    name: columnName,
    typeId: 'STRING',
    width: 100
  }
}