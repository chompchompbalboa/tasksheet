//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { MouseEvent, useState } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { AppState } from '@app/state'
import { ThunkDispatch } from '@app/state/types'
import { Column } from '@app/state/sheet/types'

import SheetColumnDropdown from '@app/bundles/Dropdown/SheetColumnDropdown'

//-----------------------------------------------------------------------------
// Redux
//-----------------------------------------------------------------------------
const mapStateToProps = (state: AppState) => ({
})

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
})

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetColumn = ({
  column: {
    name,
    width
  }
}: SheetColumnProps) => {

  const [ isDropdownVisible, setIsDropdownVisible ] = useState(false)
  const [ dropdownTop, setDropdownTop ] = useState(null)
  const [ dropdownLeft, setDropdownLeft ] = useState(null)

  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault()
    setDropdownTop(e.pageY)
    setDropdownLeft(e.pageX)
    setIsDropdownVisible(true)
  }

  return (
    <Container
      containerWidth={width}
      isDropdownVisible={isDropdownVisible}
      onContextMenu={(e: MouseEvent) => handleContextMenu(e)}>
      {name}
    {isDropdownVisible && 
      <SheetColumnDropdown
        dropdownTop={dropdownTop}
        dropdownLeft={dropdownLeft}
        closeDropdown={() => setIsDropdownVisible(false)}/>}
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetColumnProps {
  column: Column
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.th`
  z-index: ${ ({ isDropdownVisible }: ContainerProps ) => isDropdownVisible ? '100' : '50'};
  position: sticky;
  top: 2rem;
  width: ${ ({ containerWidth }: ContainerProps ) => containerWidth + 'px'};
  padding: 0.15rem 0 0.15rem 0.25rem;
  text-align: left;
  background-color: rgb(250, 250, 250);
  box-shadow: 0px 1px 0px 0px rgba(180,180,180,1);
`
interface ContainerProps {
  containerWidth: number
  isDropdownVisible: boolean
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SheetColumn)
