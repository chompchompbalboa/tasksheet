export type Sheets = { [key: string]: Sheet }
export type Columns = { [key: string]: Column }
export type VisibleColumns = string[]
export type Rows = { [key: string]: Row }
export type VisibleRows = string[]
export type Sorts = Sort[]
export type Filters = Filter[]

export type Sheet = {
	id: string
	rows: { [key: string]: Row }
  visibleRows: VisibleRows
  columns: Columns
  visibleColumns: VisibleColumns
  sorts: Sorts
  filters: Filters
}

export type SheetFromServer = {
  id: string
  rows: Row[]
  columns: Column[]
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

export type Sort = {
  id: string
  columnId: string
  order: SortOrder
}

export type SortOrder = 'ASC' | 'DESC'

export type Filter = {
  id: string
  columnId: string
  type: FilterType
  value: string
}

export type FilterType = '=' | '>' | '>=' | '<' | '<='
