//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { PHOTOS } from '@app/assets/icons'

import { SheetColumnType } from '@app/state/sheet/types'

import Icon from '@/components/Icon'
import SheetCellContainer from '@app/bundles/Sheet/SheetCellContainer'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetCellPhotos = ({
  cellId,
  ...passThroughProps
}: SheetCellPhotosProps) => {

  // Refs
  const container = useRef(null)

  // State
  const [ isPhotosVisible, setIsPhotosVisible ] = useState(localStorage.getItem('sheetCellPhotosIsVisible') === cellId)

  useEffect(() => {
    if(isPhotosVisible) { addEventListener('click', closeOnClickOutside) }
    else { removeEventListener('click', closeOnClickOutside) }
    return () => removeEventListener('click', closeOnClickOutside)
  }, [ isPhotosVisible ])
  useEffect(() => {
    return () => {
      setIsPhotosVisible(false)
      localStorage.setItem('sheetCellPhotosIsVisible', null)
    }
  }, [])

  const closeOnClickOutside = (e: MouseEvent) => {
    if(!container.current.contains(e.target)) {
      setIsPhotosVisible(false)
      localStorage.setItem('sheetCellPhotosIsVisible', null)
    }
  }

  const handleContainerClick = () => {
    setIsPhotosVisible(true)
    localStorage.setItem('sheetCellPhotosIsVisible', cellId)
  }

  return (
    <SheetCellContainer
      cellId={cellId}
      focusCell={() => null}
      onlyRenderChildren
      updateCellValue={() => null}
      value={null}
      {...passThroughProps}>
      <Container
        ref={container}
        onClick={() => handleContainerClick()}>
        <IconContainer>
          <Icon 
            icon={PHOTOS}
            size="18px"/>
        </IconContainer>
        <PhotosContainer
          isPhotosVisible={isPhotosVisible}>
        </PhotosContainer>
      </Container>
    </SheetCellContainer>
  )

}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetCellPhotosProps {
  cellId: string
  columnType: SheetColumnType
  isCellSelected: boolean
  updateCellValue(nextCellValue: string): void
  updateSheetSelectedCell(cellId: string, moveSelectedCellDirection: 'UP' | 'RIGHT' | 'DOWN' | 'LEFT'): void
  value: string
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  z-index: 10;
  width: 100%;
  height: 100%;
`

const IconContainer = styled.div`
  cursor: pointer;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgb(100, 100, 100);
  &:hover {
    color: rgb(60, 60, 60);
  }
`

const PhotosContainer = styled.div`
  display: ${ ({ isPhotosVisible }: IPhotosContainer ) => isPhotosVisible ? 'block' : 'none' };
  position: absolute;
  top: calc(100% + 2.5px);
  left: -4px;
  background-color: white;
  height: 75vh;
  width: 50vw;
  border-radius: 10px;
  border-top-left-radius: 0;
  box-shadow: 1px 1px 10px 0px rgba(0,0,0,0.5);
`
interface IPhotosContainer {
  isPhotosVisible: boolean
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetCellPhotos
