export type Sheets = { [key: string]: Sheet }
export type Columns = Column[]
export type Rows = Row[]

export type Sheet = {
	id: string
	rows: Rows
	columns: Columns
}

export type Column = {
	id: string
	sheetId: string
	name: string
	position: number
	width: number
	type: ColumnType
}

export enum ColumnType {
	STRING = 'STRING',
	DATETIME = 'DATETIME',
	BOOLEAN = 'BOOLEAN',
	NUMBER = 'NUMBER',
}

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
