//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { AppState } from '@app/state'

//-----------------------------------------------------------------------------
// Select User Color Primary
//-----------------------------------------------------------------------------
export const selectUserColorPrimary = (state: AppState) => state.user.color.primary

//-----------------------------------------------------------------------------
// Select User Layout Sidebar Width
//-----------------------------------------------------------------------------
export const selectUserLayoutSidebarWidth = (state: AppState) => state.user.layout.sidebarWidth
