//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { 
  IActiveSiteSplashForm,
  IActiveSiteSplashFormMessage
 } from '@/state/active/types'

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------
export type IActiveActions = IUpdateActiveSiteSplashForm | IUpdateActiveSiteSplashFormMessage

//-----------------------------------------------------------------------------
// Site Splash Form
//-----------------------------------------------------------------------------
export const UPDATE_ACTIVE_SITE_SPLASH_FORM = 'UPDATE_ACTIVE_SITE_SPLASH_FORM'
interface IUpdateActiveSiteSplashForm {
	type: typeof UPDATE_ACTIVE_SITE_SPLASH_FORM
	nextSiteSplashForm: IActiveSiteSplashForm
}

export const updateActiveSiteSplashForm = (nextSiteSplashForm: IActiveSiteSplashForm): IActiveActions => {
	return {
		type: UPDATE_ACTIVE_SITE_SPLASH_FORM,
		nextSiteSplashForm
	}
}

//-----------------------------------------------------------------------------
// Site Splash Form
//-----------------------------------------------------------------------------
export const UPDATE_ACTIVE_SITE_SPLASH_FORM_MESSAGE = 'UPDATE_ACTIVE_SITE_SPLASH_FORM_MESSAGE'
interface IUpdateActiveSiteSplashFormMessage {
	type: typeof UPDATE_ACTIVE_SITE_SPLASH_FORM_MESSAGE
	nextSiteSplashFormMessage: IActiveSiteSplashFormMessage
}

export const updateActiveSiteSplashFormMessage = (nextSiteSplashFormMessage: IActiveSiteSplashFormMessage): IActiveActions => {
	return {
		type: UPDATE_ACTIVE_SITE_SPLASH_FORM_MESSAGE,
		nextSiteSplashFormMessage
	}
}