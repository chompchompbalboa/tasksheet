import { FileType } from '@app/state/folder/types'

export type Sheets = { [sheetId: string]: Sheet }
export type SheetColumns = { [columnId: string]: SheetColumn }
export type SheetColumnTypes = { [cellId: string]: SheetColumnType }
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

export type SheetClipboard = {
  sheetId: Sheet['id']
  cutOrCopy: 'CUT' | 'COPY'
  selections: SheetClipboardSelections
}
export type SheetClipboardSelections = {
  rangeCellIds: Set<SheetCell['id']>
  rangeStartColumnId: SheetColumn['id']
  rangeStartRowId: SheetRow['id']
  rangeStartCellId: SheetCell['id']
  rangeEndColumnId: SheetColumn['id']
  rangeEndRowId: SheetRow['id']
  rangeEndCellId: SheetCell['id']
  visibleColumns: SheetColumn['id'][]
  visibleRows: SheetRow['id'][]
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
  styles: SheetStyles
  selections: SheetSelections
}
export type SheetUpdates = {
  rows?: SheetRow['id'][]
  visibleRows?: SheetRow['id'][]
  columns?: SheetColumn['id'][]
  visibleColumns?: SheetColumn['id'][]
  filters?: SheetFilter['id'][]
  groups?: SheetGroup['id'][]
  sorts?: SheetSort['id'][]
  styles?: SheetStyles
  selections?: SheetSelections
}
export type SheetSelections = {
  isSelectedCellEditingPrevented: boolean
  isSelectedCellNavigationPrevented: boolean
  rangeCellIds: Set<SheetCell['id']>
  rangeStartColumnId: SheetColumn['id']
  rangeStartRowId: SheetRow['id']
  rangeStartCellId: SheetCell['id']
  rangeEndColumnId: SheetColumn['id']
  rangeEndRowId: SheetRow['id']
  rangeEndCellId: SheetCell['id']
}
export type SheetStyles = {
  id: string
  backgroundColor: Set<string>
  backgroundColorReference: { [cellId: string]: string }
  color: Set<string>
  colorReference: { [cellId: string]: string }
  bold: Set<string>
  italic: Set<string>
}
export type SheetStylesUpdates = {
  backgroundColor?: Set<string>
  backgroundColorReference?: { [cellId: string]: string }
  color?: Set<string>
  colorReference?: { [cellId: string]: string }
  bold?: Set<string>
  italic?: Set<string>
}
export type SheetStylesServerUpdates = {
  backgroundColor?: string[]
  backgroundColorReference?: { [cellId: string]: string }
  color?: string[]
  colorReference?: { [cellId: string]: string }
  bold?: string[]
  italic?: string[]
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
  styles: SheetStyles
}
export type SheetFromServerRow = {
	id: string
	sheetId: string
	cells: SheetCell[]
}

export type SheetColumn = {
	id: string
	sheetId: string
	typeId: SheetColumnType['id']
	name: string
	width: number
}
export type SheetColumnUpdates = {
  typeId?: SheetColumnType['id']
  name?: string
  width?: number
}
export type SheetColumnToServer = {
  id: string
  sheetId: string
  typeId: SheetColumnType['id']
  name: string
  width: number
  cells: SheetCell[]
}
export type SheetColumnType = {
  id: string
  organizationId: string
  userId: string
  sheetId: string
  name: string
  cellType: SheetCellType
  data: SheetColumnTypeDropdown
}
export type SheetColumnTypeDropdown = {
  options: { [key: string]: SheetColumnTypeDropdownOption }
}
export type SheetColumnTypeDropdownOption = {
  id: string
  value: string
}

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
  isCellEditing: boolean
  isCellSelected: boolean
}
export interface SheetCellUpdates {
  value?: string
  isCellEditing?: boolean
  isCellSelected?: boolean
}
export type SheetCellType = 
'STRING' |
'DATETIME'|
'BOOLEAN'|
'NUMBER' | 
'DROPDOWN' |
'PHOTOS' | 
'FILES'

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
