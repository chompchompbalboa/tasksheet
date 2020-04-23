//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { v4 as createUuid } from 'uuid'

import clone from '@/utils/clone'

import { mutation } from '@/api'

import { IAppState } from '@/state'
import { IThunkAction, IThunkDispatch } from '@/state/types'
import { ISheet, ISheetCellUpdates, ISheetLabel } from '@/state/sheet/types'
import { defaultSheetSelections } from '@/state/sheet/defaults'

import { createHistoryStep } from '@/state/history/actions'
import { 
  clearSheetSelection, 
  setAllSheetCells, 
  setAllSheetCellLabels,
  setAllSheetLabels,
  updateSheet
} from '@/state/sheet/actions'

//-----------------------------------------------------------------------------
// Paste Sheet Range
//-----------------------------------------------------------------------------
export const pasteSheetRange = (sheetId: ISheet['id']): IThunkAction => {
  return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    const {
      allSheets: {
        [sheetId]: {
          activeSheetViewId,
          selections: {
            rangeStartCellId: sheetRangeStartCellId,
            rangeStartColumnId: sheetRangeStartColumnId,
            rangeStartRowId: sheetRangeStartRowId,
          },
          visibleRows: allSheetVisibleRows,
          isCellEditing
        }
      },
      allSheetColumns,
      allSheetRows,
      allSheetCells,
      allSheetViews,
      allSheetLabels,
      allSheetCellLabels,
      clipboard: {
        cutOrCopy,
        selections: {
          rangeEndColumnId: clipboardRangeEndColumnId,
          rangeEndRowId: clipboardRangeEndRowId,
          rangeStartColumnId: clipboardRangeStartColumnId,
          rangeStartRowId: clipboardRangeStartRowId,
          visibleColumns: allClipboardVisibleColumns,
          visibleRows: allClipboardVisibleRows
        }
      }
    } = getState().sheet

    if(!isCellEditing) {

      const activeSheetView = allSheetViews[activeSheetViewId]
  
      const nextAllSheetCells = clone(allSheetCells)
      const sheetCellUpdates: ISheetCellUpdates[] = []
      const undoSheetCellUpdates: ISheetCellUpdates[] = []

      const nextAllSheetLabels = clone(allSheetLabels)
      const nextAllSheetCellLabels = clone(allSheetCellLabels)
      const newSheetCellLabels: ISheetLabel[] = []
      const newSheetCellLabelIds: ISheetLabel['id'][] = []
      const sheetCellLabelIdsToDelete: ISheetLabel['id'][] = []
  
      const clipboardVisibleColumns = allClipboardVisibleColumns.filter(columnId => columnId !== 'COLUMN_BREAK')
      const clipboardVisibleRows = allClipboardVisibleRows.filter(rowId => rowId !== 'ROW_BREAK')
      const sheetVisibleColumns = activeSheetView.visibleColumns.filter(columnId => columnId !== 'COLUMN_BREAK')
      const sheetVisibleRows = allSheetVisibleRows.filter(rowId => rowId !== 'COLUMN_BREAK')
  
      const clipboardRangeStartColumnIndex = clipboardVisibleColumns.indexOf(clipboardRangeStartColumnId)
      const sheetRangeStartColumnIndex = sheetVisibleColumns.indexOf(sheetRangeStartColumnId)
      const clipboardRangeStartRowIndex = clipboardVisibleRows.indexOf(clipboardRangeStartRowId)
      const sheetRangeStartRowIndex = sheetVisibleRows.indexOf(sheetRangeStartRowId)
  
      for(let clipboardRowIndex = clipboardVisibleRows.indexOf(clipboardRangeStartRowId); clipboardRowIndex <= clipboardVisibleRows.indexOf(clipboardRangeEndRowId || clipboardRangeStartRowId); clipboardRowIndex++) {
        
        const clipboardRowId = clipboardVisibleRows[clipboardRowIndex]
        const sheetRowId = sheetVisibleRows[sheetRangeStartRowIndex + (clipboardRowIndex - clipboardRangeStartRowIndex)]
        const clipboardRow = allSheetRows[clipboardRowId]
        const sheetRow = allSheetRows[sheetRowId]
  
        if(clipboardRow && sheetRow) {
          
          for(let clipboardColumnIndex = clipboardVisibleColumns.indexOf(clipboardRangeStartColumnId); clipboardColumnIndex <= clipboardVisibleColumns.indexOf(clipboardRangeEndColumnId || clipboardRangeStartColumnId); clipboardColumnIndex++) {
            
            const clipboardColumnId = clipboardVisibleColumns[clipboardColumnIndex]
            const sheetColumnId = sheetVisibleColumns[sheetRangeStartColumnIndex + (clipboardColumnIndex - clipboardRangeStartColumnIndex)]
            const sheetColumn = allSheetColumns[sheetColumnId]
            const clipboardCellId = clipboardRow.cells[clipboardColumnId]
            const sheetCellId = sheetRow.cells[sheetColumnId]
            const clipboardCell = allSheetCells[clipboardCellId]
            const sheetCell = allSheetCells[sheetCellId]
            
            if(clipboardCell && sheetCell) {
              
              nextAllSheetCells[sheetCellId].value = clipboardCell.value
              sheetCellUpdates.push({ id: sheetCellId, value: clipboardCell.value })
              undoSheetCellUpdates.push({ id: sheetCellId, value: sheetCell.value })
              
              if(cutOrCopy === 'CUT') {
                nextAllSheetCells[clipboardCellId].value = null
                sheetCellUpdates.push({ id: clipboardCellId, value: null })
                undoSheetCellUpdates.push({ id: clipboardCellId, value: clipboardCell.value })
              }

              if(sheetColumn.cellType === 'LABELS') {
                const clipboardCellSheetCellLabels = allSheetCellLabels[clipboardCellId]
                const sheetCellCellSheetCellLabels = allSheetCellLabels[sheetCellId]
                const currentCellNewSheetCellLabelIds: ISheetLabel['id'][] = []
                clipboardCellSheetCellLabels && clipboardCellSheetCellLabels.forEach(sheetCellLabelId => {
                  const sheetLabel = allSheetLabels[sheetCellLabelId]
                  const newSheetCellLabel: ISheetLabel = {
                    id: createUuid(),
                    sheetId: sheetId,
                    columnId: sheetColumnId,
                    rowId: sheetRowId,
                    cellId: sheetCell.id,
                    value: sheetLabel.value
                  }
                  newSheetCellLabels.push(newSheetCellLabel)
                  newSheetCellLabelIds.push(newSheetCellLabel.id)
                  currentCellNewSheetCellLabelIds.push(newSheetCellLabel.id)
                  nextAllSheetLabels[newSheetCellLabel.id] = newSheetCellLabel
                  if(cutOrCopy === 'CUT') {
                    nextAllSheetCellLabels[clipboardCellId] = null
                    sheetCellLabelIdsToDelete.push(sheetLabel.id)
                  }
                })
                sheetCellCellSheetCellLabels && sheetCellCellSheetCellLabels.map(sheetCellLabelId => {
                  sheetCellLabelIdsToDelete.push(sheetCellLabelId)
                })
                nextAllSheetCellLabels[sheetCell.id] = [ ...(currentCellNewSheetCellLabelIds || []) ]
              }
            }
          }
        }
      }
      
      const actions = (isHistoryStep: boolean = false) => {
        isHistoryStep && dispatch(clearSheetSelection(sheetId))
        dispatch(setAllSheetCells(nextAllSheetCells))
        dispatch(setAllSheetCells({
          ...nextAllSheetCells,
          [sheetRangeStartCellId]: {
            ...nextAllSheetCells[sheetRangeStartCellId],
            isCellSelectedSheetIds: new Set([ ...allSheetCells[sheetRangeStartCellId].isCellSelectedSheetIds, sheetId ])
          }
        }))
        dispatch(setAllSheetLabels(nextAllSheetLabels))
        dispatch(setAllSheetCellLabels(nextAllSheetCellLabels))
        dispatch(updateSheet(sheetId, {
          selections: {
            ...defaultSheetSelections,
            rangeStartColumnId: sheetRangeStartColumnId,
            rangeStartRowId: sheetRangeStartRowId,
            rangeStartCellId: sheetRangeStartCellId,
          }
        }, true))
        mutation.updateSheetCells(sheetCellUpdates)
        mutation.deleteSheetCellLabels(sheetCellLabelIdsToDelete)
        if(!isHistoryStep) {
          mutation.createSheetCellLabels(newSheetCellLabels)
        }
        else {
          mutation.restoreSheetCellLabels(newSheetCellLabelIds)
        }
      }
      
      const undoActions = (isHistoryStep: boolean = false) => {
        isHistoryStep && dispatch(clearSheetSelection(sheetId))
        dispatch(setAllSheetCells(allSheetCells))
        dispatch(setAllSheetCellLabels(allSheetCellLabels))
        dispatch(setAllSheetLabels(allSheetLabels))
        dispatch(updateSheet(sheetId, {
          selections: {
            ...defaultSheetSelections,
            rangeStartColumnId: sheetRangeStartColumnId,
            rangeStartRowId: sheetRangeStartRowId,
            rangeStartCellId: sheetRangeStartCellId,
          }
        }, true))
        mutation.updateSheetCells(undoSheetCellUpdates)
        mutation.deleteSheetCellLabels(newSheetCellLabelIds)
        mutation.restoreSheetCellLabels(sheetCellLabelIdsToDelete)
      }
      
      dispatch(createHistoryStep({ actions, undoActions }))
      actions()
    }
  }
}