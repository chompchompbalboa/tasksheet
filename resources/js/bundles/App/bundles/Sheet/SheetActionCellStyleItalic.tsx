//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { ITALIC } from '@app/assets/icons'

import { AppState } from '@app/state'
import { Sheet } from '@app/state/sheet/types'
import {
  updateSheet
} from '@app/state/sheet/actions'

import SheetActionCellStyleButton from '@app/bundles/Sheet/SheetActionCellStyleButton'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionCellStyleItalic = ({
  sheetId
}: SheetActionCellStyleItalicProps) => {
  
  const dispatch = useDispatch()
  
  const sheetStyles = useSelector((state: AppState) => state.sheet.sheets && state.sheet.sheets[sheetId] && state.sheet.sheets[sheetId].styles)
  
  const updateSheetStylesSet = (nextSheetStylesSet: Set<string>) => {
    dispatch(updateSheet(sheetId, { styles: {
      ...sheetStyles,
      italic: nextSheetStylesSet 
    }}))
  }

  return (
    <SheetActionCellStyleButton
      sheetId={sheetId}
      icon={ITALIC}
      sheetStylesSet={sheetStyles && sheetStyles.italic}
      updateSheetStylesSet={updateSheetStylesSet}/>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetActionCellStyleItalicProps {
  sheetId: Sheet['id']
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetActionCellStyleItalic
