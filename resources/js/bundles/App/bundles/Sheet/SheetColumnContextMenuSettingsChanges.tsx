//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { CHECKMARK } from '@app/assets/icons'

import { IAppState } from '@app/state'
import { 
  ISheetColumn
} from '@app/state/sheet/types'
import {
  updateSheetColumn
} from '@app/state/sheet/actions'

import ContextMenuItem from '@app/bundles/ContextMenu/ContextMenuItem'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
export const SheetColumnContextMenuSettings = ({
  columnId,
}: ISheetColumnContextMenuSettingsProps) => {

  // Redux
  const dispatch = useDispatch()
  const sheetColumnTrackCellChanges = useSelector((state: IAppState) => state.sheet.allSheetColumns && state.sheet.allSheetColumns[columnId] && state.sheet.allSheetColumns[columnId].trackCellChanges)
  const sheetColumnShowCellChanges = useSelector((state: IAppState) => state.sheet.allSheetColumns && state.sheet.allSheetColumns[columnId] && state.sheet.allSheetColumns[columnId].showCellChanges)

  // State
  const [ trackCellChanges, setTrackCellChanges ] = useState(sheetColumnTrackCellChanges)
  const [ showCellChanges, setShowCellChanges ] = useState(sheetColumnShowCellChanges)

  // Effects
  useEffect(() => {
    let updateSheetColumnTimer: number = null
    if(trackCellChanges !== sheetColumnTrackCellChanges || showCellChanges !== sheetColumnShowCellChanges) {
      clearTimeout(updateSheetColumnTimer)
      updateSheetColumnTimer = setTimeout(() => {
        dispatch(updateSheetColumn(columnId, { 
          trackCellChanges: trackCellChanges,
          showCellChanges: showCellChanges 
        } ))
      }, 50)
    }
    return () => clearTimeout(updateSheetColumnTimer)
  }, [ trackCellChanges, showCellChanges ])

  // Render
  return (
    <>
    <ContextMenuItem
      logo={trackCellChanges ? CHECKMARK : null}
      onClick={() => setTrackCellChanges(!trackCellChanges)}
      text="Track Cell Changes"/>
    {trackCellChanges 
      ? <ContextMenuItem
          logo={showCellChanges ? CHECKMARK : null}
          onClick={() => setShowCellChanges(!showCellChanges)}
          text="Show Cell Changes"/>
      : null
    }
    </>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
export interface ISheetColumnContextMenuSettingsProps {
  columnId: ISheetColumn['id']
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetColumnContextMenuSettings
