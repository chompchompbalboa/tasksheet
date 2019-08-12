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
}
export type SheetActiveUpdates = {
  columnRenamingId?: SheetColumn['id']
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
}
export interface SheetCellUpdates {
	value?: string
}

export type SheetSort = {
  id: string
  sheetId: string
  columnId: string
  order: SheetSortOrder
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
}
export type SheetFilterUpdates = {}
export type SheetFilterType = '=' | '>' | '>=' | '<' | '<='

export type SheetGroup = {
  id: string
  sheetId: string
  columnId: string
  order: SheetGroupOrder
}
export type SheetGroupUpdates = {
  order?: SheetGroupOrder
}

export type SheetGroupOrder = 'ASC' | 'DESC'

export type SheetView = {
  id: string
  sourceSheetId: string
  filters: SheetFilters
  groups: SheetGroups
  sorts: SheetSorts
}
