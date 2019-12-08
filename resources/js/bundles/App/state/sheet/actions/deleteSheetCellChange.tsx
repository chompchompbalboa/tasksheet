//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { mutation } from '@app/api'

import { IAppState } from '@app/state'
import { IThunkAction, IThunkDispatch } from '@app/state/types'
import { ISheetCell, ISheetChange } from '@app/state/sheet/types'
import { 
  setAllSheetCellChanges
} from '@app/state/sheet/actions'

//-----------------------------------------------------------------------------
// Delete Sheet CellChange
//-----------------------------------------------------------------------------
export const deleteSheetCellChange = (sheetCellId: ISheetCell['id'], sheetCellChangeId: ISheetChange['id']): IThunkAction => {
  return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    const {
      sheet: {
        allSheetCellChanges
      }
    } = getState()
    
    const nextAllSheetCellChanges = {
      ...allSheetCellChanges,
      [sheetCellId]: allSheetCellChanges[sheetCellId].filter(currentSheetCellChangeId => currentSheetCellChangeId !== sheetCellChangeId)
    }
    
    dispatch(setAllSheetCellChanges(nextAllSheetCellChanges))
    
    mutation.deleteSheetCellChange(sheetCellChangeId)
  }
}