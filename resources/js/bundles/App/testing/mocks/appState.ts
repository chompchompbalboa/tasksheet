//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { IAppState } from '@app/state'
import { IFile, IFiles, IFolders, IFileType } from '@app/state/folder/types'
import { 
  IAllSheets, ISheet, ISheetFromDatabase,
  IAllSheetCells, ISheetCell,
  IAllSheetColumns, ISheetColumn, ISheetColumnType, 
  ISheetFilter,
  ISheetGroup,
  IAllSheetRows, ISheetRow, ISheetFromDatabaseRow,
  ISheetSort,
  IAllSheetViews, ISheetView, ISheetViewFromDatabase,
  ISheetPriority
} from '@app/state/sheet/types'

import { initialFolderState } from '@app/state/folder/reducers'
import { initialHistoryState } from '@app/state/history/reducers'
import { initialModalState } from '@app/state/modal/reducers'
import { initialSheetState } from '@app/state/sheet/reducers'
import { initialTeamState } from '@app/state/team/reducers'
import { initialUserState } from '@app/state/user/reducers'

import { defaultSheetSelections, defaultSheetStyles } from '@app/state/sheet/defaults'

import { ISheetCellProps } from '@app/bundles/Sheet/SheetCell'

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
  'DROPDOWN',
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
      const newSheetDefaultVisibleRows: ISheetRow['id'][] = []
      const newSheetVisibleRows: ISheetRow['id'][] = []
      const newSheetRowLeaders: string[] = []
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
          typeId: columns[currentColumnNumber - 1]
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
        newSheetDefaultVisibleRows.push(newSheetRow.id)
        newSheetVisibleRows.push(newSheetRow.id)
        newSheetFromDatabaseRows.push(newSheetFromFromDatabaseRow)
      }

      const activeSheetView: ISheetView = {
        id: activeSheetViewId,
        sheetId: sheetId,
        name: 'Active Sheet View',
        visibleColumns: newSheetViewVisibleColumns,
        filters: newSheetFromDatabaseFilters.map(filter => filter.id),
        groups: newSheetFromDatabaseGroups.map(group => group.id),
        sorts: newSheetFromDatabaseSorts.map(sort => sort.id),
      }
      newSheetFromDatabaseViews.push({
        ...activeSheetView,
        filters: newSheetFromDatabaseFilters,
        groups: newSheetFromDatabaseGroups,
        sorts: newSheetFromDatabaseSorts,
      })

      const newSheet: ISheet = {
        id: sheetId,
        sourceSheetId: newSheetSourceSheetId,
        activeSheetViewId: activeSheetViewId,
        rows: newSheetRows,
        columns: newSheetColumns,
        visibleRows: newSheetVisibleRows,
        visibleRowLeaders: newSheetRowLeaders,
        styles: defaultSheetStyles,
        selections: defaultSheetSelections,
        views: newSheetFromDatabaseViews.map(view => view.id),
        priorities: newSheetFromDatabasePriorities.map(priority => priority.id),
        cellPriorities: newSheetCellPriorities
      }

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
        priorities: newSheetFromDatabasePriorities,
        cellPriorities: [],
        notes: []
      }

      allFiles[newFile.id] = newFile
      allFileIds.push(newFile.id)
      allSheets[newSheet.id] = newSheet
      allSheetViews[activeSheetView.id] = activeSheetView
      folderFiles.push(newFile.id)
      allSheetsFromDatabase[newSheetFromDatabase.id] = newSheetFromDatabase
    }


    allFolders[folderId] = {
      id: folderId,
      name: folderId,
      folders: [],
      files: folderFiles
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
  teams: initialTeamState,
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
  columnTypeOverride?: ISheetColumnType['id']
}
export const getCellAndCellProps = ({
  sheetId,
  row: rowIndexPlusOne,
  column: columnIndexPlusOne,
  columnTypeOverride
}: IGetCellAndCellProps) => {
  const {
    sheet: {
      allSheets,
      allSheetRows,
      allSheetColumns,
      allSheetColumnTypes,
      allSheetCells,
      allSheetViews
    },
  } = appState
  const sheet = allSheets[sheetId || Object.keys(allSheets)[0]]
  const columnId = allSheetViews[sheet.activeSheetViewId].visibleColumns[columnIndexPlusOne - 1]
  const column = allSheetColumns[columnId]
  const columnType = allSheetColumnTypes[columnTypeOverride || column.typeId]
  const rowId = sheet.visibleRows[rowIndexPlusOne - 1]
  const row = allSheetRows[rowId]
  const cell = allSheetCells[row.cells[column.id]]
  const props: ISheetCellProps = {
    sheetId: sheetId,
    cellId: cell.id,
    columnType: columnType,
    style: {}
  }
  return {
    cell,
    props
  }
}
