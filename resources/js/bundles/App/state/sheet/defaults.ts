//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import moment from 'moment'
import { v4 as createUuid } from 'uuid'

import { 
  ISheet,
  ISheetCell, 
  ISheetColumn, 
  ISheetRow, 
  ISheetRowLeader,
  ISheetFilter,
  ISheetGroup,
  ISheetSort,
  ISheetSelections,
  ISheetStyles,
  ISheetView
} from '@app/state/sheet/types'

//-----------------------------------------------------------------------------
// Default Row
//-----------------------------------------------------------------------------
export const defaultRow = (sheetId: string, rowId: ISheetRow['id'], columns: ISheetColumn['id'][]): ISheetRow => {
  const newCells: { [columnId: string ]: ISheetCell['id'] } = {}
  columns.forEach(columnId => { newCells[columnId] = createUuid() })
  return {
    id: rowId,
    sheetId: sheetId,
    createdAt: moment(),
    cells: newCells
  }
}

//-----------------------------------------------------------------------------
// Default Cell
//-----------------------------------------------------------------------------
export const defaultCell = (sheetId: string, rowId: ISheetRow['id'], columnId: string, cellId: string): ISheetCell => {
  return {
    id: cellId,
    sheetId: sheetId, 
    columnId: columnId,
    rowId: rowId,
    value: "",
    isCellEditing: false,
    isCellSelectedSheetIds: new Set() as Set<string>
  }
}

//-----------------------------------------------------------------------------
// Default Cell
//-----------------------------------------------------------------------------
export const defaultColumn = (sheetId: string, newColumnIndex?: number): ISheetColumn => {

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

//-----------------------------------------------------------------------------
// Default Sheet Selections
//-----------------------------------------------------------------------------
export const defaultSheetSelections: ISheetSelections = {
  isOneEntireColumnSelected: false,
  isOneEntireRowSelected: false,
  isSelectedCellEditingPrevented: false,
  isSelectedCellNavigationPrevented: false,
  rangeCellIds: new Set() as Set<ISheetCell['id']>,
  rangeStartColumnId: null,
  rangeStartRowId: null,
  rangeStartCellId: null,
  rangeEndColumnId: null,
  rangeEndRowId: null,
  rangeEndCellId: null,
}

//-----------------------------------------------------------------------------
// Default Sheet Styles
//-----------------------------------------------------------------------------
export const defaultSheetStyles: ISheetStyles = {
  id: createUuid(),
  backgroundColor: new Set as Set<string>,
  backgroundColorReference: {},
  color: new Set as Set<string>,
  colorReference: {},
  bold: new Set as Set<string>,
  italic: new Set as Set<string>
}

//-----------------------------------------------------------------------------
// Default Sheet View
//-----------------------------------------------------------------------------
export const defaultSheetView = (sheetId: ISheet['id']): ISheetView => {
  return {
    id: createUuid(),
    sheetId: sheetId,
    name: null,
    visibleColumns: [] as ISheetColumn['id'][],
    visibleRows: [] as ISheetRow['id'][],
    visibleRowLeaders: [] as ISheetRowLeader[],
    filters: [] as ISheetFilter['id'][],
    groups: [] as ISheetGroup['id'][],
    sorts: [] as ISheetSort['id'][]
  }
}