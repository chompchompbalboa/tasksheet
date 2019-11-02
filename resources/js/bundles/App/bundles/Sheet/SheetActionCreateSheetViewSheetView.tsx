//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { CLOSE } from '@app/assets/icons'

import { IAppState } from '@app/state'
import { ISheet, ISheetView } from '@app/state/sheet/types'
import { 
  allowSelectedCellEditing,
  allowSelectedCellNavigation,
  preventSelectedCellEditing,
  preventSelectedCellNavigation,
  deleteSheetView,
  loadSheetView,
  updateSheetView 
} from '@app/state/sheet/actions'

import AutosizeInput from 'react-input-autosize'
import Icon from '@/components/Icon'
//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionCreateSheetViewSheetView = ({
  sheetId,
  sheetViewId,
  closeDropdown
}: ISheetActionCreateSheetViewSheetViewProps) => {

  const sheetViewNameInput = useRef(null)

  const dispatch = useDispatch()

  const sheetActiveSheetViewId = useSelector((state: IAppState) => state.sheet.allSheets && state.sheet.allSheets[sheetId] && state.sheet.allSheets[sheetId].activeSheetViewId)
  const sheetViews = useSelector((state: IAppState) => state.sheet.allSheets && state.sheet.allSheets[sheetId] && state.sheet.allSheets[sheetId].views)
  const sheetView = useSelector((state: IAppState) => state.sheet.allSheetViews && state.sheet.allSheetViews[sheetViewId])
  const userColorPrimary = useSelector((state: IAppState) => state.user.color.primary)
  
  const isActiveSheetView = sheetView.id === sheetActiveSheetViewId

  const [ sheetViewName, setSheetViewName ] = useState(sheetView.name)
  useEffect(() => { 
    sheetViewNameInput && sheetViewNameInput.current && sheetViewNameInput.current.focus()
    setSheetViewName(sheetView.name) 
    if(sheetView.name === null) {
      addEventListener('keydown', handleKeydownWhileRenaming)
    }
    return () => {
      removeEventListener('keydown', handleKeydownWhileRenaming)
    }
  }, [ sheetView.name ])

  const handleNameContainerClick = () => {
    closeDropdown()
    dispatch(loadSheetView(sheetId, sheetView.id))
  }

  const handleKeydownWhileRenaming = (e: KeyboardEvent) => {
    if(e.key === 'Enter') {
      sheetViewNameInput.current.blur()
    }
  }

  const handleSheetViewNameInputBlur = () => {
    dispatch(allowSelectedCellEditing(sheetId))
    dispatch(allowSelectedCellNavigation(sheetId))
    dispatch(updateSheetView(sheetViewId, { name: sheetViewName }))
  }

  const handleSheetViewNameInputFocus = () => {
    dispatch(preventSelectedCellEditing(sheetId))
    dispatch(preventSelectedCellNavigation(sheetId))
  }

  return (
    <Container
      isActiveSheetView={isActiveSheetView}
      userColorPrimary={userColorPrimary}>
      {sheetView.name 
        ? <SheetViewName
            onClick={() => handleNameContainerClick()}>
            {sheetView.name}
          </SheetViewName>
        : <AutosizeInput
            ref={sheetViewNameInput}
            className='input_placeholder_color_inherit'
            placeholder='Name...'
            value={sheetViewName || ''}
            onBlur={() => handleSheetViewNameInputBlur()}
            onChange={e => setSheetViewName(e.target.value)}
            onFocus={() => handleSheetViewNameInputFocus()}
            inputStyle={{
              paddingRight: '1.25rem',
              minWidth: '3rem',
              border: 'none',
              backgroundColor: 'transparent',
              color: 'inherit',
              outline: 'none',
              fontFamily: 'inherit',
              fontSize: 'inherit',
              fontWeight: 'inherit'
            }}/>
      }
      <SheetViewActions>
        <IconContainer
          isActive={sheetViews.length > 1 && !isActiveSheetView}
          onClick={(sheetViews.length > 1 && !isActiveSheetView) ? () => dispatch(deleteSheetView(sheetId, sheetViewId)) : () => null}>
          <Icon icon={CLOSE} size="0.88rem"/>
        </IconContainer>
      </SheetViewActions>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface ISheetActionCreateSheetViewSheetViewProps {
  sheetId: ISheet['id']
  sheetViewId: ISheetView['id'],
  closeDropdown(): void
  openDropdown(): void
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  min-width: 5rem;
  padding: 0.25rem 0.375rem 0.25rem 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${ ({ isActiveSheetView, userColorPrimary }: IContainer ) =>  isActiveSheetView ? userColorPrimary : 'transparent' };
  color: ${ ({ isActiveSheetView }: IContainer ) =>  isActiveSheetView ? 'white' : 'inherit' };
  &:hover {
    background-color: ${ ({ isActiveSheetView, userColorPrimary }: IContainer ) =>  isActiveSheetView ? userColorPrimary : 'rgb(220, 220, 220)' };
  }
`
interface IContainer {
  isActiveSheetView: boolean
  userColorPrimary: string
}

const SheetViewName = styled.div`
  padding-right: 1.25rem;
  font-size: inherit;
  color: inherit;
`

const SheetViewActions = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`

const IconContainer = styled.div`
  cursor: ${ ({ isActive }: IIconContainer ) => isActive ? 'pointer' : 'not-allowed' };
  padding: 0 0.125rem;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    opacity: 0.85;
  }
`
interface IIconContainer {
  isActive: boolean
}
//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetActionCreateSheetViewSheetView
