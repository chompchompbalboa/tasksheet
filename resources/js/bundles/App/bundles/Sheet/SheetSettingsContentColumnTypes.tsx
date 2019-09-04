//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import { AppState } from '@app/state'
 
import SheetSettingsContentColumnTypesString from '@/bundles/App/bundles/Sheet/SheetSettingsContentColumnTypesString'
import SheetSettingsContentColumnTypesNumber from '@/bundles/App/bundles/Sheet/SheetSettingsContentColumnTypesNumber'
import SheetSettingsContentColumnTypesBoolean from '@/bundles/App/bundles/Sheet/SheetSettingsContentColumnTypesBoolean'
import SheetSettingsContentColumnTypesDatetime from '@/bundles/App/bundles/Sheet/SheetSettingsContentColumnTypesDatetime'
import SheetSettingsContentColumnTypesDropdown from '@/bundles/App/bundles/Sheet/SheetSettingsContentColumnTypesDropdown'
import SheetSettingsContentColumnTypesPhotos from '@/bundles/App/bundles/Sheet/SheetSettingsContentColumnTypesPhotos'
import SheetSettingsContentColumnTypesFiles from '@/bundles/App/bundles/Sheet/SheetSettingsContentColumnTypesFiles'
import SheetSettingsContentVerticalList from '@/bundles/App/bundles/Sheet/SheetSettingsContentVerticalList'
import SheetSettingsContentVerticalListItem from '@/bundles/App/bundles/Sheet/SheetSettingsContentVerticalListItem'
import SheetSettingsContentContent from '@app/bundles/Sheet/SheetSettingsContentContent'

//-----------------------------------------------------------------------------
// Components
//-----------------------------------------------------------------------------
const SheetSettingsContentColumnTypes = ({
}: SheetSettingsContentColumnTypesProps) => {

  const columnTypes = useSelector((state: AppState) => state.sheet.columnTypes)
  const columnTypeIds = Object.keys(columnTypes)

  const [ activeColumnTypeId, setActiveColumnTypeId ] = useState(columnTypeIds[0])
  const activeColumnType = columnTypes[activeColumnTypeId]

  const columnTypeSettingsComponents = {
    STRING: SheetSettingsContentColumnTypesString,
    NUMBER: SheetSettingsContentColumnTypesNumber,
    BOOLEAN: SheetSettingsContentColumnTypesBoolean,
    DATETIME: SheetSettingsContentColumnTypesDatetime,
    DROPDOWN: SheetSettingsContentColumnTypesDropdown,
    PHOTOS: SheetSettingsContentColumnTypesPhotos,
    FILES: SheetSettingsContentColumnTypesFiles,
  }

  const ColumnTypeSettingsComponent = columnTypeSettingsComponents[activeColumnType.cellType]

  return (
    <>
      <SheetSettingsContentVerticalList>
        {columnTypeIds.map(columnTypeId => {
          const columnType = columnTypes[columnTypeId]
          return (
            <SheetSettingsContentVerticalListItem
              key={columnType.id}
              name={columnType.name}
              isHighlighted={activeColumnTypeId === columnType.id}
              onClick={() => setActiveColumnTypeId(columnType.id)}/>
          )
        })}
      </SheetSettingsContentVerticalList>
      <SheetSettingsContentContent>
        <ColumnTypeSettingsComponent
          data={activeColumnType.data}/>
      </SheetSettingsContentContent>
    </>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetSettingsContentColumnTypesProps {
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetSettingsContentColumnTypes
