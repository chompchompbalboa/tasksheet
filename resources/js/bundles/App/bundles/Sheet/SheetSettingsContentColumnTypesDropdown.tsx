//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'

import { SheetColumnTypeDropdownOption } from '@app/state/sheet/types'

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
      {options && options.map(option => (
        <DropdownOption
          key={option.id}>
          {option.value}
        </DropdownOption>
      ))}
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetSettingsContentColumnTypesDropdownProps {
  data: {
    options: SheetColumnTypeDropdownOption[]
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
