//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { AnyAction } from 'redux'
import { ThunkAction, ThunkDispatch } from 'redux-thunk'

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------
export type IThunkAction = ThunkAction<Promise<void>, {}, {}, AnyAction>
export type IThunkDispatch = ThunkDispatch<{}, {}, AnyAction>
