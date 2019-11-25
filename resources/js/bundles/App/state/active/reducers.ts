//-----------------------------------------------------------------------------
// Initial
//-----------------------------------------------------------------------------
import { 
  IActiveSiteSplashForm,
  IActiveSiteSplashFormMessage 
} from '@app/state/active/types'
import { 
  IActiveActions,
  UPDATE_ACTIVE_SITE_SPLASH_FORM,
  UPDATE_ACTIVE_SITE_SPLASH_FORM_MESSAGE
} from '@app/state/active/actions'
//-----------------------------------------------------------------------------
// Initial
//-----------------------------------------------------------------------------
export const initialActiveState: IActiveState = {
  SITE_SPLASH_FORM: 'LOGIN',
  SITE_SPLASH_FORM_MESSAGE: 'CLICK_TO_REGISTER_INSTEAD'

}
export type IActiveState = {
  SITE_SPLASH_FORM: IActiveSiteSplashForm
  SITE_SPLASH_FORM_MESSAGE: IActiveSiteSplashFormMessage
}

//-----------------------------------------------------------------------------
// Reducers
//-----------------------------------------------------------------------------
export const activeReducer = (state = initialActiveState, action: IActiveActions): IActiveState => {
	switch (action.type) {

    case UPDATE_ACTIVE_SITE_SPLASH_FORM: {
      const { nextSiteSplashForm } = action
      return {
        ...state,
        SITE_SPLASH_FORM: nextSiteSplashForm
      }
    }

    case UPDATE_ACTIVE_SITE_SPLASH_FORM_MESSAGE: {
      const { nextSiteSplashFormMessage } = action
      return {
        ...state,
        SITE_SPLASH_FORM_MESSAGE: nextSiteSplashFormMessage
      }
    }

		default:
			return state
	}
}

export default activeReducer
