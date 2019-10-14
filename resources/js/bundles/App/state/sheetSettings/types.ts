export type ISheetSettingsActiveSheetSettings = 'COLUMN_SETTINGS'

export interface ISheetSettingsUpdates {
  activeSheetSetting?: ISheetSettingsActiveSheetSettings
  activeSheetSettingColumnSetting?: string
}