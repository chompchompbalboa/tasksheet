//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { CHEVRON_DOWN } from '@/assets/icons'

import { IAppState } from '@/state'
import { ISheetView } from '@/state/sheet/types'
import {
  loadSheetView
} from '@/state/sheet/actions'

import Icon from '@/components/Icon'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const TabsSheetViews = () => {

  // Refs
  const sheetViewsDropdown = useRef(null)

  // Redux
  const dispatch = useDispatch()
  const activeSheetId = useSelector((state: IAppState) => state.user.active.tab && state.folder.files[state.user.active.tab] && state.folder.files[state.user.active.tab].typeId)
  const activeSheetActiveSheetViewId = useSelector((state: IAppState) => state.sheet.allSheets && state.sheet.allSheets[activeSheetId] && state.sheet.allSheets[activeSheetId].activeSheetViewId)
  const activeSheetSheetViewIds = useSelector((state: IAppState) => state.sheet.allSheets && state.sheet.allSheets[activeSheetId] && state.sheet.allSheets[activeSheetId].views)
  const allSheetViews = useSelector((state: IAppState) => state.sheet.allSheetViews )
  const userColorPrimary = useSelector((state: IAppState) => state.user.color.primary)

  // Active Sheet View
  const activeSheetView: ISheetView = activeSheetActiveSheetViewId ? allSheetViews[activeSheetActiveSheetViewId] : null

  // Local state
  const [ isSheetViewsDropdownVisible, setIsSheetViewsDropdownVisible ] = useState(false)

  // Add mousedown listener to close the files dropdown on click outside
  useEffect(() => {
    isSheetViewsDropdownVisible
      ? addEventListener('mousedown', closeSheetViewsDropdownOnClickOutside)
      : removeEventListener('mousedown', closeSheetViewsDropdownOnClickOutside)
    return () => removeEventListener('mousedown', closeSheetViewsDropdownOnClickOutside)
  }, [ isSheetViewsDropdownVisible ])

  // Close Tabs Dropdown on Click Outside
  const closeSheetViewsDropdownOnClickOutside = (e: any) => {
    if(!sheetViewsDropdown.current.contains(e.target)) {
      setIsSheetViewsDropdownVisible(false)
    }
  }

  // Render
  return (
    <Container>
      <ActiveSheetView
        isSheetViewsDropdownVisible={isSheetViewsDropdownVisible}
        onClick={() => setIsSheetViewsDropdownVisible(true)}>
        <ActiveSheetViewName>
          {activeSheetView ? activeSheetView.name : 'Loading...'}
        </ActiveSheetViewName>
        <Icon icon={CHEVRON_DOWN}/>
      </ActiveSheetView>
      <SheetViewsDropdown
        ref={sheetViewsDropdown}
        isVisible={isSheetViewsDropdownVisible}>
        {activeSheetSheetViewIds && activeSheetSheetViewIds.map((sheetViewId) => (
          <SheetView
            key={sheetViewId}
            isActiveSheetView={activeSheetView.id === sheetViewId}
            onClick={() => {
              setIsSheetViewsDropdownVisible(false)
              dispatch(loadSheetView(activeSheetId, sheetViewId))
            }}
            userColorPrimary={userColorPrimary}>
            {allSheetViews[sheetViewId].name}
          </SheetView>
        ))}
      </SheetViewsDropdown>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  position: relative;
  width: 50%;
  display: flex;
  align-items: center;
`

const ActiveSheetView = styled.div`
  width: 100%;
  height: 100%;
  padding: 0 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: ${ ({ isSheetViewsDropdownVisible }: IActiveSheetView) => isSheetViewsDropdownVisible ? '1px solid white' : '1px solid rgb(220, 220, 220)' };
`
interface IActiveSheetView {
  isSheetViewsDropdownVisible: boolean
}

const ActiveSheetViewName = styled.div`
  width: 85%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const SheetViewsDropdown = styled.div`
  display: ${ ({ isVisible }: ISheetViewsDropdown) => isVisible ? 'block' : 'none' };
  position: absolute;
  top: 100%;
  left: -100%;
  width: 100vw;
  background-color: white;
  border-bottom: 2px solid rgb(220, 220, 220);
`
interface ISheetViewsDropdown {
  isVisible: boolean
}

const SheetView = styled.div`
  width: 100%;
  padding: 0.5rem;
  background-color: ${ ({ isActiveSheetView, userColorPrimary }: ISheetViewProps ) => isActiveSheetView ? userColorPrimary : 'transparent' };
  color: ${ ({ isActiveSheetView }: ISheetViewProps ) => isActiveSheetView ? 'white' : 'inherit' };
`
interface ISheetViewProps {
  isActiveSheetView: boolean
  userColorPrimary: string
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default TabsSheetViews
