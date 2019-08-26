import { FileType } from '@app/state/folder/types'

export type Sheets = { [sheetId: string]: Sheet }
export type SheetColumns = { [columnId: string]: SheetColumn }
export type SheetRows = { [rowId: string]: SheetRow }
export type SheetCells = { [cellId: string]: SheetCell }
export type SheetFilters = { [filterId: string]: SheetFilter }
export type SheetGroups = { [groupId: string]: SheetGroup }
export type SheetSorts = { [sortId: string]: SheetSort }

export type SheetActive = {
  columnRenamingId: SheetColumn['id']
  selections: { [cellId: string]: SheetCellSelectionType }
}
export type SheetActiveUpdates = {
  columnRenamingId?: SheetColumn['id']
  selections?: { [cellId: string]: SheetCellSelectionType }
}

export type Sheet = {
  id: string
  sourceSheetId: Sheet['id']
  fileType: FileType
	rows: SheetRow['id'][]
  visibleRows: SheetRow['id'][]
  columns: SheetColumn['id'][]
  visibleColumns: SheetColumn['id'][]
  filters: SheetFilter['id'][]
  groups: SheetGroup['id'][]
  sorts: SheetSort['id'][]
}
export type SheetUpdates = {
  rows?: SheetRow['id'][]
  visibleRows?: SheetRow['id'][]
  columns?: SheetColumn['id'][]
  visibleColumns?: SheetColumn['id'][]
  filters?: SheetFilter['id'][]
  groups?: SheetGroup['id'][]
  sorts?: SheetSort['id'][]
}

export type SheetFromServer = {
  id: string
  sourceSheetId: string
  fileType: FileType
  columns: SheetColumn[]
  visibleColumns: SheetColumn['id'][]
  filters: SheetFilter[]
  groups: SheetGroup[]
  rows: SheetFromServerRow[]
  sorts: SheetSort[]
}
export type SheetFromServerRow = {
	id: string
	sheetId: string
	cells: SheetCell[]
}

export type SheetColumn = {
	id: string
	sheetId: string
	name: string
	width: number
	type: SheetColumnType
}
export type SheetColumnUpdates = {
  name?: string
  width?: number
  type?: SheetColumnType
}
export type SheetColumnToServer = {
  id: string
  sheetId: string
  name: string
  width: number
  type: SheetColumnType
  cells: SheetCell[]
}
export type SheetColumnType = 
	'STRING'|
	'DATETIME'|
	'BOOLEAN'|
	'NUMBER'

export type SheetRow = {
	id: string
	sheetId: string
	cells: { [columnId: string]: SheetCell['id'] }
}
export type SheetRowUpdates = {
  cells?: { [columnId: string]: SheetCell['id'] }
}
export type SheetRowToServer = {
  id: string
  sheetId: string
  cells: SheetCell[]
}

export type SheetCell = {
	id: string
	sheetId: string
	columnId: string
	rowId: string
	value: string
  selectionType: SheetCellSelectionType
}
export interface SheetCellUpdates {
  selectionType?: SheetCellSelectionType
	value?: string
}
export type SheetCellSelectionType = 
  'CELL' | 
  'ROW_FIRST' | 'ROW_MIDDLE' | 'ROW_LAST' |
  'COLUMN_FIRST' | 'COLUMN_MIDDLE' | 'COLUMN_LAST'

export type SheetSort = {
  id: string
  sheetId: string
  columnId: string
  order: SheetSortOrder
  isLocked: boolean
}
export type SheetSortUpdates = {
  order?: SheetSortOrder
}
export type SheetSortOrder = 'ASC' | 'DESC'

export type SheetFilter = {
  id: string
  sheetId: string
  columnId: string
  type: SheetFilterType
  value: string
  isLocked: boolean
}
export type SheetFilterUpdates = {}
export type SheetFilterType = '=' | '!=' | '>' | '>=' | '<' | '<='

export type SheetGroup = {
  id: string
  sheetId: string
  columnId: string
  order: SheetGroupOrder
  isLocked: boolean
}
export type SheetGroupUpdates = {
  order?: SheetGroupOrder
}

export type SheetGroupOrder = 'ASC' | 'DESC'

export type SheetView = {
  id: string
  sourceSheetId: string
  visibleColumns: SheetColumn['id'][]
  filters: SheetFilters
  groups: SheetGroups
  sorts: SheetSorts
}
