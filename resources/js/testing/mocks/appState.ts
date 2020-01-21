//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { IAppState } from '@/state'
import { IFile, IFiles, IFolders, IFileType } from '@/state/folder/types'
import { 
  IAllSheets, ISheet, ISheetFromDatabase,
  IAllSheetCells, ISheetCell,
  IAllSheetColumns, ISheetColumn, ISheetCellType, 
  ISheetFilter,
  ISheetGroup,
  IAllSheetRows, ISheetRow, ISheetFromDatabaseRow,
  ISheetSort,
  IAllSheetViews, ISheetView, ISheetViewFromDatabase,
  ISheetPriority
} from '@/state/sheet/types'

import { initialActiveState } from '@/state/active/reducers'
import { initialFolderState } from '@/state/folder/reducers'
import { initialHistoryState } from '@/state/history/reducers'
import { initialModalState } from '@/state/modal/reducers'
import { initialSheetState } from '@/state/sheet/reducers'
import { initialUserState } from '@/state/user/reducers'

import { defaultSheetSelections, defaultSheetStyles } from '@/state/sheet/defaults'

import { resolveSheetVisibleRows, resolveSheetRowLeaders } from '@/state/sheet/resolvers'

import { ISheetCellProps } from '@desktop/Sheet/SheetCell'

//-----------------------------------------------------------------------------
// Factory
//-----------------------------------------------------------------------------
export interface IAppStateFactoryInput {
  numberOfFolders: number
  numberOfFilesPerFolder: number
  numberOfRowsPerSheet: number
  columns: string[]
}

export const appStateFactoryColumns = [
  'STRING',
  'STRING',
  'STRING',
  'NUMBER',
  'DATETIME',
  'FILES',
  'PHOTOS',
  'BOOLEAN',
  'STRING',
  'STRING',
  'STRING'
]

export const appStateFactory = ({
  numberOfFolders = 1,
  numberOfFilesPerFolder = 3,
  numberOfRowsPerSheet = 10,
  columns = appStateFactoryColumns
}: IAppStateFactoryInput)  => {

  const numberOfColumnsPerSheet = columns.length

  const allFolders: IFolders = {}
  const allFiles: IFiles = {}
  const allFileIds: IFile['id'][] = []

  const allSheets: IAllSheets = {}
  const allSheetsFromDatabase: { [sheetId: string]: ISheetFromDatabase } = {}
  const allSheetRows: IAllSheetRows = {}
  const allSheetColumns: IAllSheetColumns = {}
  const allSheetCells: IAllSheetCells = {}
  const allSheetViews: IAllSheetViews = {}

  for(let currentFolderNumber = 1; currentFolderNumber <= numberOfFolders; currentFolderNumber++) {

    const folderPrefix = 'FOLDER_'
    const filePrefix = 'FILE_'
    const sheetPrefix = 'SHEET_'
    const sheetRowPrefix = 'ROW_'
    const sheetColumnPrefix = 'COLUMN_'
    const sheetCellPrefix = 'CELL_'

    const folderSuffix = currentFolderNumber
    const folderId = folderPrefix + folderSuffix
    const folderFiles = []

    for(let currentFileNumber = 1; currentFileNumber <= numberOfFilesPerFolder; currentFileNumber++) {

      const fileSuffix = 'Folder' + currentFolderNumber + '.File' + currentFileNumber
      const sheetSuffix = fileSuffix + '.Sheet' + currentFileNumber
      const fileId = filePrefix + fileSuffix
      const sheetId = sheetPrefix + fileSuffix
      const activeSheetViewId = sheetId + '.activeSheetViewId'

      const newFile = {
        id: fileId,
        folderId: folderId,
        name: fileId,
        type: 'SHEET' as IFileType,
        typeId: sheetId,
      }

      const newSheetSourceSheetId: ISheet['id'] = null
      const newSheetColumns: ISheetColumn['id'][] = []
      const newSheetRows: ISheetRow['id'][] = []
      const newSheetViewVisibleColumns: ISheetColumn['id'][] = []
      const newSheetCellPriorities = {}

      const newSheetFromDatabaseRows: ISheetFromDatabaseRow[] = []
      const newSheetFromDatabaseColumns: ISheetColumn[] = []
      const newSheetFromDatabaseFilters: ISheetFilter[] = []
      const newSheetFromDatabaseGroups: ISheetGroup[] = []
      const newSheetFromDatabaseSorts: ISheetSort[] = []
      const newSheetFromDatabaseViews: ISheetViewFromDatabase[] = []
      const newSheetFromDatabasePriorities: ISheetPriority[] = []

      for(let currentColumnNumber = 1; currentColumnNumber <= numberOfColumnsPerSheet; currentColumnNumber++) {

        const sheetColumnSuffix = sheetSuffix + '.Column' + currentColumnNumber
        const sheetColumnId = sheetColumnPrefix + sheetColumnSuffix

        const newSheetColumn: ISheetColumn = {
          id: sheetColumnId,
          sheetId: sheetId,
          name: sheetColumnId,
          width: 100,
          defaultValue: '',
          cellType: columns[currentColumnNumber - 1] as ISheetCellType,
          trackCellChanges: false,
          showCellChanges: false,
          allCellValues: new Set() as Set<string>
        }
        
        allSheetColumns[newSheetColumn.id] = newSheetColumn
        newSheetColumns.push(newSheetColumn.id)
        newSheetViewVisibleColumns.push(newSheetColumn.id)
        newSheetFromDatabaseColumns.push(newSheetColumn)
      }

      for(let currentRowNumber = 1; currentRowNumber <= numberOfRowsPerSheet; currentRowNumber++) {

        const sheetRowSuffix = sheetSuffix + '.Row' + currentRowNumber
        const sheetRowId = sheetRowPrefix + sheetRowSuffix
        const sheetRowCells: { [columnId: string]: ISheetCell['id'] } = {}
        const sheetRowFromDatabaseCells: ISheetCell[] = []

        newSheetColumns.forEach((newSheetColumnId, index) => {
          const newSheetColumn = allSheetColumns[newSheetColumnId]
          const currentColumnNumber = index + 1
          const sheetCellSuffix = sheetRowSuffix + '.Column' + currentColumnNumber
          const sheetCellId = sheetCellPrefix + sheetCellSuffix

          const newSheetCell: ISheetCell = {
            id: sheetCellId,
            sheetId: sheetId,
            columnId: newSheetColumn.id,
            rowId: sheetRowId,
            value: sheetCellId,
            isCellEditing: false,
            isCellSelectedSheetIds: new Set()
          }
          allSheetCells[newSheetCell.id] = newSheetCell
          sheetRowCells[newSheetColumn.id] = newSheetCell.id
          sheetRowFromDatabaseCells.push(newSheetCell)
        })

        const newSheetRow: ISheetRow = {
          id: sheetRowId,
          sheetId: sheetId,
          cells: sheetRowCells
        }

        const newSheetFromFromDatabaseRow: ISheetFromDatabaseRow = {
          ...newSheetRow,
          cells: sheetRowFromDatabaseCells
        }

        allSheetRows[newSheetRow.id] = newSheetRow
        newSheetRows.push(newSheetRow.id)
        newSheetFromDatabaseRows.push(newSheetFromFromDatabaseRow)
      }

      const activeSheetView: ISheetView = {
        id: activeSheetViewId,
        sheetId: sheetId,
        name: 'Active Sheet View',
        isLocked: false,
        visibleColumns: newSheetViewVisibleColumns,
        filters: newSheetFromDatabaseFilters.map(filter => filter.id),
        groups: newSheetFromDatabaseGroups.map(group => group.id),
        sorts: newSheetFromDatabaseSorts.map(sort => sort.id),
        searchValue: null
      }
      newSheetFromDatabaseViews.push({
        ...activeSheetView,
        filters: newSheetFromDatabaseFilters,
        groups: newSheetFromDatabaseGroups,
        sorts: newSheetFromDatabaseSorts,
      })
      allSheetViews[activeSheetView.id] = activeSheetView

      const newSheet: ISheet = {
        id: sheetId,
        sourceSheetId: newSheetSourceSheetId,
        activeSheetViewId: activeSheetViewId,
        rows: newSheetRows,
        columns: newSheetColumns,
        visibleRows: null,
        visibleRowLeaders: null,
        styles: defaultSheetStyles,
        selections: defaultSheetSelections,
        views: newSheetFromDatabaseViews.map(view => view.id),
        priorities: newSheetFromDatabasePriorities.map(priority => priority.id),
        cellPriorities: newSheetCellPriorities,
        isCellEditing: false
      }

      newSheet.visibleRows = resolveSheetVisibleRows(
        newSheet,
        allSheetColumns,
        allSheetRows,
        allSheetCells,
        null,
        null,
        null,
        allSheetViews,
        null
      )
      newSheet.visibleRowLeaders = resolveSheetRowLeaders(newSheet.visibleRows)

      const newSheetFromDatabase: ISheetFromDatabase = {
        id: sheetId,
        sourceSheetId: newSheetSourceSheetId,
        activeSheetViewId: activeSheetViewId,
        rows: newSheetFromDatabaseRows,
        columns: newSheetFromDatabaseColumns,
        styles: {
          ...defaultSheetStyles,
          backgroundColor: [],
          color: [],
          bold: [],
          italic: []
        },
        views: newSheetFromDatabaseViews,
        changes: [],
        files: [],
        photos: [],
        priorities: newSheetFromDatabasePriorities,
        cellPriorities: [],
      }

      allFiles[newFile.id] = newFile
      allFileIds.push(newFile.id)
      allSheets[newSheet.id] = newSheet
      folderFiles.push(newFile.id)
      allSheetsFromDatabase[newSheetFromDatabase.id] = newSheetFromDatabase
    }

    allFolders[folderId] = {
      id: folderId,
      name: folderId,
      folders: [],
      files: folderFiles,
      users: []
    }
  }
  
  return {
    allFolders,
    allFiles,
    allFileIds,
    allSheets,
    allSheetsFromDatabase,
    allSheetRows,
    allSheetColumns,
    allSheetCells,
    allSheetViews
  }
}

