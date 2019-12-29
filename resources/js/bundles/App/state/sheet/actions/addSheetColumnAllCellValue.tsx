//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { IAppState } from '@app/state'
import { IThunkAction, IThunkDispatch } from '@app/state/types'
import { 
  ISheetColumn
} from '@app/state/sheet/types'

import { 
  updateSheetColumn
} from '@app/state/sheet/actions'

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