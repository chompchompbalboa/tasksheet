//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { 
  IActiveSiteForm,
  IActiveSiteFormMessage
 } from '@/state/active/types'

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------
export type IActiveActions = IUpdateActiveSiteForm | IUpdateActiveSiteFormMessage

//-----------------------------------------------------------------------------
// Site Splash Form
//-----------------------------------------------------------------------------
export const UPDATE_ACTIVE_SITE_FORM = 'UPDATE_ACTIVE_SITE_FORM'
interface IUpdateActiveSiteForm {
	type: typeof UPDATE_ACTIVE_SITE_FORM
	nextSiteForm: IActiveSiteForm
}

export const updateActiveSiteForm = (nextSiteForm: IActiveSiteForm): IActiveActions => {
	return {
		type: UPDATE_ACTIVE_SITE_FORM,
		nextSiteForm
	}
}

//-----------------------------------------------------------------------------
// Site Splash Form
//-----------------------------------------------------------------------------
export const UPDATE_ACTIVE_SITE_FORM_MESSAGE = 'UPDATE_ACTIVE_SITE_FORM_MESSAGE'
interface IUpdateActiveSiteFormMessage {
	type: typeof UPDATE_ACTIVE_SITE_FORM_MESSAGE
	nextSiteFormMessage: IActiveSiteFormMessage
}

export const updateActiveSiteFormMessage = (nextSiteFormMessage: IActiveSiteFormMessage): IActiveActions => {
	return {
		type: UPDATE_ACTIVE_SITE_FORM_MESSAGE,
		nextSiteFormMessage
	}
}