//-----------------------------------------------------------------------------
// Mock app state
//-----------------------------------------------------------------------------
const {
  allFiles,
  allFileIds,
  allFolders,
  allSheets,
  allSheetColumns,
  allSheetRows,
  allSheetCells,
  allSheetViews
} = appStateFactory({} as IAppStateFactoryInput)

export const appState: IAppState = {
  active: initialActiveState,
  history: initialHistoryState,
  folder: {
    ...initialFolderState,
    files: allFiles,
    folders: allFolders,
  },
  modal: initialModalState,
  messenger: {
    messages: []
  },
  sheet: {
    ...initialSheetState,
    allSheets,
    allSheetColumns,
    allSheetRows,
    allSheetCells,
    allSheetViews
  },
  sheetSettings: {
    activeSheetSetting: 'COLUMN_SETTINGS',
    activeSheetSettingColumnSetting: 'STRING',
  },
  tab: {
    tabs: allFileIds.map(fileId => fileId),
    activeTab: allFileIds[0]
  },
  user: {
    ...initialUserState,
    color: {
      ...initialUserState.color,
      primary: 'userColorPrimary',
      secondary: 'userColorSecondary'
    }
  }
}

//-----------------------------------------------------------------------------
// Get cell and cell props
//-----------------------------------------------------------------------------
export interface IGetCellAndCellProps {
  sheetId?: string,
  row: number,
  column: number,
  cellTypeOverride?: ISheetCellType
}
export const getCellAndCellProps = ({
  sheetId,
  row: rowIndexPlusOne,
  column: columnIndexPlusOne,
  cellTypeOverride
}: IGetCellAndCellProps) => {
  const {
    sheet: {
      allSheets,
      allSheetRows,
      allSheetColumns,
      allSheetCells,
      allSheetViews
    },
  } = appState
  const sheet = allSheets[sheetId || Object.keys(allSheets)[0]]
  const columnId = allSheetViews[sheet.activeSheetViewId].visibleColumns[columnIndexPlusOne - 1]
  const column = allSheetColumns[columnId]
  const cellType = cellTypeOverride || column.cellType
  const rowId = sheet.visibleRows[rowIndexPlusOne - 1]
  const row = allSheetRows[rowId]
  const cell = allSheetCells[row.cells[column.id]]
  const props: ISheetCellProps = {
    sheetId: sheetId,
    columnId: columnId,
    rowId: rowId,
    cellType: cellType,
    style: {}
  }
  return {
    cell,
    props
  }
}
