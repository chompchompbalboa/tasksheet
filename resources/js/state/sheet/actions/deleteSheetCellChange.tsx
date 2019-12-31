//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { mutation } from '@/api'

import { IAppState } from '@/state'
import { IThunkAction, IThunkDispatch } from '@/state/types'
import { ISheetCell, ISheetChange } from '@/state/sheet/types'
import { 
  setAllSheetCellChanges
} from '@/state/sheet/actions'

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