//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { mutation } from '@/api'

import { IAppState } from '@/state'
import { IThunkAction, IThunkDispatch } from '@/state/types'
import { ISheetCell, ISheetPhoto } from '@/state/sheet/types'
import { 
  setAllSheetCellPhotos
} from '@/state/sheet/actions'

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