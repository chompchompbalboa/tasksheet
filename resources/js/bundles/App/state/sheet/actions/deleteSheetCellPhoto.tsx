//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { mutation } from '@app/api'

import { IAppState } from '@app/state'
import { IThunkAction, IThunkDispatch } from '@app/state/types'
import { ISheetCell, ISheetPhoto } from '@app/state/sheet/types'
import { 
  setAllSheetCellPhotos
} from '@app/state/sheet/actions'

//-----------------------------------------------------------------------------
// Delete Sheet CellPhoto
//-----------------------------------------------------------------------------
export const deleteSheetCellPhoto = (sheetCellId: ISheetCell['id'], sheetCellPhotoId: ISheetPhoto['id']): IThunkAction => {
  return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    const {
      sheet: {
        allSheetCellPhotos
      }
    } = getState()

    const nextAllSheetCellPhotos = {
      ...allSheetCellPhotos,
      [sheetCellId]: allSheetCellPhotos[sheetCellId].filter(currentSheetCellPhotoId => currentSheetCellPhotoId !== sheetCellPhotoId)
    }

    dispatch(setAllSheetCellPhotos(nextAllSheetCellPhotos))
    
    mutation.deleteSheetCellPhoto(sheetCellPhotoId)
  }
}