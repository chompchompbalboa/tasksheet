//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { COLOR } from '@app/assets/icons'

import { AppState } from '@app/state'
import { Sheet } from '@app/state/sheet/types'
import {
  updateSheet
} from '@app/state/sheet/actions'

import SheetActionCellStyleColorPicker from '@app/bundles/Sheet/SheetActionCellStyleColorPicker'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionCellStyleColor = ({
  sheetId
}: SheetActionCellStyleColorProps) => {
  
  const dispatch = useDispatch()
  
  const sheetStyles = useSelector((state: AppState) => state.sheet.sheets && state.sheet.sheets[sheetId] && state.sheet.sheets[sheetId].styles)
  
  const updateSheetStyles = (nextSheetStylesSet: Set<string>, nextSheetStylesColorReference: { [cellId: string]: string }) => {
    dispatch(updateSheet(sheetId, { styles: {
      ...sheetStyles,
      COLOR: nextSheetStylesSet,
      colorReferences: {
        ...sheetStyles.colorReferences,
        COLOR: nextSheetStylesColorReference
      }
    }}, true))
  }

  return (
    <SheetActionCellStyleColorPicker
      sheetId={sheetId}
      icon={COLOR}
      initialColor='black'
      sheetStylesSet={sheetStyles && sheetStyles.COLOR}
      sheetStylesColorReference={sheetStyles && sheetStyles.colorReferences && sheetStyles.colorReferences.COLOR}
      updateSheetStyles={updateSheetStyles}/>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetActionCellStyleColorProps {
  sheetId: Sheet['id']
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetActionCellStyleColor
