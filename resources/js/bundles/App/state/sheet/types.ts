import { FileType } from '@app/state/folder/types'

export interface IAllSheets { [sheetId: string]: ISheet }
export interface IAllSheetColumns { [columnId: string]: ISheetColumn }
export interface IAllSheetRows { [rowId: string]: ISheetRow }
export interface IAllSheetCells { [cellId: string]: ISheetCell }
export interface IAllSheetColumnTypes { [cellId: string]: ISheetColumnType }
export interface IAllSheetFilters { [filterId: string]: ISheetFilter }
export interface IAllSheetGroups { [groupId: string]: ISheetGroup }
export interface IAllSheetSorts { [sortId: string]: ISheetSort }

export interface SheetActive {
  columnRenamingId: ISheetColumn['id']
}
export interface SheetActiveUpdates {
  columnRenamingId?: ISheetColumn['id']
}

export interface SheetClipboard {
  sheetId: ISheet['id']
  cutOrCopy: 'CUT' | 'COPY'
  selections: SheetClipboardSelections
}
export interface SheetClipboardSelections {
  rangeCellIds: Set<ISheetCell['id']>
  rangeStartColumnId: ISheetColumn['id']
  rangeStartRowId: ISheetRow['id']
  rangeStartCellId: ISheetCell['id']
  rangeEndColumnId: ISheetColumn['id']
  rangeEndRowId: ISheetRow['id']
  rangeEndCellId: ISheetCell['id']
  visibleColumns: ISheetColumn['id'][]
  visibleRows: ISheetRow['id'][]
}

export interface ISheet {
  id: string
  sourceSheetId: ISheet['id']
  fileType: FileType
	rows: ISheetRow['id'][]
  visibleRows: ISheetRow['id'][]
  columns: ISheetColumn['id'][]
  visibleColumns: ISheetColumn['id'][]
  filters: ISheetFilter['id'][]
  groups: ISheetGroup['id'][]
  sorts: ISheetSort['id'][]
  styles: SheetStyles
  selections: SheetSelections
}
export interface SheetUpdates {
  rows?: ISheetRow['id'][]
  visibleRows?: ISheetRow['id'][]
  columns?: ISheetColumn['id'][]
  visibleColumns?: ISheetColumn['id'][]
  filters?: ISheetFilter['id'][]
  groups?: ISheetGroup['id'][]
  sorts?: ISheetSort['id'][]
  styles?: SheetStyles
  selections?: SheetSelections
}
export interface SheetSelections {
  isSelectedCellEditingPrevented: boolean
  isSelectedCellNavigationPrevented: boolean
  rangeCellIds: Set<ISheetCell['id']>
  rangeStartColumnId: ISheetColumn['id']
  rangeStartRowId: ISheetRow['id']
  rangeStartCellId: ISheetCell['id']
  rangeEndColumnId: ISheetColumn['id']
  rangeEndRowId: ISheetRow['id']
  rangeEndCellId: ISheetCell['id']
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
  columns: ISheetColumn[]
  visibleColumns: ISheetColumn['id'][]
  filters: ISheetFilter[]
  groups: ISheetGroup[]
  rows: SheetFromServerRow[]
  sorts: ISheetSort[]
  styles: SheetStyles
}
export interface SheetFromServerRow {
	id: string
	sheetId: string
	cells: ISheetCell[]
}

export interface ISheetColumn {
	id: string
	sheetId: string
	typeId: ISheetColumnType['id']
	name: string
	width: number
}
export interface SheetColumnUpdates {
  typeId?: ISheetColumnType['id']
  name?: string
  width?: number
}
export interface SheetColumnToServer {
  id: string
  sheetId: string
  typeId: ISheetColumnType['id']
  name: string
  width: number
  cells: ISheetCell[]
}
export interface ISheetColumnType {
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

export interface ISheetRow {
	id: string
	sheetId: string
	cells: { [columnId: string]: ISheetCell['id'] }
}
export interface SheetRowUpdates {
  cells?: { [columnId: string]: ISheetCell['id'] }
}
export interface SheetRowToServer {
  id: string
  sheetId: string
  cells: ISheetCell[]
}

export interface ISheetCell {
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

export interface ISheetSort {
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

export interface ISheetFilter {
  id: string
  sheetId: string
  columnId: string
  type: SheetFilterType
  value: string
  isLocked: boolean
}
export interface SheetFilterUpdates {}
export type SheetFilterType = '=' | '!=' | '>' | '>=' | '<' | '<='

export interface ISheetGroup {
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
  visibleColumns: ISheetColumn['id'][]
  filters: IAllSheetFilters
  groups: IAllSheetGroups
  sorts: IAllSheetSorts
}

export interface SheetDownloadOptions {
  filename: string
  includeColumnTypeInformation: boolean
  includeAssets: boolean
  visibleRows: ISheetRow['id'][]
}
