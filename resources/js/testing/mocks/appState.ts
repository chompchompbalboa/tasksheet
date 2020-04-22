//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { IAppState } from '@/state'
import { 
  IFile, 
  IAllFiles, 
  IAllFolders, 
  IAllFilePermissions,
  IAllUserFilePermissionsByFileTypeId,
  IFilePermission,
  IFileType,
} from '@/state/folder/types'
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
import { IUserTasksheetSubscription } from '@/state/user/types'

import { initialActiveState } from '@/state/active/reducers'
import { initialFolderState } from '@/state/folder/reducers'
import { initialHistoryState } from '@/state/history/reducers'
import { initialModalState } from '@/state/modal/reducers'
import { initialSheetState } from '@/state/sheet/reducers'
import { initialUserState } from '@/state/user/reducers'

import defaultInitialData from '@/state/initialData'
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
  'LABELS',
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

  const allFolders: IAllFolders = {}
  const allFiles: IAllFiles = {}
  const allFileIds: IFile['id'][] = []
  const allFilePermissions: IAllFilePermissions = {}
  const allUserFilePermissionsByFileTypeId: IAllUserFilePermissionsByFileTypeId = {}

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
      const filePermissionId = fileId + '.Permission'
      const sheetId = sheetPrefix + fileSuffix
      const activeSheetViewId = sheetId + '.activeSheetViewId'

      const newFilePermission: IFilePermission = {
        id: filePermissionId,
        fileId: fileId,
        userId: defaultInitialData.user.id,
        userEmail: defaultInitialData.user.email,
        userName: defaultInitialData.user.name,
        role: 'OWNER'
      }

      const newFile: IFile = {
        id: fileId,
        folderId: folderId,
        userId: null,
        name: fileId,
        type: 'SHEET' as IFileType,
        typeId: sheetId,
        role: 'OWNER',
        permissions: []
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
        const sheetColumnCellType = columns[currentColumnNumber - 1] as ISheetCellType

        const newSheetColumn: ISheetColumn = {
          id: sheetColumnId,
          sheetId: sheetId,
          name: sheetColumnId,
          width: 100,
          defaultValue: '',
          cellType: sheetColumnCellType,
          trackCellChanges: false,
          showCellChanges: false,
          allCellValues: new Set() as Set<string>,
          isRenaming: false
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
            value: newSheetColumn.cellType !== 'LABELS' ? sheetCellId : '',
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
        labels: [],
        photos: [],
        priorities: newSheetFromDatabasePriorities,
        cellPriorities: [],
      }

      allFiles[newFile.id] = newFile
      allFileIds.push(newFile.id)
      allSheets[newSheet.id] = newSheet
      allFilePermissions[newFilePermission.id] = newFilePermission
      allUserFilePermissionsByFileTypeId[sheetId] = newFilePermission.id
      folderFiles.push(newFile.id)
      allSheetsFromDatabase[newSheetFromDatabase.id] = newSheetFromDatabase
    }

    allFolders[folderId] = {
      id: folderId,
      name: folderId,
      folders: [],
      files: folderFiles,
      role: 'OWNER',
      permissions: []
    }
  }
  
  return {
    allFolders,
    allFiles,
    allFileIds,
    allFilePermissions,
    allUserFilePermissionsByFileTypeId,
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
  allFilePermissions,
  allUserFilePermissionsByFileTypeId,
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
    allFiles: allFiles,
    allFilePermissions: allFilePermissions,
    allFolders: allFolders,
    allUserFilePermissionsByFileTypeId: allUserFilePermissionsByFileTypeId
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
    allSheetViews,
    allSheetCellLabels: {}
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

//-----------------------------------------------------------------------------
// Get App State By User Sheet Permission
//-----------------------------------------------------------------------------
export const getMockAppStateByUsersFilePermissionRole = (filePermissionRole: IFilePermission['role']): IAppState => {
  const filePermissionId = Object.keys(appState.folder.allFilePermissions)[0]
  return {
    ...appState,
    folder: {
      ...appState.folder,
      allFilePermissions: {
        ...appState.folder.allFilePermissions,
        [filePermissionId]: {
          ...appState.folder.allFilePermissions[filePermissionId],
          role: filePermissionRole
        }
      }
    }
  }
}

//-----------------------------------------------------------------------------
// Get App State By Tasksheet Subscription Type
//-----------------------------------------------------------------------------
export const getMockAppStateByTasksheetSubscriptionType = (tasksheetSubscriptionType: IUserTasksheetSubscription['type']): IAppState => ({
  ...appState,
  user: {
    ...appState.user,
    tasksheetSubscription: {
      ...appState.user.tasksheetSubscription,
      type: tasksheetSubscriptionType
    }
  }
})
