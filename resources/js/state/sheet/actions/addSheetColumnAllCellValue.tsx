//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { IAppState } from '@/state'
import { IThunkAction, IThunkDispatch } from '@/state/types'
import { 
  ISheetColumn
} from '@/state/sheet/types'

import { 
  updateSheetColumn
} from '@/state/sheet/actions'

//-----------------------------------------------------------------------------
// Update Sheet Cell
//-----------------------------------------------------------------------------
export const addSheetColumnAllCellValue = (columnId: ISheetColumn['id'], value: string): IThunkAction => {
	return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    const {
      allSheetColumns: {
        [columnId]: {
          allCellValues: sheetColumnAllCellValues
        }
      }
    } = getState().sheet

    const nextSheetColumnAllCellValues = new Set([ ...sheetColumnAllCellValues, value ])

    dispatch(updateSheetColumn(columnId, { allCellValues: nextSheetColumnAllCellValues }, null, true))
	}
}