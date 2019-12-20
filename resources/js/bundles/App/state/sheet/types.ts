//-----------------------------------------------------------------------------
// All Types
//-----------------------------------------------------------------------------
export interface IAllSheets { [sheetId: string]: ISheet }
export interface IAllSheetColumns { [columnId: string]: ISheetColumn }
export interface IAllSheetRows { [rowId: string]: ISheetRow }
export interface IAllSheetCells { [cellId: string]: ISheetCell }
export interface IAllSheetFilters { [filterId: string]: ISheetFilter }
export interface IAllSheetGroups { [groupId: string]: ISheetGroup }
export interface IAllSheetSorts { [sortId: string]: ISheetSort }
export interface IAllSheetViews { [viewId: string]: ISheetView }
export interface IAllSheetChanges { [changeId: string]: ISheetChange }
export interface IAllSheetPhotos { [photoId: string]: ISheetPhoto }
export interface IAllSheetPriorities { [priorityId: string]: ISheetPriority }
export interface IAllSheetCellChanges { [cellId: string]: ISheetChange['id'][] }
export interface IAllSheetCellPhotos { [cellId: string]: ISheetPhoto['id'][] }

//-----------------------------------------------------------------------------
// Sheet
//-----------------------------------------------------------------------------
export interface ISheet {
  id: string
  sourceSheetId: ISheet['id']
  activeSheetViewId: ISheetView['id']
  columns: ISheetColumn['id'][]
	rows: ISheetRow['id'][]
  priorities: ISheetPriority['id'][]
  cellPriorities: { [cellId: string]: ISheetCellPriority }
  styles: ISheetStyles
  selections: ISheetSelections
  views: ISheetView['id'][]
  visibleRows: ISheetRow['id'][]
  visibleRowLeaders: ISheetRowLeader[]
}

export interface ISheetUpdates {
  activeSheetViewId?: ISheetView['id']
  columns?: ISheetColumn['id'][]
  rows?: ISheetRow['id'][]
  priorities?: ISheetPriority['id'][]
  cellPriorities?: { [cellId: string]: ISheetCellPriority }
  styles?: ISheetStyles
  selections?: ISheetSelections
  views?: ISheetView['id'][]
  visibleRows?: ISheetRow['id'][]
  visibleRowLeaders?: ISheetRowLeader[]
}

export interface ISheetFromDatabase {
  id: string
  sourceSheetId: string
  activeSheetViewId: ISheetView['id']
  columns: ISheetColumn[]
  rows: ISheetFromDatabaseRow[]
  priorities: ISheetPriority[]
  cellPriorities: ISheetCellPriority[]
  styles: ISheetStylesFromDatabase
  views: ISheetViewFromDatabase[]
  changes: ISheetChange[]
  photos: ISheetPhoto[]
}

export interface ISheetFromDatabaseRow {
	id: string
	sheetId: string
	cells: ISheetCell[]
}

//-----------------------------------------------------------------------------
// Sheet Link
//-----------------------------------------------------------------------------
export interface ISheetLink {
  id: string
  sourceSheetId: ISheet['id']
  activeSheetViewId: ISheetView['id']
}

export interface ISheetLinkToDatabase {
  id: string
  sourceSheetId: ISheet['id']
  activeSheetViewId: ISheetView['id']
  activeSheetViewName: string
  activeSheetViewVisibleColumns: ISheetColumn['id'][]
}

//-----------------------------------------------------------------------------
// Sheet View
//-----------------------------------------------------------------------------
export interface ISheetView {
  id: string
  sheetId: ISheet['id']
  name: string
  isLocked: boolean
  visibleColumns: ISheetColumn['id'][]
  filters: ISheetFilter['id'][]
  groups: ISheetGroup['id'][]
  sorts: ISheetSort['id'][]
}

export interface ISheetViewFromDatabase {
  id: string
  sheetId: ISheet['id']
  name: string
  isLocked: boolean
  visibleColumns: ISheetColumn['id'][]
  filters: ISheetFilter[]
  groups: ISheetGroup[]
  sorts: ISheetSort[]
}

export interface ISheetViewToDatabase {
  id: string
  sheetId: ISheet['id']
  name: string
  isLocked: boolean
  visibleColumns: ISheetColumn['id'][]
  filters: IAllSheetFilters
  groups: IAllSheetGroups
  sorts: IAllSheetSorts
}

export interface ISheetViewUpdates {
  name?: string
  isLocked?: boolean
  visibleColumns?: ISheetColumn['id'][]
  filters?: ISheetFilter['id'][]
  groups?: ISheetGroup['id'][]
  sorts?: ISheetSort['id'][]
}

//-----------------------------------------------------------------------------
// Sheet Column
//-----------------------------------------------------------------------------
export interface ISheetColumn {
	id: string
	sheetId: string
	cellType: ISheetCellType
	name: string
	width: number
  defaultValue: string
  trackCellChanges: boolean
  showCellChanges: boolean
  allCellValues: Set<string>
}

export interface ISheetColumnUpdates {
  cellType?: ISheetCellType
  name?: string
  width?: number
  defaultValue?: string
  trackCellChanges?: boolean
  showCellChanges?: boolean
  allCellValues?: Set<string>
}

export interface ISheetColumnToDatabase {
  id: string
  sheetId: string
  cellType: ISheetCellType
  name: string
  width: number
  defaultValue: string
  trackCellChanges: boolean
  showCellChanges: boolean
  cells: ISheetCell[]
}

//-----------------------------------------------------------------------------
// Sheet Row
//-----------------------------------------------------------------------------
export interface ISheetRow {
	id: string
	sheetId: string
	cells: { [columnId: string]: ISheetCell['id'] }
}

export interface ISheetRowUpdates {
  cells?: { [columnId: string]: ISheetCell['id'] }
}

export interface ISheetRowToDatabase {
  id: string
  sheetId: string
  cells: ISheetCell[]
}

export type ISheetRowLeader = string | number

//-----------------------------------------------------------------------------
// Sheet Cell
//-----------------------------------------------------------------------------
export interface ISheetCell {
	id: string
	sheetId: string
	columnId: string
	rowId: string
	value: string
  isCellEditing: boolean
  isCellSelectedSheetIds: Set<string>
}

export interface ISheetCellUpdates {
  id?: string
  value?: string
  isCellEditing?: boolean
  isCellSelectedSheetIds?: Set<string>
}

export type ISheetCellType = 
'STRING' |
'DATETIME'|
'BOOLEAN'|
'NUMBER' | 
'PHOTOS' | 
'FILES' |
'TEAM_MEMBERS'

//-----------------------------------------------------------------------------
// Sheet Filter
//-----------------------------------------------------------------------------
export interface ISheetFilter {
  id: string
  createdAt: string
  sheetId: string
  sheetViewId: string
  columnId: string
  type: ISheetFilterType
  value: string
  isLocked: boolean
}

export interface ISheetFilterUpdates {}

export type ISheetFilterType = '=' | '!=' | '>' | '>=' | '<' | '<='

//-----------------------------------------------------------------------------
// Sheet Group
//-----------------------------------------------------------------------------
export interface ISheetGroup {
  id: string
  createdAt: string
  sheetId: string
  sheetViewId: string
  columnId: string
  order: ISheetGroupOrder
  isLocked: boolean
}

export interface ISheetGroupUpdates {
  order?: ISheetGroupOrder
}

export type ISheetGroupOrder = 'ASC' | 'DESC'

//-----------------------------------------------------------------------------
// Sheet Sort
//-----------------------------------------------------------------------------
export interface ISheetSort {
  id: string
  createdAt: string
  sheetId: string
  sheetViewId: string
  columnId: string
  order: ISheetSortOrder
  isLocked: boolean
}

export interface ISheetSortUpdates {
  order?: ISheetSortOrder
}

export type ISheetSortOrder = 'ASC' | 'DESC'

//-----------------------------------------------------------------------------
// Sheet Change
//-----------------------------------------------------------------------------
export interface ISheetChange {
  id: string
  sheetId: ISheet['id']
  columnId: ISheetColumn['id']
  rowId: ISheetRow['id']
  cellId: ISheetCell['id']
  value: string
  createdAt: string
  createdBy: string
}

//-----------------------------------------------------------------------------
// Sheet Photo
//-----------------------------------------------------------------------------
export interface ISheetPhoto {
  id: string
  sheetId: ISheet['id']
  cellId: ISheetCell['id']
  filename: string
  s3Uuid: string
  s3Bucket: string
  s3Key: string
  uploadedBy: string
  uploadedAt: string
}

//-----------------------------------------------------------------------------
// Sheet Priority
//-----------------------------------------------------------------------------
export interface ISheetPriority {
  id: string
  sheetId: ISheet['id']
  name: string
  backgroundColor: string
  color: string
  order: number
}

export interface ISheetPriorityUpdates {
  name?: string
  backgroundColor?: string
  color?: string
  order?: number
}

export interface ISheetCellPriority {
  id: string
  sheetId: ISheet['id']
  cellId: ISheetCell['id']
  priorityId: ISheetPriority['id']
}

//-----------------------------------------------------------------------------
// Sheet Styles
//-----------------------------------------------------------------------------
export interface ISheetStyles {
  id: string
  backgroundColor: Set<string>
  backgroundColorReference: { [cellId: string]: string }
  color: Set<string>
  colorReference: { [cellId: string]: string }
  bold: Set<string>
  italic: Set<string>
}
export interface ISheetStylesFromDatabase {
  id: string
  backgroundColor: string[]
  backgroundColorReference: { [cellId: string]: string }
  color: string[]
  colorReference: { [cellId: string]: string }
  bold: string[]
  italic: string[]
}
export interface ISheetStylesUpdates {
  backgroundColor?: Set<string>
  backgroundColorReference?: { [cellId: string]: string }
  color?: Set<string>
  colorReference?: { [cellId: string]: string }
  bold?: Set<string>
  italic?: Set<string>
}
export interface ISheetStylesDatabaseUpdates {
  backgroundColor?: string[]
  backgroundColorReference?: { [cellId: string]: string }
  color?: string[]
  colorReference?: { [cellId: string]: string }
  bold?: string[]
  italic?: string[]
}

//-----------------------------------------------------------------------------
// Sheet Active
//-----------------------------------------------------------------------------
export interface ISheetActive {
  columnRenamingId: ISheetColumn['id']
}
export interface ISheetActiveUpdates {
  columnRenamingId?: ISheetColumn['id']
}

//-----------------------------------------------------------------------------
// Sheet Download Options
//-----------------------------------------------------------------------------
export interface ISheetDownloadOptions {
  filename: string
  includeColumnTypeInformation: boolean
  includeAssets: boolean
  visibleRows: ISheetRow['id'][]
}

//-----------------------------------------------------------------------------
// Sheet Clipboard
//-----------------------------------------------------------------------------
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

//-----------------------------------------------------------------------------
// Sheet Selections
//-----------------------------------------------------------------------------
export interface ISheetSelections {
  isOneEntireColumnSelected: boolean
  isOneEntireRowSelected: boolean
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





















