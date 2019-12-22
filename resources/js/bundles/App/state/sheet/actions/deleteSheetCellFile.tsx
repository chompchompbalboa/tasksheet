//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { mutation } from '@app/api'

import { IAppState } from '@app/state'
import { IThunkAction, IThunkDispatch } from '@app/state/types'
import { ISheetCell, ISheetFile } from '@app/state/sheet/types'
import { 
  setAllSheetCellFiles
} from '@app/state/sheet/actions'

//-----------------------------------------------------------------------------
// Delete Sheet CellFile
//-----------------------------------------------------------------------------
export const deleteSheetCellFile = (sheetCellId: ISheetCell['id'], sheetCellFileId: ISheetFile['id']): IThunkAction => {
  return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    const {
      sheet: {
        allSheetCellFiles
      }
    } = getState()

    const nextAllSheetCellFiles = {
      ...allSheetCellFiles,
      [sheetCellId]: allSheetCellFiles[sheetCellId].filter(currentSheetCellFileId => currentSheetCellFileId !== sheetCellFileId)
    }

    dispatch(setAllSheetCellFiles(nextAllSheetCellFiles))
    
    mutation.deleteSheetCellFile(sheetCellFileId)
  }
}