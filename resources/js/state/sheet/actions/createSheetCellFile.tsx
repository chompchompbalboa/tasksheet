//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { IAppState } from '@/state'
import { IThunkAction, IThunkDispatch } from '@/state/types'
import { ISheetCell, ISheetFile } from '@/state/sheet/types'
import { 
  setAllSheetCellFiles,
  setAllSheetFiles,
} from '@/state/sheet/actions'

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