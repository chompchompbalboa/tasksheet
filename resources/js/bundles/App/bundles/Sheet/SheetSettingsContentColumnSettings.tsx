//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { IAppState } from '@app/state'
import { updateSheetSettings } from '@app/state/sheetSettings/actions'
 
import SettingsColumnSettingsString from '@/bundles/App/bundles/Settings/SettingsColumnSettingsString'
import SettingsColumnSettingsNumber from '@/bundles/App/bundles/Settings/SettingsColumnSettingsNumber'
import SettingsColumnSettingsBoolean from '@/bundles/App/bundles/Settings/SettingsColumnSettingsBoolean'
import SettingsColumnSettingsDatetime from '@/bundles/App/bundles/Settings/SettingsColumnSettingsDatetime'
import SettingsColumnSettingsDropdown from '@/bundles/App/bundles/Settings/SettingsColumnSettingsDropdown'
import SettingsColumnSettingsPhotos from '@/bundles/App/bundles/Settings/SettingsColumnSettingsPhotos'
import SettingsColumnSettingsNotes from '@/bundles/App/bundles/Settings/SettingsColumnSettingsNotes'
import SettingsColumnSettingsFiles from '@/bundles/App/bundles/Settings/SettingsColumnSettingsFiles'
import SettingsContentVerticalList from '@/bundles/App/bundles/Settings/SettingsContentVerticalList'
import SettingsContentVerticalListItem from '@/bundles/App/bundles/Settings/SettingsContentVerticalListItem'
import SettingsContentContent from '@app/bundles/Settings/SettingsContentContent'

//-----------------------------------------------------------------------------
// Components
//-----------------------------------------------------------------------------
const SettingsColumnSettings = ({
}: SettingsColumnSettingsProps) => {
  
  const dispatch = useDispatch()

  const allSheetColumnTypes = useSelector((state: IAppState) => state.sheet.allSheetColumnTypes)
  const activeSheetSettingColumnSetting = useSelector((state: IAppState) => state.sheetSettings.activeSheetSettingColumnSetting)
  const columnTypeIds = Object.keys(allSheetColumnTypes)
  
  const activeColumnType = allSheetColumnTypes[activeSheetSettingColumnSetting]

  const columnTypeSettingsComponents = {
    STRING: SettingsColumnSettingsString,
    NUMBER: SettingsColumnSettingsNumber,
    BOOLEAN: SettingsColumnSettingsBoolean,
    DATETIME: SettingsColumnSettingsDatetime,
    DROPDOWN: SettingsColumnSettingsDropdown,
    PHOTOS: SettingsColumnSettingsPhotos,
    FILES: SettingsColumnSettingsFiles,
    NOTES: SettingsColumnSettingsNotes,
  }

  const ColumnTypeSettingsComponent = columnTypeSettingsComponents[activeColumnType.cellType]

  return (
    <>
      <SettingsContentVerticalList>
        {columnTypeIds.map(columnTypeId => {
          const columnType = allSheetColumnTypes[columnTypeId]
          return (
            <SettingsContentVerticalListItem
              key={columnType.id}
              name={columnType.name}
              isHighlighted={activeSheetSettingColumnSetting === columnType.id}
              onClick={() => dispatch(updateSheetSettings({ activeSheetSettingColumnSetting: columnType.id }))}/>
          )
        })}
      </SettingsContentVerticalList>
      <SettingsContentContent
        testId="SheetSettingsColumnSettings">
        <ColumnTypeSettingsComponent
          data={activeColumnType.data}/>
      </SettingsContentContent>
    </>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SettingsColumnSettingsProps {
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SettingsColumnSettings
