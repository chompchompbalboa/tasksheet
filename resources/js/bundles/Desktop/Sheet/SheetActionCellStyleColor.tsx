//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { COLOR } from '@/assets/icons'

import { IAppState } from '@/state'
import { ISheet } from '@/state/sheet/types'
import {
  updateSheetStyles as updateSheetStylesAction
} from '@/state/sheet/actions'

import SheetActionCellStyleColorPicker from '@desktop/Sheet/SheetActionCellStyleColorPicker'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionCellStyleColor = ({
  sheetId
}: SheetActionCellStyleColorProps) => {
  
  const dispatch = useDispatch()
  
  const sheetStyles = useSelector((state: IAppState) => state.sheet.allSheets && state.sheet.allSheets[sheetId] && state.sheet.allSheets[sheetId].styles)
  
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
      isBeforeDivider={true}
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
