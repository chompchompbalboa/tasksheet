//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { AppState } from '@app/state'

//-----------------------------------------------------------------------------
// Select User Colors
//-----------------------------------------------------------------------------
export const selectUserColors = (state: AppState) => state.user.color

//-----------------------------------------------------------------------------
// Select User Color Primary
//-----------------------------------------------------------------------------
export const selectUserColorPrimary = (state: AppState) => state.user.color.primary

//-----------------------------------------------------------------------------
// Select User Color Secondary
//-----------------------------------------------------------------------------
export const selectUserColorSecondary = (state: AppState) => state.user.color.secondary

//-----------------------------------------------------------------------------
// Select User Layout Sheet Actions Height
//-----------------------------------------------------------------------------
export const selectUserLayoutSheetActionsHeight = (state: AppState) => state.user.layout.sheetActionsHeight

//-----------------------------------------------------------------------------
// Select User Layout Sidebar Width
//-----------------------------------------------------------------------------
export const selectUserLayoutSidebarWidth = (state: AppState) => state.user.layout.sidebarWidth

//-----------------------------------------------------------------------------
// Select User Layout Tabs Height
//-----------------------------------------------------------------------------
export const selectUserLayoutTabsHeight = (state: AppState) => state.user.layout.tabsHeight
