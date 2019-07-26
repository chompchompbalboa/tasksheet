export type Sheets = { [key: string]: Sheet }
export type Columns = { [key: string]: Column }
export type VisibleColumns = string[]
export type Rows = { [key: string]: Row }
export type VisibleRows = string[]
export type SheetSorts = SheetSort[]
export type SheetFilters = SheetFilter[]

export type Sheet = {
	id: string
	rows: { [key: string]: Row }
  visibleRows: VisibleRows
  columns: Columns
  visibleColumns: VisibleColumns
  sorts: SheetSorts
  filters: SheetFilters
}

export type SheetFromServer = {
  id: string
  rows: Row[]
  columns: Column[]
  filters: SheetFilters
  sorts: SheetSorts
}

export type Column = {
	id: string
	sheetId: string
	name: string
	position: number
	width: number
	type: ColumnType
}

export type ColumnType = 
	'STRING'|
	'DATETIME'|
	'BOOLEAN'|
	'NUMBER'

export type Row = {
	id: string
	sheetId: string
	cells: Cell[]
}

export type Cell = {
	id: string
	sheetId: string
	columnId: string
	rowId: string
	value: string
}

export type SheetSort = {
  id: string
  sheetId?: string
  columnId: string
  order: SheetSortOrder
}

export type SheetSortOrder = 'ASC' | 'DESC'

export type SheetFilter = {
  id: string
  sheetId?: string
  columnId: string
  type: SheetFilterType
  value: string
}

export type SheetFilterType = '=' | '>' | '>=' | '<' | '<='
