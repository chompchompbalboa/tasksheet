//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { COLOR } from '@app/assets/icons'

import { AppState } from '@app/state'
import { ISheet } from '@app/state/sheet/types'
import {
  updateSheetStyles as updateSheetStylesAction
} from '@app/state/sheet/actions'

import SheetActionCellStyleColorPicker from '@app/bundles/Sheet/SheetActionCellStyleColorPicker'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionCellStyleColor = ({
  sheetId
}: SheetActionCellStyleColorProps) => {
  
  const dispatch = useDispatch()
  
  const sheetStyles = useSelector((state: AppState) => state.sheet.allSheets && state.sheet.allSheets[sheetId] && state.sheet.allSheets[sheetId].styles)
  
  const updateSheetStyles = (nextSheetStylesSet: Set<string>, nextSheetStylesColorReference: { [cellId: string]: string }) => {
    dispatch(updateSheetStylesAction(sheetId, {
      color: nextSheetStylesSet,
      colorReference: nextSheetStylesColorReference,
    }))
  }

  return (
    <SheetActionCellStyleColorPicker
      sheetId={sheetId}
      icon={COLOR}
      initialColor='black'
      sheetStylesSet={sheetStyles && sheetStyles.color}
      sheetStylesColorReference={sheetStyles && sheetStyles.colorReference}
      updateSheetStyles={updateSheetStyles}/>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetActionCellStyleColorProps {
  sheetId: ISheet['id']
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetActionCellStyleColor
