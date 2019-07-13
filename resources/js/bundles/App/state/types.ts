//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { AnyAction } from 'redux'
import { ThunkAction, ThunkDispatch } from 'redux-thunk'

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------
export type ThunkAction = ThunkAction<Promise<void>, {}, {}, AnyAction>
export type ThunkDispatch = ThunkDispatch<{}, {}, AnyAction>
