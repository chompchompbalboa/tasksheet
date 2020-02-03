//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { v4 as createUuid } from 'uuid'
import { batch } from 'react-redux'

import { IAppState } from '@/state'
import { IThunkAction, IThunkDispatch } from '@/state/types'
import { IFile, IFilePermission } from '@/state/folder/types'
import { 
  ISheet,
  IAllSheetColumns,
  IAllSheetRows,
  IAllSheetCells, ISheetCellType,
  ISheetView, 
  IAllSheetPriorities, ISheetPriority
} from '@/state/sheet/types'

import {
  setAllFiles,
  setAllFilePermissions
} from '@/state/folder/actions'
import {
  setAllSheets,
  setAllSheetViews,
  setAllSheetColumns,
  setAllSheetRows,
  setAllSheetCells,
  setAllSheetPriorities
} from '@/state/sheet/actions'
import {
  updateActiveTab,
  updateTabs
} from '@/state/tab/actions'

import { 
  defaultSheetSelections, 
  defaultSheetStyles 
} from '@/state/sheet/defaults'
 
//-----------------------------------------------------------------------------
// Create Sheet
//-----------------------------------------------------------------------------
export const createDemoSheet = (): IThunkAction => {
  return async (dispatch: IThunkDispatch, getState: () => IAppState) => {

    const {
      folder: {
        allFiles,
        allFilePermissions,
      },
      sheet: {
        allSheets,
        allSheetColumns,
        allSheetRows,
        allSheetCells,
        allSheetViews,
        allSheetPriorities
      },
      tab: {
        tabs
      },
      user
    } = getState()

    // New Ids
    const newFileId = createUuid()
    const newSheetId = createUuid()
    const newActiveSheetViewId = createUuid()

    // Create the new file permission
    const newFilePermission: IFilePermission = {
      id: createUuid(),
      fileId: newFileId,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      role: 'OWNER'
    }

    // Create the new file
    const newFile: IFile = {
      id: newFileId,
      folderId: null,
      userId: user.id,
      name: "New Sheet",
      type: 'SHEET',
      typeId: newSheetId,
      role: 'OWNER',
      permissions: [ newFilePermission.id ]
    }

    // Create the new sheet
    const newSheet: ISheet = {
      id: newSheetId,
      activeSheetViewId: newActiveSheetViewId,
      sourceSheetId: null,
      views: [ newActiveSheetViewId ],
      columns: [],
      rows: [],
      priorities: [],
      cellPriorities: {},
      selections: defaultSheetSelections,
      styles: defaultSheetStyles,
      visibleRows: [],
      visibleRowLeaders: [],
      isCellEditing: false
    }

    // Create the new active sheet view
    const newActiveSheetView: ISheetView = {
      id: newActiveSheetViewId,
      name: "All Rows",
      sheetId: newSheetId,
      isLocked: false,
      filters: [],
      groups: [],
      sorts: [],
      searchValue: "",
      visibleColumns: []
    }

    // Create the new sheet priorities
    const nextAllSheetPriorities: IAllSheetPriorities = { ...allSheetPriorities }
    const newSheetPrioritiesSource: ISheetPriority[] = [
      { id: createUuid(), sheetId: newSheetId, name: "Now", backgroundColor: "rgb(255, 150, 150)", color: "black", order: 1 },
      { id: createUuid(), sheetId: newSheetId, name: "Soon", backgroundColor: "rgb(255, 205, 155)", color: "black", order: 2 },
      { id: createUuid(), sheetId: newSheetId, name: "Later", backgroundColor: "rgb(255, 255, 160)", color: "black", order: 3 }
    ]
    newSheetPrioritiesSource.forEach(newSheetPriority => {
      newSheet.priorities.push(newSheetPriority.id)
      nextAllSheetPriorities[newSheetPriority.id] = newSheetPriority
    })

    // Create the new sheet columns
    const nextAllSheetColumns: IAllSheetColumns = { ...allSheetColumns }
    const newSheetColumnsSource = [
      { name: 'Photos', cellType: 'PHOTOS', width: 50, trackCellChanges: false, showCellChanges: false },
      { name: 'Files', cellType: 'FILES', width: 50, trackCellChanges: false, showCellChanges: false },
      { cellType: 'COLUMN_BREAK' },
      { name: 'Category', cellType: 'STRING', width: 100, trackCellChanges: false, showCellChanges: false },
      { name: 'Task', cellType: 'STRING', width: 450, trackCellChanges: false, showCellChanges: false },
      { cellType: 'COLUMN_BREAK' },
      { name: 'Check In', cellType: 'DATETIME', width: 100, trackCellChanges: false, showCellChanges: false },
      { name: 'Completed', cellType: 'BOOLEAN', width: 75, trackCellChanges: false, showCellChanges: false },
      { cellType: 'COLUMN_BREAK' },
      { name: 'Notes', cellType: 'STRING', width: 450, trackCellChanges: true, showCellChanges: true },
    ]
    newSheetColumnsSource.forEach(sheetColumnSource => {
      if(sheetColumnSource.cellType === 'COLUMN_BREAK') {
        newActiveSheetView.visibleColumns.push('COLUMN_BREAK')
      }
      else {
        const newSheetColumnId = createUuid()
        newSheet.columns.push(newSheetColumnId)
        newActiveSheetView.visibleColumns.push(newSheetColumnId)
        nextAllSheetColumns[newSheetColumnId] = {
          id: newSheetColumnId,
          sheetId: newSheetId,
          name: sheetColumnSource.name,
          cellType: sheetColumnSource.cellType as ISheetCellType,
          width: sheetColumnSource.width,
          defaultValue: null,
          trackCellChanges: sheetColumnSource.trackCellChanges,
          showCellChanges: sheetColumnSource.showCellChanges,
          allCellValues: new Set()
        }
      }
    })

    // Create the new sheet rows and cells
    const nextAllSheetRows: IAllSheetRows = { ...allSheetRows }
    const nextAllSheetCells: IAllSheetCells = { ...allSheetCells }
    for(let i = 0; i < 5; i++) {
      const newSheetRowId = createUuid()
      newSheet.rows.push(newSheetRowId)
      newSheet.visibleRows.push(newSheetRowId)
      newSheet.visibleRowLeaders.push(i + 1)
      nextAllSheetRows[newSheetRowId] = {
        id: newSheetRowId,
        sheetId: newSheetId,
        cells: {}
      }
      newActiveSheetView.visibleColumns.forEach(sheetColumnId => {
        const newSheetCellId = createUuid()
        nextAllSheetRows[newSheetRowId].cells[sheetColumnId] = newSheetCellId
        nextAllSheetCells[newSheetCellId] = {
          id: newSheetCellId,
          sheetId: newSheetId,
          columnId: sheetColumnId,
          rowId: newSheetRowId,
          value: "",
          isCellEditing: false,
          isCellSelectedSheetIds: new Set()
        }
      })
    }

    batch(() => {
      dispatch(setAllFilePermissions({ ...allFilePermissions, [ newFilePermission.id]: newFilePermission }))
      dispatch(setAllFiles({ ...allFiles, [newFile.id]: newFile }))
  
      dispatch(setAllSheetCells(nextAllSheetCells))
      dispatch(setAllSheetRows(nextAllSheetRows))
      dispatch(setAllSheetColumns(nextAllSheetColumns))
      dispatch(setAllSheetViews({ ...allSheetViews, [newActiveSheetView.id]: newActiveSheetView }))
      dispatch(setAllSheetPriorities(nextAllSheetPriorities))
      dispatch(setAllSheets({ ...allSheets, [newSheet.id]: newSheet }))
  
      dispatch(updateTabs([ ...tabs, newFile.id ]))
      dispatch(updateActiveTab(newFile.id))
    })
  }
}