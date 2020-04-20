//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { BOLD } from '@/assets/icons'

import { IAppState } from '@/state'
import { ISheet } from '@/state/sheet/types'
import {
  updateSheetStyles as updateSheetStylesAction
} from '@/state/sheet/actions'

import SheetActionCellStyleButton from '@desktop/Sheet/SheetActionCellStyleButton'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionCellStyleBold = ({
  sheetId
}: SheetActionCellStyleBoldProps) => {
  
  const dispatch = useDispatch()
  
  const sheetStyles = useSelector((state: IAppState) => state.sheet.allSheets && state.sheet.allSheets[sheetId] && state.sheet.allSheets[sheetId].styles)
  
  const updateSheetStyles = (nextSheetStylesSet: Set<string>) => {
    dispatch(updateSheetStylesAction(sheetId, {
      bold: nextSheetStylesSet 
    }))
  }

  return (
    <SheetActionCellStyleButton
      sheetId={sheetId}
      icon={BOLD}
      sheetStylesSet={sheetStyles && sheetStyles.bold}
      updateSheetStyles={updateSheetStyles}
      tooltip="Bold"/>
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
