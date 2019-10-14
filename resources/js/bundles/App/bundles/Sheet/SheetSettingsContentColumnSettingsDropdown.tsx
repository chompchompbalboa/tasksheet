//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'

import { ISheetColumnTypeDropdownOption } from '@app/state/sheet/types'

//-----------------------------------------------------------------------------
// Components
//-----------------------------------------------------------------------------
const SheetSettingsContentColumnTypesDropdown = ({
  data: {
    options
  }
}: SheetSettingsContentColumnTypesDropdownProps) => {

  return (
    <Container>
      {Object.keys(options) && Object.keys(options).map(optionId => {
        const option = options[optionId]
        return (
          <DropdownOption
            key={option.id}>
            {option.value}
          </DropdownOption>
        )
      })}
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetSettingsContentColumnTypesDropdownProps {
  data: {
    options: { [id: string]: ISheetColumnTypeDropdownOption }
  }
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
`

const DropdownOption = styled.div``

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetSettingsContentColumnTypesDropdown
