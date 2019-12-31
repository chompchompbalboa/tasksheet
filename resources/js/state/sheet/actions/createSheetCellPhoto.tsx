//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { IAppState } from '@/state'
import { IThunkAction, IThunkDispatch } from '@/state/types'
import { ISheetCell, ISheetPhoto } from '@/state/sheet/types'
import { 
  setAllSheetCellPhotos,
  setAllSheetPhotos,
} from '@/state/sheet/actions'

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