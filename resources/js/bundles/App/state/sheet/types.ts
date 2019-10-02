import { IFileType } from '@app/state/folder/types'

export interface IAllSheets { [sheetId: string]: ISheet }
export interface IAllSheetColumns { [columnId: string]: ISheetColumn }
export interface IAllSheetRows { [rowId: string]: ISheetRow }
export interface IAllSheetCells { [cellId: string]: ISheetCell }
export interface IAllSheetColumnTypes { [cellId: string]: ISheetColumnType }
export interface IAllSheetFilters { [filterId: string]: ISheetFilter }
export interface IAllSheetGroups { [groupId: string]: ISheetGroup }
export interface IAllSheetSorts { [sortId: string]: ISheetSort }

export interface ISheetActive {
  columnRenamingId: ISheetColumn['id']
}
export interface ISheetActiveUpdates {
  columnRenamingId?: ISheetColumn['id']
}

export interface ISheetClipboard {
  sheetId: ISheet['id']
  cutOrCopy: 'CUT' | 'COPY'
  selections: ISheetClipboardSelections
}
export interface ISheetClipboardSelections {
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
  fileType: IFileType
	rows: ISheetRow['id'][]
  visibleRows: ISheetRow['id'][]
  columns: ISheetColumn['id'][]
  visibleColumns: ISheetColumn['id'][]
  filters: ISheetFilter['id'][]
  groups: ISheetGroup['id'][]
  rowLeaders: ISheetRowLeader[]
  sorts: ISheetSort['id'][]
  styles: ISheetStyles
  selections: ISheetSelections
}
export interface ISheetUpdates {
  rows?: ISheetRow['id'][]
  visibleRows?: ISheetRow['id'][]
  columns?: ISheetColumn['id'][]
  visibleColumns?: ISheetColumn['id'][]
  filters?: ISheetFilter['id'][]
  groups?: ISheetGroup['id'][]
  rowLeaders?: ISheetRowLeader[]
  sorts?: ISheetSort['id'][]
  styles?: ISheetStyles
  selections?: ISheetSelections
}
export interface ISheetSelections {
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
export interface ISheetStyles {
  id: string
  backgroundColor: Set<string>
  backgroundColorReference: { [cellId: string]: string }
  color: Set<string>
  colorReference: { [cellId: string]: string }
  bold: Set<string>
  italic: Set<string>
}
export interface ISheetStylesUpdates {
  backgroundColor?: Set<string>
  backgroundColorReference?: { [cellId: string]: string }
  color?: Set<string>
  colorReference?: { [cellId: string]: string }
  bold?: Set<string>
  italic?: Set<string>
}
export interface ISheetStylesServerUpdates {
  backgroundColor?: string[]
  backgroundColorReference?: { [cellId: string]: string }
  color?: string[]
  colorReference?: { [cellId: string]: string }
  bold?: string[]
  italic?: string[]
}

export interface ISheetFromServer {
  id: string
  sourceSheetId: string
  fileType: IFileType
  columns: ISheetColumn[]
  visibleColumns: ISheetColumn['id'][]
  filters: ISheetFilter[]
  groups: ISheetGroup[]
  rows: ISheetFromServerRow[]
  sorts: ISheetSort[]
  styles: ISheetStyles
}
export interface ISheetFromServerRow {
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
export interface ISheetColumnUpdates {
  typeId?: ISheetColumnType['id']
  name?: string
  width?: number
}
export interface ISheetColumnToServer {
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
  cellType: ISheetCellType
  data: ISheetColumnTypeDropdown
}
export interface ISheetColumnTypeDropdown {
  options: { [key: string]: ISheetColumnTypeDropdownOption }
}
export interface ISheetColumnTypeDropdownOption {
  id: string
  value: string
}

export interface ISheetRow {
	id: string
	sheetId: string
	cells: { [columnId: string]: ISheetCell['id'] }
}
export interface ISheetRowUpdates {
  cells?: { [columnId: string]: ISheetCell['id'] }
}
export interface ISheetRowToServer {
  id: string
  sheetId: string
  cells: ISheetCell[]
}
export type ISheetRowLeader = string | number

export interface ISheetCell {
	id: string
	sheetId: string
	columnId: string
	rowId: string
	value: string
  isCellEditing: boolean
  isCellSelected: boolean
}
export interface ISheetCellUpdates {
  id?: string
  value?: string
  isCellEditing?: boolean
  isCellSelected?: boolean
}
export type ISheetCellType = 
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
  order: ISheetSortOrder
  isLocked: boolean
}
export interface ISheetSortUpdates {
  order?: ISheetSortOrder
}
export type ISheetSortOrder = 'ASC' | 'DESC'

export interface ISheetFilter {
  id: string
  sheetId: string
  columnId: string
  type: ISheetFilterType
  value: string
  isLocked: boolean
}
export interface ISheetFilterUpdates {}
export type ISheetFilterType = '=' | '!=' | '>' | '>=' | '<' | '<='

export interface ISheetGroup {
  id: string
  sheetId: string
  columnId: string
  order: ISheetGroupOrder
  isLocked: boolean
}
export interface ISheetGroupUpdates {
  order?: ISheetGroupOrder
}

export type ISheetGroupOrder = 'ASC' | 'DESC'

export interface ISheetView {
  id: string
  sourceSheetId: string
  visibleColumns: ISheetColumn['id'][]
  filters: IAllSheetFilters
  groups: IAllSheetGroups
  sorts: IAllSheetSorts
}

export interface ISheetDownloadOptions {
  filename: string
  includeColumnTypeInformation: boolean
  includeAssets: boolean
  visibleRows: ISheetRow['id'][]
}
