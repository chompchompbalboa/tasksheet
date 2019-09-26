//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import { SheetColumn, IAllSheetColumns } from '@app/state/sheet/types'

import SheetCreateRowInput from '@app/bundles/Sheet/SheetCreateRowInput'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetCreateRow = ({
  columns,
  visibleColumns
}: SheetCreateRowProps) => {

  const [ isVisible, setIsVisible ] = useState(false)

  useEffect(() => {
    if(isVisible) { 
      removeEventListener('keypress', listenForDoublePlusSignPress)
      addEventListener('keypress', listenForEscapePress) 
    }
    else { 
      removeEventListener('keypress', listenForEscapePress)
      addEventListener('keypress', listenForDoublePlusSignPress) 
    }
    return () => {
      removeEventListener('keypress', listenForDoublePlusSignPress)
      removeEventListener('keypress', listenForEscapePress)
    }
  }, [])

  const [ firstPlusSignPress, setFirstPlusSignPress ] = useState(null)
  const listenForDoublePlusSignPress = (e: KeyboardEvent) => {
    console.log(e.key)
    if(e.key === "+") {
      const timestamp = Date.now()
      if(firstPlusSignPress === null) {
        setFirstPlusSignPress(timestamp)
      }
      else {
        const isTimestampExpired = (timestamp.valueOf() - firstPlusSignPress.valueOf()) > 250
        if(isTimestampExpired) {
          setFirstPlusSignPress(timestamp)
        }
        else {
          setIsVisible(true)
        }
      } 
    }
  }

  const listenForEscapePress = (e: KeyboardEvent) => {
    console.log(e.key)
    console.log('listenForEscapePress')
  }
  
  return (
    <Container
      isVisible={isVisible}>
      {visibleColumns.map(columnId => {
        const column = columns[columnId]
        return (
          <SheetCreateRowInput
            key={columnId}
            column={column}/>
        )
      })}
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetCreateRowProps {
  columns: IAllSheetColumns
  visibleColumns: SheetColumn['id'][]
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  display: ${ ({ isVisible }: ContainerProps ) => isVisible ? 'block' : 'none'};
`
interface ContainerProps {
  isVisible: boolean
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetCreateRow
