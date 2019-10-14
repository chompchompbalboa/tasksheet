//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { ISheetSettingsActiveSheetSettings } from '@app/state/sheetSettings/types'
import { 
  ISheetSettingsActions,
  UPDATE_SHEET_SETTINGS
} from '@app/state/sheetSettings/actions'

//-----------------------------------------------------------------------------
// Initial State
//-----------------------------------------------------------------------------
export const initialSheetSettingsState: ISheetSettingsState = {
  activeSheetSetting: 'COLUMN_SETTINGS',
  activeSheetSettingColumnSetting: 'STRING'
}
export interface ISheetSettingsState {
  activeSheetSetting: ISheetSettingsActiveSheetSettings
  activeSheetSettingColumnSetting: string
}

//-----------------------------------------------------------------------------
// Reducers
//-----------------------------------------------------------------------------
export const userReducer = (state = initialSheetSettingsState, action: ISheetSettingsActions): ISheetSettingsState => {
	switch (action.type) {
      
    case UPDATE_SHEET_SETTINGS: {
      const { updates } = action
      return { ...state, ...updates }
    }
      
		default:
			return state
	}
}

export default userReducer
