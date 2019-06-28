//-----------------------------------------------------------------------------
// @ts-ignore mouse-move
//-----------------------------------------------------------------------------
// addEventListener('mousemove') provides the event handler e.clientX, but the
// typings don't reflect that and throw an error

//-----------------------------------------------------------------------------
// @ts-ignore thunk-action
//-----------------------------------------------------------------------------
// In order to correctly type thunk actions, we need to add a lot of verbosity
// to both the action creator and all the dispatches calling the action creator.
// Because of this, I decided the typing was counterproductive - so anywhere a
// thunk action is dispatched, this @ts-ignore is needed
