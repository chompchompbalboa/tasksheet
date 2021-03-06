//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { mutation } from '@/api'

import { IAppState } from '@/state'
import { IThunkAction, IThunkDispatch } from '@/state/types'
import { 
  ISheet, 
  ISheetStylesUpdates, ISheetStylesDatabaseUpdates
} from '@/state/sheet/types'

import { updateSheet } from '@/state/sheet/actions'
import { createHistoryStep } from '@/state/history/actions'

//-----------------------------------------------------------------------------
// Update Sheet Styles
//-----------------------------------------------------------------------------
export const updateSheetStyles = (sheetId: ISheet['id'], updates: ISheetStylesUpdates, skipHistoryStep: boolean = false): IThunkAction => {	
  return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    
    const {
      allSheets
    } = getState().sheet
    
    const sheet = allSheets[sheetId]
    
    const convertUpdatesToDatabaseUpdates = (updatesToConvert: ISheetStylesUpdates) => {
      const databaseUpdates: any = {}
      Object.entries(updatesToConvert).forEach(([key, update]) => {
        if(update instanceof Set) {
          databaseUpdates[key] = [ ...update ]
        }
        else {
          databaseUpdates[key] = update
        }
      })
      return databaseUpdates as ISheetStylesDatabaseUpdates
    }
    
    // Actions database updates
    const actionsDatabaseUpdates: ISheetStylesDatabaseUpdates = convertUpdatesToDatabaseUpdates(updates)
    
    // Undo actions database updates
    const undoActionsDatabaseUpdates: ISheetStylesDatabaseUpdates = convertUpdatesToDatabaseUpdates(sheet.styles as ISheetStylesUpdates)
    
    const actions = () => {
      dispatch(updateSheet(sheetId, { styles: { ...sheet.styles, ...updates }}, true))
      mutation.updateSheetStyles(sheet.styles.id, actionsDatabaseUpdates)
    }

    const undoActions = () => {
      dispatch(updateSheet(sheetId, { styles: sheet.styles }, true))
      mutation.updateSheetStyles(sheet.styles.id, undoActionsDatabaseUpdates)
    }

    !skipHistoryStep && dispatch(createHistoryStep({ actions, undoActions }))

    actions()
	}
}