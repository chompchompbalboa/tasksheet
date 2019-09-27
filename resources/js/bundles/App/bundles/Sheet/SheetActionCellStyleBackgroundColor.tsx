//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { BACKGROUND_COLOR } from '@app/assets/icons'

import { AppState } from '@app/state'
import { ISheet } from '@app/state/sheet/types'
import {
  updateSheetStyles as updateSheetStylesAction
} from '@app/state/sheet/actions'

import SheetActionCellStyleColorPicker from '@app/bundles/Sheet/SheetActionCellStyleColorPicker'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionCellStyleBackgroundColor = ({
  sheetId
}: SheetActionCellStyleBackgroundColorProps) => {
  
  const dispatch = useDispatch()
  
  const sheetStyles = useSelector((state: AppState) => state.sheet.allSheets && state.sheet.allSheets[sheetId] && state.sheet.allSheets[sheetId].styles)
  
  const updateSheetStyles = (nextSheetStylesSet: Set<string>, nextSheetStylesColorReference: { [cellId: string]: string }) => {
    dispatch(updateSheetStylesAction(sheetId, {
      backgroundColor: nextSheetStylesSet,
      backgroundColorReference: nextSheetStylesColorReference
    }))
  }

  return (
    <SheetActionCellStyleColorPicker
      sheetId={sheetId}
      icon={BACKGROUND_COLOR}
      initialColor='rgba(0, 0, 0, 0.125)'
      sheetStylesSet={sheetStyles && sheetStyles.backgroundColor}
      sheetStylesColorReference={sheetStyles && sheetStyles.backgroundColorReference}
      updateSheetStyles={updateSheetStyles}/>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetActionCellStyleBackgroundColorProps {
  sheetId: ISheet['id']
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetActionCellStyleBackgroundColor
