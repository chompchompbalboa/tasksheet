//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { IAppState } from '@app/state'
import { IThunkAction, IThunkDispatch } from '@app/state/types'
import { ISheetCell, ISheetPhoto } from '@app/state/sheet/types'
import { 
  setAllSheetCellPhotos,
  setAllSheetPhotos,
} from '@app/state/sheet/actions'

//-----------------------------------------------------------------------------
// Create Sheet CellPhoto
//-----------------------------------------------------------------------------
export const createSheetCellPhoto = (
  cellId: ISheetCell['id'],
  newSheetCellPhoto: ISheetPhoto
): IThunkAction => {
  return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    const {
      sheet: {
        allSheetCellPhotos,
        allSheetPhotos
      }
    } = getState()

    const nextAllSheetPhotos = {
      ...allSheetPhotos,
      [newSheetCellPhoto.id]: newSheetCellPhoto
    }

    const nextAllSheetCellPhotos = {
      ...allSheetCellPhotos,
      [cellId]: [
        newSheetCellPhoto.id,
        ...(allSheetCellPhotos[cellId] || [])
      ]
    }

    dispatch(setAllSheetPhotos(nextAllSheetPhotos))    
    dispatch(setAllSheetCellPhotos(nextAllSheetCellPhotos))
  }
}