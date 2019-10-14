//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { IAppState } from '@app/state'
import { updateSheetSettings } from '@app/state/sheetSettings/actions'
 
import SheetSettingsContentColumnSettingsString from '@/bundles/App/bundles/Sheet/SheetSettingsContentColumnSettingsString'
import SheetSettingsContentColumnSettingsNumber from '@/bundles/App/bundles/Sheet/SheetSettingsContentColumnSettingsNumber'
import SheetSettingsContentColumnSettingsBoolean from '@/bundles/App/bundles/Sheet/SheetSettingsContentColumnSettingsBoolean'
import SheetSettingsContentColumnSettingsDatetime from '@/bundles/App/bundles/Sheet/SheetSettingsContentColumnSettingsDatetime'
import SheetSettingsContentColumnSettingsDropdown from '@/bundles/App/bundles/Sheet/SheetSettingsContentColumnSettingsDropdown'
import SheetSettingsContentColumnSettingsPhotos from '@/bundles/App/bundles/Sheet/SheetSettingsContentColumnSettingsPhotos'
import SheetSettingsContentColumnSettingsFiles from '@/bundles/App/bundles/Sheet/SheetSettingsContentColumnSettingsFiles'
import SheetSettingsContentVerticalList from '@/bundles/App/bundles/Sheet/SheetSettingsContentVerticalList'
import SheetSettingsContentVerticalListItem from '@/bundles/App/bundles/Sheet/SheetSettingsContentVerticalListItem'
import SheetSettingsContentContent from '@app/bundles/Sheet/SheetSettingsContentContent'

//-----------------------------------------------------------------------------
// Components
//-----------------------------------------------------------------------------
const SheetSettingsContentColumnSettings = ({
}: SheetSettingsContentColumnSettingsProps) => {
  
  const dispatch = useDispatch()

  const allSheetColumnTypes = useSelector((state: IAppState) => state.sheet.allSheetColumnTypes)
  const activeSheetSettingColumnSetting = useSelector((state: IAppState) => state.sheetSettings.activeSheetSettingColumnSetting)
  const columnTypeIds = Object.keys(allSheetColumnTypes)
  
  const activeColumnType = allSheetColumnTypes[activeSheetSettingColumnSetting]

  const columnTypeSettingsComponents = {
    STRING: SheetSettingsContentColumnSettingsString,
    NUMBER: SheetSettingsContentColumnSettingsNumber,
    BOOLEAN: SheetSettingsContentColumnSettingsBoolean,
    DATETIME: SheetSettingsContentColumnSettingsDatetime,
    DROPDOWN: SheetSettingsContentColumnSettingsDropdown,
    PHOTOS: SheetSettingsContentColumnSettingsPhotos,
    FILES: SheetSettingsContentColumnSettingsFiles,
  }

  const ColumnTypeSettingsComponent = columnTypeSettingsComponents[activeColumnType.cellType]

  return (
    <>
      <SheetSettingsContentVerticalList>
        {columnTypeIds.map(columnTypeId => {
          const columnType = allSheetColumnTypes[columnTypeId]
          return (
            <SheetSettingsContentVerticalListItem
              key={columnType.id}
              name={columnType.name}
              isHighlighted={activeSheetSettingColumnSetting === columnType.id}
              onClick={() => dispatch(updateSheetSettings({ activeSheetSettingColumnSetting: columnType.id }))}/>
          )
        })}
      </SheetSettingsContentVerticalList>
      <SheetSettingsContentContent
        testId="SheetSettingsColumnSettings">
        <ColumnTypeSettingsComponent
          data={activeColumnType.data}/>
      </SheetSettingsContentContent>
    </>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetSettingsContentColumnSettingsProps {
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetSettingsContentColumnSettings
