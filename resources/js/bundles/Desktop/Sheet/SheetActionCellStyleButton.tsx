//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { useSheetEditingPermissions } from '@/hooks'

import { IAppState } from '@/state'
import { ISheet } from '@/state/sheet/types'

import { createMessengerMessage } from '@/state/messenger/actions'

import SheetActionButton from '@desktop/Sheet/SheetActionButton'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionCellStyleButton = ({
  sheetId,
  icon,
  marginLeft,
  marginRight,
  sheetStylesSet,
  updateSheetStyles,
  tooltip
}: SheetActionCellStyleButtonProps) => {
  
  // Redux
  const dispatch = useDispatch()
  const allSheetRows = useSelector((state: IAppState) => state.sheet.allSheetRows)
  const selections = useSelector((state: IAppState) => state.sheet.allSheets && state.sheet.allSheets[sheetId] && state.sheet.allSheets[sheetId].selections)
  const sheetActiveSheetViewId = useSelector((state: IAppState) => state.sheet.allSheets && state.sheet.allSheets[sheetId] && state.sheet.allSheets[sheetId].activeSheetViewId)
  const sheetViewVisibleColumns = useSelector((state: IAppState) => state.sheet.allSheetViews && state.sheet.allSheetViews[sheetActiveSheetViewId] && state.sheet.allSheetViews[sheetActiveSheetViewId].visibleColumns)
  const sheetVisibleRows = useSelector((state: IAppState) => state.sheet.allSheets && state.sheet.allSheets[sheetId] && state.sheet.allSheets[sheetId].visibleRows)

  // Permissions
  const {
    userHasPermissionToEditSheet,
    userHasPermissionToEditSheetErrorMessage
  } = useSheetEditingPermissions(sheetId)
  
  // Add or Delete From Set
  const addOrDeleteFromSet = sheetStylesSet && sheetStylesSet.has(selections.rangeStartCellId) ? 'DELETE' : 'ADD'

  // Handle Button Click
  const handleButtonClick = () => {
    if(!userHasPermissionToEditSheet) {
      dispatch(createMessengerMessage(userHasPermissionToEditSheetErrorMessage))
    }
    else {
      const {
        rangeStartCellId,
        rangeStartColumnId,
        rangeStartRowId,
        rangeEndCellId,
        rangeEndColumnId,
        rangeEndRowId,
      } = selections

      // Range
      if(rangeEndCellId) {
        const rangeStartColumnIndex = sheetViewVisibleColumns.findIndex(visibleColumnId => visibleColumnId === rangeStartColumnId)
        const rangeStartRowIndex = sheetVisibleRows.findIndex(visibleRowId => visibleRowId === rangeStartRowId)
        const rangeEndColumnIndex = sheetViewVisibleColumns.findIndex(visibleColumnId => visibleColumnId === rangeEndColumnId)
        const rangeEndRowIndex = sheetVisibleRows.findIndex(visibleRowId => visibleRowId === rangeEndRowId)
        const nextSheetStylesSet = new Set([ ...sheetStylesSet ])

        for(let rowIndex = rangeStartRowIndex; rowIndex <= rangeEndRowIndex; rowIndex++) {
          const rowId = sheetVisibleRows[rowIndex]
          if(rowId !== 'ROW_BREAK') {
            const row = allSheetRows[rowId]
            for(let columnIndex = rangeStartColumnIndex; columnIndex <= rangeEndColumnIndex; columnIndex++) {
              const columnId = sheetViewVisibleColumns[columnIndex]
              if(columnId !== 'COLUMN_BREAK') {
                const cellId = row.cells[columnId]
                addOrDeleteFromSet === 'ADD' ? nextSheetStylesSet.add(cellId) : nextSheetStylesSet.delete(cellId)
              }
            }
          }
        }
        updateSheetStyles(nextSheetStylesSet)
      }
      // Cell
      else if(rangeStartCellId) {
        const nextSheetStylesSet = new Set([ ...sheetStylesSet ])
        addOrDeleteFromSet === 'ADD' ? nextSheetStylesSet.add(rangeStartCellId) : nextSheetStylesSet.delete(rangeStartCellId)
        updateSheetStyles(nextSheetStylesSet)
      }
    }
  }

  return (
    <SheetActionButton 
      icon={icon}
      marginLeft={marginLeft}
      marginRight={marginRight}
      onClick={handleButtonClick}
      tooltip={tooltip}/>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetActionCellStyleButtonProps {
  sheetId: ISheet['id']
  icon: string
  marginLeft?: string
  marginRight?: string
  tooltip: string
  sheetStylesSet: Set<string>
  updateSheetStyles(nextSheetStylesSet: Set<string>): void
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetActionCellStyleButton
