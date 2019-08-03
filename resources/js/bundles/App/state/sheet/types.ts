import { FileType } from '@app/state/folder/types'

export type Sheets = { [key: string]: Sheet }
export type SheetColumns = { [key: string]: SheetColumn }
export type SheetVisibleColumns = string[]
export type SheetRows = { [key: string]: SheetRow }
export type SheetVisibleRows = string[]
export type SheetFilters = SheetFilter[]
export type SheetGroups = SheetGroup[]
export type SheetSorts = SheetSort[]

export type Sheet = {
  id: string
  sourceSheetId: string
	rows: { [key: string]: SheetRow }
  visibleRows: SheetVisibleRows
  columns: SheetColumns
  visibleColumns: SheetVisibleColumns
  filters: SheetFilters
  fileType: FileType
  groups: SheetGroups
  sorts: SheetSorts
}
export type SheetUpdates = {
  groups?: SheetGroups
  filters?: SheetFilters
  sorts?: SheetSorts
  rows?: SheetRows
  visibleRows?: SheetVisibleRows
}

export type SheetFromServer = {
  id: string
  sourceSheetId: string
  fileType: FileType
  rows: SheetRow[]
  columns: SheetColumn[]
  filters: SheetFilters
  groups: SheetGroups
  sorts: SheetSorts
}

export type SheetColumn = {
	id: string
	sheetId: string
	name: string
	position: number
	width: number
	type: SheetColumnType
}

export type SheetColumnType = 
	'STRING'|
	'DATETIME'|
	'BOOLEAN'|
	'NUMBER'

export type SheetRow = {
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
  sheetId?: string
  sheetViewId?: string
  columnId: string
  order: SheetSortOrder
}
export type SheetSortUpdates = {
  order?: SheetSortOrder
}
export type SheetSortOrder = 'ASC' | 'DESC'

export type SheetFilter = {
  id: string
  sheetId?: string
  sheetViewId?: string
  columnId: string
  type: SheetFilterType
  value: string
}

export type SheetFilterType = '=' | '>' | '>=' | '<' | '<='

export type SheetGroup = {
  id: string
  sheetId?: string
  sheetViewId?: string
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
