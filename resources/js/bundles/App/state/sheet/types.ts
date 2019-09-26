import { FileType } from '@app/state/folder/types'

export interface IAllSheets { [sheetId: string]: Sheet }
export interface IAllSheetColumns { [columnId: string]: SheetColumn }
export interface IAllSheetRows { [rowId: string]: SheetRow }
export interface IAllSheetCells { [cellId: string]: SheetCell }
export interface IAllSheetColumnTypes { [cellId: string]: SheetColumnType }
export interface SheetFilters { [filterId: string]: SheetFilter }
export interface SheetGroups { [groupId: string]: SheetGroup }
export interface SheetSorts { [sortId: string]: SheetSort }

export interface SheetActive {
  columnRenamingId: SheetColumn['id']
}
export interface SheetActiveUpdates {
  columnRenamingId?: SheetColumn['id']
}

export interface SheetClipboard {
  sheetId: Sheet['id']
  cutOrCopy: 'CUT' | 'COPY'
  selections: SheetClipboardSelections
}
export interface SheetClipboardSelections {
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

export interface Sheet {
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
export interface SheetUpdates {
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
export interface SheetSelections {
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
export interface SheetStyles {
  id: string
  backgroundColor: Set<string>
  backgroundColorReference: { [cellId: string]: string }
  color: Set<string>
  colorReference: { [cellId: string]: string }
  bold: Set<string>
  italic: Set<string>
}
export interface SheetStylesUpdates {
  backgroundColor?: Set<string>
  backgroundColorReference?: { [cellId: string]: string }
  color?: Set<string>
  colorReference?: { [cellId: string]: string }
  bold?: Set<string>
  italic?: Set<string>
}
export interface SheetStylesServerUpdates {
  backgroundColor?: string[]
  backgroundColorReference?: { [cellId: string]: string }
  color?: string[]
  colorReference?: { [cellId: string]: string }
  bold?: string[]
  italic?: string[]
}

export interface SheetFromServer {
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
export interface SheetFromServerRow {
	id: string
	sheetId: string
	cells: SheetCell[]
}

export interface SheetColumn {
	id: string
	sheetId: string
	typeId: SheetColumnType['id']
	name: string
	width: number
}
export interface SheetColumnUpdates {
  typeId?: SheetColumnType['id']
  name?: string
  width?: number
}
export interface SheetColumnToServer {
  id: string
  sheetId: string
  typeId: SheetColumnType['id']
  name: string
  width: number
  cells: SheetCell[]
}
export interface SheetColumnType {
  id: string
  organizationId: string
  userId: string
  sheetId: string
  name: string
  cellType: SheetCellType
  data: SheetColumnTypeDropdown
}
export interface SheetColumnTypeDropdown {
  options: { [key: string]: SheetColumnTypeDropdownOption }
}
export interface SheetColumnTypeDropdownOption {
  id: string
  value: string
}

export interface SheetRow {
	id: string
	sheetId: string
	cells: { [columnId: string]: SheetCell['id'] }
}
export interface SheetRowUpdates {
  cells?: { [columnId: string]: SheetCell['id'] }
}
export interface SheetRowToServer {
  id: string
  sheetId: string
  cells: SheetCell[]
}

export interface SheetCell {
	id: string
	sheetId: string
	columnId: string
	rowId: string
	value: string
  isCellEditing: boolean
  isCellSelected: boolean
}
export interface SheetCellUpdates {
  id?: string
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

export interface SheetSort {
  id: string
  sheetId: string
  columnId: string
  order: SheetSortOrder
  isLocked: boolean
}
export interface SheetSortUpdates {
  order?: SheetSortOrder
}
export type SheetSortOrder = 'ASC' | 'DESC'

export interface SheetFilter {
  id: string
  sheetId: string
  columnId: string
  type: SheetFilterType
  value: string
  isLocked: boolean
}
export interface SheetFilterUpdates {}
export type SheetFilterType = '=' | '!=' | '>' | '>=' | '<' | '<='

export interface SheetGroup {
  id: string
  sheetId: string
  columnId: string
  order: SheetGroupOrder
  isLocked: boolean
}
export interface SheetGroupUpdates {
  order?: SheetGroupOrder
}

export type SheetGroupOrder = 'ASC' | 'DESC'

export interface SheetView {
  id: string
  sourceSheetId: string
  visibleColumns: SheetColumn['id'][]
  filters: SheetFilters
  groups: SheetGroups
  sorts: SheetSorts
}

export interface SheetDownloadOptions {
  filename: string
  includeColumnTypeInformation: boolean
  includeAssets: boolean
  visibleRows: SheetRow['id'][]
}
