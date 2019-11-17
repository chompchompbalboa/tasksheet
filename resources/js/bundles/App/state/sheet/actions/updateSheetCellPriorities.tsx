//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { IThunkAction, IThunkDispatch } from '@app/state/types'
import { ISheet, ISheetPriority } from '@app/state/sheet/types'

import { IAppState } from '@app/state'

import { 
  updateSheetStyles
} from '@app/state/sheet/actions'

//-----------------------------------------------------------------------------
// Update Sheet Priority
//-----------------------------------------------------------------------------
export const updateSheetCellPriorities = (sheetId: ISheet['id'], sheetPriorityId: ISheetPriority['id']): IThunkAction => {
	return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    const {
      allSheets: {
        [sheetId]: {
          selections: sheetSelections,
          styles: sheetStyles
        }
      },
      allSheetPriorities
    } = getState().sheet
      
    const nextSheetStylesBackgroundColor = new Set(sheetStyles.backgroundColor)
    const nextSheetStylesBackgroundColorReference = { ...sheetStyles.backgroundColorReference }
    const nextSheetStylesColor = new Set(sheetStyles.color)
    const nextSheetStylesColorReference = { ...sheetStyles.colorReference }

    if(sheetPriorityId) {

      const sheetPriority = allSheetPriorities[sheetPriorityId]
  
      nextSheetStylesBackgroundColor.add(sheetSelections.rangeStartCellId)
      nextSheetStylesBackgroundColorReference[sheetSelections.rangeStartCellId] = sheetPriority.backgroundColor
      nextSheetStylesColor.add(sheetSelections.rangeStartCellId)
      nextSheetStylesColorReference[sheetSelections.rangeStartCellId] = sheetPriority.color
  
      sheetSelections.rangeCellIds.forEach(sheetCellId => {
        nextSheetStylesBackgroundColor.add(sheetCellId)
        nextSheetStylesBackgroundColorReference[sheetCellId] = sheetPriority.backgroundColor
        nextSheetStylesColor.add(sheetCellId)
        nextSheetStylesColorReference[sheetCellId] = sheetPriority.color
      })
  
      dispatch(updateSheetStyles(sheetId, {
        ...sheetStyles,
        backgroundColor: nextSheetStylesBackgroundColor,
        backgroundColorReference: nextSheetStylesBackgroundColorReference
      }))
    }
    else {
      nextSheetStylesBackgroundColor.delete(sheetSelections.rangeStartCellId)
  
      sheetSelections.rangeCellIds.forEach(sheetCellId => {
        nextSheetStylesBackgroundColor.delete(sheetCellId)
      })
  
      dispatch(updateSheetStyles(sheetId, {
        ...sheetStyles,
        backgroundColor: nextSheetStylesBackgroundColor,
        backgroundColorReference: nextSheetStylesBackgroundColorReference
      }))
    }

	}
}