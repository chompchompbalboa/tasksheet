//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { IAppState } from '@/state'
import { 
  ISheet,
  ISheetColumn,
  ISheetGanttRange 
} from '@/state/sheet/types'

import SheetCellGanttRangeDropdown from '@/bundles/Desktop/Sheet/SheetCellGanttRangeDropdown'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetCellGanttRangeMilestone = ({
  sheetId,
  columnId,
  sheetGanttRangeId,
  left
}: ISheetCellGanttRangeMilestone) => {

  // Refs
  const container = useRef(null)

  // Redux
  const userColorPrimary = useSelector((state: IAppState) => state.user.color.primary)

  // State
  const [ isDropdownVisible, setIsDropdownVisible ] = useState(false)

  // Add event handlers when dropdown is visible
  useEffect(() => {
    if(isDropdownVisible) {
      addEventListener('click', closeDropdownOnClickOutside)
    }
    else {
      removeEventListener('click', closeDropdownOnClickOutside)
    }
    return () => removeEventListener('click', closeDropdownOnClickOutside)
  }, [ isDropdownVisible ])

  // Close Dropdown On Click Outside
  const closeDropdownOnClickOutside = (e: Event) => {
    if(!container.current.contains(e.target)) {
      setIsDropdownVisible(false)
    }
  }

  return (
    <GanttMilestone
      ref={container}
      left={left}>
      <GanttMilestoneDot
        milestoneBackgroundColor={userColorPrimary}
        onClick={() => setIsDropdownVisible(true)}/>
      <SheetCellGanttRangeDropdown
        sheetId={sheetId}
        columnId={columnId}
        sheetGanttRangeId={sheetGanttRangeId}
        containerRef={container}
        isDropdownVisible={isDropdownVisible}
        setIsDropdownVisible={setIsDropdownVisible}/>
    </GanttMilestone>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface ISheetCellGanttRangeMilestone {
  sheetId: ISheet['id']
  columnId: ISheetColumn['id']
  sheetGanttRangeId: ISheetGanttRange['id']
  left: number
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const GanttMilestone = styled.div`
  z-index: 10;
  position: absolute;
  left: calc(0.25rem + ${ ({ left }: IGanttMilestone ) => left + '%' });
  height: 100%;
`
interface IGanttMilestone {
  left: number
}

const GanttMilestoneDot = styled.div`
  cursor: pointer;
  position: absolute;
  margin-top: 6px;
  width: 12px;
  height: 12px;
  border-radius: 4px;
  background-color: ${ ({ milestoneBackgroundColor }: IGanttMilestoneDot ) => milestoneBackgroundColor };
`
interface IGanttMilestoneDot {
  milestoneBackgroundColor: string
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetCellGanttRangeMilestone
