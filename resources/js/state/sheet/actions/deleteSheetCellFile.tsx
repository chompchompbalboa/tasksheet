//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { mutation } from '@/api'

import { IAppState } from '@/state'
import { IThunkAction, IThunkDispatch } from '@/state/types'
import { ISheetCell, ISheetFile } from '@/state/sheet/types'
import { 
  setAllSheetCellFiles
} from '@/state/sheet/actions'

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