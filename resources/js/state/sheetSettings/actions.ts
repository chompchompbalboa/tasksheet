//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { ISheetSettingsUpdates } from '@/state/sheetSettings/types'

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------
export type ISheetSettingsActions = IUpdateSheetSettings

//-----------------------------------------------------------------------------
// Update SheetSettings
//-----------------------------------------------------------------------------
export const UPDATE_SHEET_SETTINGS = 'UPDATE_SHEET_SETTINGS'
interface IUpdateSheetSettings {
  type: typeof UPDATE_SHEET_SETTINGS
  updates: ISheetSettingsUpdates
}

export const updateSheetSettings = (updates: ISheetSettingsUpdates): ISheetSettingsActions => {
	return {
    type: UPDATE_SHEET_SETTINGS,
    updates
	}
}