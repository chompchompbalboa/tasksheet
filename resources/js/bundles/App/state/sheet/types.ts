export interface Sheets {
	[key: string]: Sheet
}

export interface Sheet {
	id: string
	rows: [Row]
	columns: [Column]
	cells: [Cell]
}

export interface Column {
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

export interface Row {
	id: string
	sheetId: string
}

export interface Cell {
	id: string
	sheetId: string
	columnId: string
	rowId: string
	value: string
}

export interface NestedSheet {
	id: string
	rows: [NestedRow]
	columns: [Column]
}

export interface NestedRow {
	id: string
	sheetId: string
	cells: [Cell]
}
