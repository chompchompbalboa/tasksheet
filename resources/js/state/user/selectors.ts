//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { IAppState } from '@/state'

//-----------------------------------------------------------------------------
// Select User Colors
//-----------------------------------------------------------------------------
export const selectUserColors = (state: IAppState) => state.user.color

//-----------------------------------------------------------------------------
// Select User Color Primary
//-----------------------------------------------------------------------------
export const selectUserColorPrimary = (state: IAppState) => state.user.color.primary

//-----------------------------------------------------------------------------
// Select User Color Secondary
//-----------------------------------------------------------------------------
export const selectUserColorSecondary = (state: IAppState) => state.user.color.secondary
