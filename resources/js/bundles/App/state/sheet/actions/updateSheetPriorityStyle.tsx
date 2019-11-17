//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { IThunkAction, IThunkDispatch } from '@app/state/types'
import { ISheet, ISheetPriority } from '@app/state/sheet/types'

import { IAppState } from '@app/state'

import { 
  updateSheetPriority
} from '@app/state/sheet/actions'

//-----------------------------------------------------------------------------
// Update Sheet Priority
//-----------------------------------------------------------------------------
export const updateSheetPriorityStyle = (sheetId: ISheet['id'], sheetPriorityId: ISheetPriority['id']): IThunkAction => {
	return async (dispatch: IThunkDispatch, getState: () => IAppState) => {

    const {
      allSheets: {
        [sheetId]: sheet
      }
    } = getState().sheet
    
    const sheetSelectedCellId = sheet.selections.rangeStartCellId

    if(sheetSelectedCellId) {

      const sheetPriorityUpdates = {
        backgroundColor: sheet.styles.backgroundColor.has(sheetSelectedCellId) ? sheet.styles.backgroundColorReference[sheetSelectedCellId] : 'transparent',
        color: sheet.styles.color.has(sheetSelectedCellId) ? sheet.styles.colorReference[sheetSelectedCellId] : 'black',
      }

      dispatch(updateSheetPriority(sheetPriorityId, sheetPriorityUpdates))
    }
	}
}