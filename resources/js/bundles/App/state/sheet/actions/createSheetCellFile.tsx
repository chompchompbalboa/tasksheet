//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { IAppState } from '@app/state'
import { IThunkAction, IThunkDispatch } from '@app/state/types'
import { ISheetCell, ISheetFile } from '@app/state/sheet/types'
import { 
  setAllSheetCellFiles,
  setAllSheetFiles,
} from '@app/state/sheet/actions'

//-----------------------------------------------------------------------------
// Create Sheet CellFile
//-----------------------------------------------------------------------------
export const createSheetCellFile = (
  cellId: ISheetCell['id'],
  newSheetCellFile: ISheetFile
): IThunkAction => {
  return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    const {
      sheet: {
        allSheetCellFiles,
        allSheetFiles
      }
    } = getState()

    const nextAllSheetFiles = {
      ...allSheetFiles,
      [newSheetCellFile.id]: newSheetCellFile
    }

    const nextAllSheetCellFiles = {
      ...allSheetCellFiles,
      [cellId]: [
        ...(allSheetCellFiles[cellId] || []),
        newSheetCellFile.id
      ]
    }

    dispatch(setAllSheetFiles(nextAllSheetFiles))    
    dispatch(setAllSheetCellFiles(nextAllSheetCellFiles))
  }
}