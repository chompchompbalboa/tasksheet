//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { BOLD } from '@app/assets/icons'

import { AppState } from '@app/state'
import { ISheet } from '@app/state/sheet/types'
import {
  updateSheetStyles as updateSheetStylesAction
} from '@app/state/sheet/actions'

import SheetActionCellStyleButton from '@app/bundles/Sheet/SheetActionCellStyleButton'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionCellStyleBold = ({
  sheetId
}: SheetActionCellStyleBoldProps) => {
  
  const dispatch = useDispatch()
  
  const sheetStyles = useSelector((state: AppState) => state.sheet.allSheets && state.sheet.allSheets[sheetId] && state.sheet.allSheets[sheetId].styles)
  
  const updateSheetStylesSet = (nextSheetStylesSet: Set<string>) => {
    dispatch(updateSheetStylesAction(sheetId, {
      bold: nextSheetStylesSet 
    }))
  }

  return (
    <SheetActionCellStyleButton
      sheetId={sheetId}
      icon={BOLD}
      sheetStylesSet={sheetStyles && sheetStyles.bold}
      updateSheetStylesSet={updateSheetStylesSet}/>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetActionCellStyleBoldProps {
  sheetId: ISheet['id']
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetActionCellStyleBold
